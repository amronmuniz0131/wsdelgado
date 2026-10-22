import { run } from "@/lib/db";
import { json, readJson, notEmpty, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.task_id) || !notEmpty(data.employee_id)) {
    return json({ message: "Unable to delete assignment. Data is incomplete." }, 400);
  }

  try {
    await run("DELETE FROM task_history WHERE task_id = ? AND employee_id = ?", [
      num(data.task_id),
      num(data.employee_id),
    ]);
    return json({ message: "Assignment was deleted." });
  } catch {
    return json({ message: "Unable to delete assignment." }, 503);
  }
}
