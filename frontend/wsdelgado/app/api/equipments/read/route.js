import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await all(
    `SELECT q.id, q.name, q.type, q.status,
            q.project_id, p.name AS project_name,
            q.operator_id, o.name AS operator_name,
            q.requested_by_id, r.name AS requested_by_name,
            q.borrow_date, q.return_date, q.is_approved, q.estimated_hours
       FROM equipments q
       LEFT JOIN projects p ON q.project_id = p.id
       LEFT JOIN employees o ON q.operator_id = o.id
       LEFT JOIN employees r ON q.requested_by_id = r.id
      ORDER BY q.created_at DESC`,
  );

  const records = rows.map((q) => ({
    id: q.id,
    name: q.name,
    type: q.type,
    status: q.status,
    projectId: q.project_id ?? null,
    projectName: q.project_name ?? null,
    operatorId: q.operator_id ?? null,
    operator: q.operator_name ?? null,
    requestedById: q.requested_by_id ?? null,
    requestedBy: q.requested_by_name ?? null,
    borrowDate: q.borrow_date ?? null,
    returnDate: q.return_date ?? null,
    is_approved: q.is_approved,
    estimatedHours: q.estimated_hours,
  }));

  return json({ records });
}
