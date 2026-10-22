import { run } from "@/lib/db";
import { json, readJson, notEmpty, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to delete user. Data is incomplete." }, 400);
  }

  try {
    await run("DELETE FROM users WHERE id = ?", [num(data.id)]);
    return json({ message: "User was deleted." });
  } catch {
    return json({ message: "Unable to delete user." }, 503);
  }
}
