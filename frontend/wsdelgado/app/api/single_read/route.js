import { get } from "@/lib/db";
import { json, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const id = num(req.nextUrl.searchParams.get("id"));

  const user = await get(
    "SELECT id, name, email, created_at, first_login FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  if (user) {
    return json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      first_login: user.first_login,
    });
  }
  return json({ message: "User does not exist." }, 404);
}
