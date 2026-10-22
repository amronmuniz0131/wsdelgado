import { run } from "@/lib/db";
import { json, readJson, notEmpty, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to delete. Album ID is required." }, 400);
  }

  const id = num(data.id);
  try {
    await run("DELETE FROM gallery_albums WHERE id = ?", [id]);
    // gallery_images has ON DELETE CASCADE in the legacy schema.
    await run("DELETE FROM gallery_images WHERE album_id = ?", [id]);
    return json({ message: "Album was deleted." });
  } catch {
    return json({ message: "Unable to delete album." }, 503);
  }
}
