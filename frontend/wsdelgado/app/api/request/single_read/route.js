import { get } from "@/lib/db";
import { json, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("id");

  const row = await get(
    `SELECT m.id AS id,
            m.material_id AS material_id,
            q.name AS material_name,
            m.quantity AS quantity,
            m.engineer_id AS engineer_id,
            e.name AS engineer_name,
            m.project_id AS project_id,
            p.name AS project_name,
            m.request_date AS request_date,
            m.is_approve AS is_approve
     FROM requests m
     LEFT JOIN employees e ON m.engineer_id = e.id
     LEFT JOIN projects p ON m.project_id = p.id
     LEFT JOIN materials q ON m.material_id = q.id
     WHERE m.id = ?
     LIMIT 1`,
    [num(id)]
  );

  if (!row) {
    return json({ message: "Request does not exist." }, 404);
  }

  return json({
    id: row.id,
    material_id: row.material_id,
    material_name: row.material_name ?? null,
    quantity: row.quantity,
    engineer_id: row.engineer_id,
    engineer_name: row.engineer_name ?? null,
    project_id: row.project_id,
    project_name: row.project_name ?? null,
    request_date: row.request_date,
    is_approve: row.is_approve,
  });
}
