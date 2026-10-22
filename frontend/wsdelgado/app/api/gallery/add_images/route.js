import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (
    !notEmpty(data.album_id) ||
    !Array.isArray(data.images) ||
    data.images.length === 0
  ) {
    return json(
      { message: "Unable to add images. Album ID and at least one image are required." },
      400
    );
  }

  const ts = nowTs();
  const albumId = num(data.album_id);

  try {
    for (const img of data.images) {
      await run(
        `INSERT INTO gallery_images (album_id, title, caption, image, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [albumId, img.title ?? null, img.caption ?? null, img.image ?? null, ts]
      );
    }
    return json({ message: "Images were added to the album." }, 201);
  } catch {
    return json({ message: "Unable to add images to the album." }, 503);
  }
}
