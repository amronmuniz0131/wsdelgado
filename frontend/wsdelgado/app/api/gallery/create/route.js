import { run } from "@/lib/db";
import { json, readJson, notEmpty, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (
    !notEmpty(data.title) ||
    !Array.isArray(data.images) ||
    data.images.length === 0
  ) {
    return json(
      { message: "Unable to create album. Title and at least one image are required." },
      400
    );
  }

  const ts = nowTs();
  try {
    const album = await run(
      `INSERT INTO gallery_albums (title, caption, cover_image, created_at)
       VALUES (?, ?, ?, ?)`,
      [data.title, data.caption ?? "", data.images[0].image ?? null, ts]
    );
    const albumId = album.lastInsertRowid;

    for (const img of data.images) {
      await run(
        `INSERT INTO gallery_images (album_id, title, caption, image, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [albumId, img.title ?? null, img.caption ?? null, img.image ?? null, ts]
      );
    }

    return json({ message: "Album was created." }, 201);
  } catch {
    return json({ message: "Unable to create album." }, 503);
  }
}
