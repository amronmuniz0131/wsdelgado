import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name)) {
    return json({ message: "Unable to create equipment. Data is incomplete." }, 400);
  }

  const ts = nowTs();
  try {
    await run(
      `INSERT INTO equipments
         (name, type, status, project_id, operator_id, requested_by_id,
          estimated_hours, borrow_date, return_date, is_approved, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.type ?? "",
        data.status ?? "Available",
        num(data.project_id),
        num(data.operator_id),
        num(data.requested_by_id),
        notEmpty(data.estimated_hours) ? num(data.estimated_hours) : 0,
        toDate(data.borrow_date),
        toDate(data.return_date),
        num(data.is_approved) ?? 0,
        ts,
        ts,
      ],
    );
    return json({ message: "Equipment was created." }, 201);
  } catch {
    return json({ message: "Unable to create equipment." }, 503);
  }
}
