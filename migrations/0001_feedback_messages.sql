CREATE TABLE IF NOT EXISTS feedback_messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  nickname TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  user_agent_hash TEXT,
  is_hidden INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_feedback_messages_visible_created_at
  ON feedback_messages (is_hidden, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_messages_user_agent_created_at
  ON feedback_messages (user_agent_hash, created_at DESC);
