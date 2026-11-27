import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update service. ID is missing." }, 400);
  }

  try {
    await run(
      `UPDATE services
         SET name = ?, description = ?, image = ?, sort_order = ?, updated_at = ?
       WHERE id = ?`,
      [
        data.name ?? "",
        data.description ?? null,
        data.image ?? null,
        num(data.sort_order) ?? 0,
        nowTs(),
        num(data.id),
      ]
    );

    return json({ message: "Service was updated." });
  } catch {
    return json({ message: "Unable to update service." }, 503);
  }
}
