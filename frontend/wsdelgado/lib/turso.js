import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  // In development, we can fallback to a local sqlite file if needed, 
  // but for Turso migration we expect these to be set.
  console.warn("TURSO_DATABASE_URL is not defined. Database connections will fail.");
}

export const turso = createClient({
  url: url || "file:local.db",
  authToken: authToken,
});
