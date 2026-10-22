import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const turso = createClient({
  url: url || "file:local.db",
  authToken,
});

// libSQL returns rows keyed by column name.
export async function all(sql, args = []) {
  const rs = await turso.execute({ sql, args });
  return rs.rows;
}

export async function get(sql, args = []) {
  const rows = await all(sql, args);
  return rows.length ? rows[0] : null;
}

export async function run(sql, args = []) {
  const rs = await turso.execute({ sql, args });
  return {
    rowsAffected: Number(rs.rowsAffected),
    lastInsertRowid: Number(rs.lastInsertRowid),
  };
}
