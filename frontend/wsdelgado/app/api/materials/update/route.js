import { get, run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs, toDateTime } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update material. ID is missing." }, 400);
  }

  const id = num(data.id);
  const material = await get("SELECT id FROM materials WHERE id = ?", [id]);
  if (!material) {
    return json({ message: "Unable to update material." }, 503);
  }

  try {
    await run(
      `UPDATE materials
          SET name = ?, quantity = ?, unit = ?, last_restocked = ?, price = ?, max_stock = ?, updated_at = ?
        WHERE id = ?`,
      [
        data.name ?? "",
        num(data.quantity) ?? 0,
        data.uom ?? data.unit ?? "",
        toDateTime(data.last_restocked) ?? nowTs(),
        num(data.price) ?? 0,
        num(data.max_stock) ?? 0,
        nowTs(),
        id,
      ],
    );
    return json({ message: "Material was updated." });
  } catch {
    return json({ message: "Unable to update material." }, 503);
  }
}
