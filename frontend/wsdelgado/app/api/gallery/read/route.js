import { all } from "@/lib/db";
import { json, decodeEntities } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const albums = await all(
    "SELECT id, title, caption, cover_image, created_at FROM gallery_albums ORDER BY created_at DESC"
  );
  if (albums.length === 0) {
    return json({ records: [], message: "No albums found." });
  }

  const images = await all(
    "SELECT id, album_id, title, caption, image FROM gallery_images ORDER BY created_at ASC"
  );
  const imagesByAlbum = new Map();
  for (const img of images) {
    if (!imagesByAlbum.has(img.album_id)) imagesByAlbum.set(img.album_id, []);
    imagesByAlbum.get(img.album_id).push({
      id: img.id,
      title: decodeEntities(img.title),
      caption: decodeEntities(img.caption),
      image: img.image,
    });
  }

  const records = albums.map((a) => ({
    id: a.id,
    title: decodeEntities(a.title),
    caption: decodeEntities(a.caption),
    cover_image: a.cover_image,
    created_at: a.created_at,
    images: imagesByAlbum.get(a.id) || [],
  }));

  return json({ records });
}
