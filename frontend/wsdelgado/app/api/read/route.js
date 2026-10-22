import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = await all(
    "SELECT id, name, email, password, role, created_at FROM users"
  );

  if (users.length > 0) {
    return json({
      records: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        created_at: u.created_at,
      })),
    });
  }
  return json({ message: "No users found." }, 404);
}
