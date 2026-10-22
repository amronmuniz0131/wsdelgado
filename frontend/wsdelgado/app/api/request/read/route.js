import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await all(`
    SELECT m.id AS id,
           m.material_id AS material_id,
           q.name AS material_name,
           m.quantity AS quantity,
           m.engineer_id AS engineer_id,
           e.name AS engineer_name,
           m.project_id AS project_id,
           p.name AS project_name,
           m.request_date AS request_date,
           m.is_approve AS is_approve,
           m.notes AS notes
    FROM requests m
    LEFT JOIN employees e ON m.engineer_id = e.id
    LEFT JOIN projects p ON m.project_id = p.id
    LEFT JOIN materials q ON m.material_id = q.id
    ORDER BY m.request_date DESC`);

  if (rows.length === 0) return json({ records: [] });

  const records = rows.map((r) => ({
    id: r.id,
    material_id: r.material_id,
    material_name: r.material_name ?? null,
    quantity: r.quantity,
    engineer_id: r.engineer_id,
    engineer_name: r.engineer_name ?? null,
    project_id: r.project_id,
    project_name: r.project_name ?? null,
    request_date: r.request_date,
    is_approve: r.is_approve,
    notes: r.notes,
  }));

  return json({ records });
}
