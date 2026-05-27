export interface UpdateEntry {
  id: string;
  title: string;
  date: string;
  summary: string;
  body: string;
}

const updateModules = import.meta.glob('../content/updates/*/index.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(source: string) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { meta: {} as Record<string, string>, body: source.trim() };

  const meta = match[1].split('\n').reduce<Record<string, string>>((acc, line) => {
    const separator = line.indexOf(':');
    if (separator === -1) return acc;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (key) acc[key] = value;
    return acc;
  }, {});

  return { meta, body: source.slice(match[0].length).trim() };
}

export const updates: UpdateEntry[] = Object.entries(updateModules)
  .map(([path, source]) => {
    const { meta, body } = parseFrontmatter(source);
    const id = path.split('/').slice(-2, -1)[0] || meta.date || meta.title || path;

    return {
      id,
      title: meta.title || '未命名更新',
      date: meta.date || 'unknown',
      summary: meta.summary || '',
      body,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

