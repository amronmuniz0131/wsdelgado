import { all } from "@/lib/db";
import { json, num } from "@/lib/http";

export const dynamic = "force-dynamic";

const BASE_SELECT = `
  SELECT th.id AS id,
         th.task_id AS task_id,
         th.employee_id AS employee_id,
         e.name AS employee_name,
         t.name AS task_name,
         t.project_id AS project_id,
         p.name AS project_name,
         t.finished AS is_finish,
         th.created_at AS created_at
  FROM task_history th
  LEFT JOIN employees e ON th.employee_id = e.id
  LEFT JOIN tasks t ON th.task_id = t.id
  LEFT JOIN projects p ON t.project_id = p.id`;

export async function GET(req) {
  const taskId = new URL(req.url).searchParams.get("task_id");

  const rows =
    taskId !== null
      ? await all(`${BASE_SELECT} WHERE th.task_id = ? ORDER BY th.created_at DESC`, [num(taskId)])
      : await all(`${BASE_SELECT} ORDER BY th.created_at DESC`);

  if (rows.length === 0) return json({ records: [] });

  const records = rows.map((r) => ({
    id: r.id,
    task_id: r.task_id,
    employee_id: r.employee_id,
    employee_name: r.employee_name ?? null,
    task_name: r.task_name ?? null,
    project_id: r.project_id ?? null,
    project_name: r.project_name ?? null,
    is_finish: r.is_finish ?? null,
    created_at: r.created_at,
  }));

  return json({ records });
}
