CREATE TABLE IF NOT EXISTS admin_daily_summaries (
  id TEXT PRIMARY KEY,
  summary_date TEXT NOT NULL,
  sent_to TEXT NOT NULL,
  sent_at TEXT,
  report_count INTEGER NOT NULL DEFAULT 0,
  inquiry_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (status IN ('pending', 'sent', 'failed', 'skipped'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_daily_summaries_date_recipient
ON admin_daily_summaries(summary_date, sent_to)
WHERE status = 'sent';

CREATE INDEX IF NOT EXISTS idx_admin_daily_summaries_created_at
ON admin_daily_summaries(created_at);
