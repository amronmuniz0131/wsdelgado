// Creates the password_reset_tokens table against the configured database.
// Usage: node --env-file=.env.local scripts/create-reset-table.cjs
const { createClient } = require("@libsql/client");

const c = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  await c.execute(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const rs = await c.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'password_reset_tokens'"
  );
  console.log("Table ready on", process.env.TURSO_DATABASE_URL ? "remote Turso DB" : "local.db");
  console.log("Found:", JSON.stringify(rs.rows));
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
