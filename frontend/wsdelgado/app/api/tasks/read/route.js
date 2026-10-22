import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  // Mirrors the legacy query: tasks ordered by end_date ASC, with the project
  // name and the GROUP_CONCAT of employee names from the LATEST task_history
  // row per task (the rows whose created_at equals MAX(created_at)).
  const rows = await all(
    `SELECT t.id, t.name, t.status, t.severity, t.project_id,
            p.name AS project_name,
            t.before_image, t.start_date, t.end_date, t.quantity, t.finished,
            t.actual_end, t.proof_image, t.notes,
            GROUP_CONCAT(e.name, ', ') AS assigned_employees
     FROM tasks t
     LEFT JOIN projects p ON p.id = t.project_id
     LEFT JOIN task_history th ON th.task_id = t.id
          AND th.created_at = (SELECT MAX(created_at) FROM task_history WHERE task_id = t.id)
     LEFT JOIN employees e ON e.id = th.employee_id
     GROUP BY t.id
     ORDER BY t.end_date ASC`
  );

  if (rows.length === 0) return json({ records: [] });

  const records = rows.map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status,
    severity: t.severity,
    project_id: t.project_id,
    project_name: t.project_name ?? null,
    before_image: t.before_image ?? null,
    start_date: t.start_date,
    end_date: t.end_date,
    quantity: t.quantity,
    finished: t.finished,
    actual_end: t.actual_end,
    proof_image: t.proof_image ?? null,
    notes: t.notes ?? null,
    assigned_employees: t.assigned_employees ?? null,
  }));

  return json({ records });
}
