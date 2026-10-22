import { run } from "@/lib/db";
import { json, readJson, notEmpty, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to mark as read. Data is incomplete." }, 400);
  }

  try {
    await run("UPDATE inquiries SET is_read = 1 WHERE id = ?", [num(data.id)]);
    return json({ message: "Inquiry marked as read." });
  } catch {
    return json({ message: "Unable to mark inquiry as read." }, 503);
  }
}
