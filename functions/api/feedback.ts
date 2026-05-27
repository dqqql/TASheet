interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB: D1Database;
}

interface FeedbackRow {
  id: string;
  content: string;
  nickname: string | null;
  created_at: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...jsonHeaders, ...init?.headers },
  });
}

function toClientMessage(row: FeedbackRow) {
  return {
    id: row.id,
    content: row.content,
    nickname: row.nickname || '',
    createdAt: row.created_at,
  };
}

async function userHash(request: Request) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '';
  const userAgent = request.headers.get('User-Agent') || '';
  const bytes = new TextEncoder().encode(`${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  if (!context.env.DB) {
    return json({ error: 'Feedback database is not configured.' }, { status: 503 });
  }

  const url = new URL(context.request.url);
  const rawLimit = Number(url.searchParams.get('limit') || 30);
  const limit = Math.max(1, Math.min(Number.isFinite(rawLimit) ? rawLimit : 30, 50));
  const { results = [] } = await context.env.DB
    .prepare(
      `SELECT id, content, nickname, created_at
       FROM feedback_messages
       WHERE is_hidden = 0
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<FeedbackRow>();

  return json({ messages: results.map(toClientMessage) });
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  if (!context.env.DB) {
    return json({ error: 'Feedback database is not configured.' }, { status: 503 });
  }

  let payload: { content?: unknown; nickname?: unknown };
  try {
    payload = await context.request.json();
  } catch {
    return json({ error: '请求格式无效。' }, { status: 400 });
  }

  const content = typeof payload.content === 'string' ? payload.content.trim() : '';
  const nickname = typeof payload.nickname === 'string' ? payload.nickname.trim() : '';

  if (!content) return json({ error: '请输入反馈内容。' }, { status: 400 });
  if (content.length > 800) return json({ error: '反馈内容最多 800 字。' }, { status: 400 });
  if (nickname.length > 24) return json({ error: '署名最多 24 字。' }, { status: 400 });

  const hash = await userHash(context.request);
  const recent = await context.env.DB
    .prepare(
      `SELECT COUNT(*) AS count
       FROM feedback_messages
       WHERE user_agent_hash = ?
       AND datetime(created_at) > datetime('now', '-1 minute')`,
    )
    .bind(hash)
    .first<{ count: number }>();

  if ((recent?.count ?? 0) >= 3) {
    return json({ error: '提交太频繁了，请稍后再试。' }, { status: 429 });
  }

  const id = crypto.randomUUID();
  await context.env.DB
    .prepare(
      `INSERT INTO feedback_messages (id, content, nickname, user_agent_hash)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(id, content, nickname || null, hash)
    .run();

  const row = await context.env.DB
    .prepare(
      `SELECT id, content, nickname, created_at
       FROM feedback_messages
       WHERE id = ?`,
    )
    .bind(id)
    .first<FeedbackRow>();

  return json({ message: row ? toClientMessage(row) : { id, content, nickname, createdAt: new Date().toISOString() } }, { status: 201 });
}

