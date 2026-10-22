import { run } from "@/lib/db";
import { json, readJson, notEmpty, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to delete. Image ID is required." }, 400);
  }

  try {
    await run("DELETE FROM gallery_images WHERE id = ?", [num(data.id)]);
    return json({ message: "Image was deleted." });
  } catch {
    return json({ message: "Unable to delete image." }, 503);
  }
}
