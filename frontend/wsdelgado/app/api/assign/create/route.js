import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.task_id) || !notEmpty(data.employee_id)) {
    return json({ message: "Unable to create assignment. Data is incomplete." }, 400);
  }

  const ts = nowTs();
  const taskId = num(data.task_id);

  try {
    if (Array.isArray(data.employee_id)) {
      for (const empId of data.employee_id) {
        await run(
          "INSERT INTO task_history (task_id, employee_id, created_at) VALUES (?, ?, ?)",
          [taskId, num(empId), ts]
        );
      }
      return json({ message: "Assignments created successfully." }, 201);
    }

    await run(
      "INSERT INTO task_history (task_id, employee_id, created_at) VALUES (?, ?, ?)",
      [taskId, num(data.employee_id), ts]
    );
    return json({ message: "Assignment created." }, 201);
  } catch {
    return json({ message: "Unable to create assignment." }, 503);
  }
}
