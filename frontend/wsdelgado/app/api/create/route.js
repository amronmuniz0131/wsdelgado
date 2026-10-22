import bcrypt from "bcryptjs";
import { get, run } from "@/lib/db";
import { json, readJson, notEmpty, nowTs, nowDate } from "@/lib/http";

export const dynamic = "force-dynamic";

function randomEmployeeCode() {
  return "EMP-" + Math.floor(Math.random() * 0xfffff).toString(16).padStart(5, "0").toUpperCase();
}

function isUniqueViolation(e) {
  const code = String((e && e.code) || "");
  return code.includes("SQLITE_CONSTRAINT") || /UNIQUE/i.test(String((e && e.message) || ""));
}

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name) || !notEmpty(data.email) || !notEmpty(data.password)) {
    return json({ message: "Unable to create user. Data is incomplete." }, 400);
  }

  const email = String(data.email);
  const existing = await get("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing) {
    return json({ message: "Email already exists.", error: 401 }, 401);
  }

  const role = notEmpty(data.role) ? String(data.role) : "user";
  const ts = nowTs();

  try {
    await run(
      `INSERT INTO users (name, email, password, role, first_login, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [String(data.name), email, bcrypt.hashSync(String(data.password), 10), role, 0, ts, ts]
    );
  } catch (e) {
    if (isUniqueViolation(e)) {
      return json({ message: "Email already exists.", error: 401 }, 401);
    }
    return json({ message: "Unable to create user." }, 503);
  }

  // Automatically create an employee profile for engineers and admins.
  if (role === "engineer" || role === "admin") {
    await run(
      `INSERT INTO employees (employee_id, name, email, position, date_of_employment, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomEmployeeCode(), String(data.name), email, role, nowDate(), "available", ts, ts]
    );
  }

  return json({ message: "User was created." }, 201);
}
