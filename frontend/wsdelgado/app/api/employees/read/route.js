import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  // Mirrors the legacy query: employees sorted by created_at DESC, joined to the
  // newest task_history row per employee (created_at DESC, id DESC), then tasks/projects.
  const rows = await all(
    `SELECT e.id, e.employee_id, e.name, e.position, e.assigned_project_id,
            e.date_of_employment, e.status, e.email, e.phone, e.address, e.notes,
            COALESCE(ap.name, p.name) AS project_name,
            p.id AS project_id_task,
            t.name AS task_name,
            t.finished AS is_finished
     FROM employees e
     LEFT JOIN projects ap ON e.assigned_project_id = ap.id
     LEFT JOIN task_history th ON th.id = (
       SELECT th2.id
       FROM task_history th2
       WHERE th2.employee_id = e.id
       ORDER BY th2.created_at DESC, th2.id DESC
       LIMIT 1
     )
     LEFT JOIN tasks t ON th.task_id = t.id
     LEFT JOIN projects p ON t.project_id = p.id
     ORDER BY e.created_at DESC`
  );

  const records = rows.map((e) => ({
    id: e.id,
    employeeId: e.employee_id,
    name: e.name,
    position: e.position,
    assignedProjectId: e.assigned_project_id ?? null,
    assignedProject: e.project_name ?? null,
    dateOfEmployment: e.date_of_employment,
    status: e.status,
    email: e.email,
    phone: e.phone,
    address: e.address,
    notes: e.notes,
    tasks: e.task_name ?? null,
    is_finished: e.is_finished ?? null,
    project_id_task: e.project_id_task ?? null,
  }));

  return json({ records });
}
