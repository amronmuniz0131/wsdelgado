import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name)) {
    return json({ message: "Unable to create task. Data is incomplete." }, 400);
  }

  const ts = nowTs();
  try {
    await run(
      `INSERT INTO tasks
         (name, status, severity, project_id, start_date, end_date, actual_end,
          quantity, finished, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.status ?? null,
        data.severity ?? null,
        num(data.project_id),
        data.start_date ?? null,
        data.end_date ?? null,
        null,
        num(data.quantity),
        num(data.finished) ?? 0,
        ts,
        ts,
      ]
    );
    return json({ message: "Task was created." }, 201);
  } catch {
    return json({ message: "Unable to create task." }, 503);
  }
}
