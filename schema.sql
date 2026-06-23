-- Photo index for the gallery. Apply with:
--   npx wrangler d1 execute portfolio-photos --remote --file=./schema.sql
CREATE TABLE IF NOT EXISTS photos (
  id         TEXT PRIMARY KEY,
  key        TEXT NOT NULL,        -- R2 object key (the stored file name)
  caption    TEXT,
  category   TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos (created_at DESC);
