import bcrypt from "bcryptjs";
import { get } from "@/lib/db";
import { json, readJson, notEmpty } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.email) || !notEmpty(data.password)) {
    return json({ message: "Login failed. Incomplete data." }, 400);
  }

  const user = await get(
    "SELECT id, name, email, password, role, first_login FROM users WHERE email = ? LIMIT 1",
    [String(data.email)]
  );
  if (
    user &&
    user.password &&
    bcrypt.compareSync(String(data.password), user.password)
  ) {
    return json({
      message: "Login successful.",
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      first_login: user.first_login,
    });
  }
  return json({ message: "Login failed. Invalid email or password." }, 401);
}
