import bcrypt from "bcryptjs";
import { get, run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

function isUniqueViolation(e) {
  const code = String((e && e.code) || "");
  return code.includes("SQLITE_CONSTRAINT") || /UNIQUE/i.test(String((e && e.message) || ""));
}

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update user. Data is incomplete." }, 400);
  }

  const user = await get(
    "SELECT id, name, email, password, role, first_login FROM users WHERE id = ? LIMIT 1",
    [num(data.id)]
  );
  if (!user) {
    return json({ message: "User not found." }, 404);
  }

  const name = notEmpty(data.name) ? String(data.name) : user.name;
  const email = notEmpty(data.email) ? String(data.email) : user.email;
  const role = notEmpty(data.role) ? String(data.role) : user.role;

  let password = null;
  let first_login = user.first_login;

  if (notEmpty(data.password)) {
    const isAdminUpdate = notEmpty(data.is_admin_update);
    if (!isAdminUpdate && String(user.first_login) !== "0") {
      if (
        !notEmpty(data.current_password) ||
        !bcrypt.compareSync(String(data.current_password), user.password)
      ) {
        return json({ message: "Current password is incorrect." }, 401);
      }
    }
    password = bcrypt.hashSync(String(data.password), 10);
    first_login = 1;
  }

  const ts = nowTs();

  try {
    if (password !== null) {
      await run(
        `UPDATE users
         SET name = ?, email = ?, role = ?, first_login = ?, password = ?, updated_at = ?
         WHERE id = ?`,
        [name, email, role, first_login, password, ts, user.id]
      );
    } else {
      await run(
        `UPDATE users
         SET name = ?, email = ?, role = ?, first_login = ?, updated_at = ?
         WHERE id = ?`,
        [name, email, role, first_login, ts, user.id]
      );
    }
    return json({ message: "User was updated." });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return json({ message: "Email already exists." }, 401);
    }
    return json({ message: "Unable to update user." }, 503);
  }
}
