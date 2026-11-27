import { all } from "@/lib/db";
import { json, decodeEntities } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await all(
    "SELECT id, name, description, image, sort_order FROM services ORDER BY sort_order ASC, id ASC"
  );

  return json({
    records: services.map((s) => ({
      id: s.id,
      name: decodeEntities(s.name),
      description: decodeEntities(s.description),
      image: s.image,
      sort_order: s.sort_order,
    })),
  });
}
