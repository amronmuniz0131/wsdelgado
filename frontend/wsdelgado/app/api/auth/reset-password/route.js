import bcrypt from "bcryptjs";
import { get, run } from "@/lib/db";
import { json, readJson, notEmpty } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.token) || !notEmpty(data.password)) {
    return json({ message: "Unable to reset password. Data is incomplete." }, 400);
  }

  const row = await get(
    `SELECT t.id, t.user_id, t.expires_at, t.used
       FROM password_reset_tokens t
      WHERE t.token = ? LIMIT 1`,
    [String(data.token)]
  );

  if (!row || row.used == 1 || new Date(row.expires_at) < new Date()) {
    return json({ message: "This reset link is invalid or has expired." }, 400);
  }

  const password = bcrypt.hashSync(String(data.password), 10);

  try {
    await run(
      "UPDATE users SET password = ?, first_login = 1, updated_at = datetime('now') WHERE id = ?",
      [password, row.user_id]
    );
    await run("UPDATE password_reset_tokens SET used = 1 WHERE id = ?", [row.id]);
    return json({ message: "Password has been reset. You can now log in." });
  } catch {
    return json({ message: "Unable to reset password." }, 503);
  }
}
