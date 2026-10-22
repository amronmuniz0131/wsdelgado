import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const positions = await all("SELECT id, position FROM positions ORDER BY position ASC");

  return json({
    records: positions.map((p) => ({ id: p.id, position: p.position })),
  });
}
