import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.material_id)) {
    return json({ message: "Unable to create request. Data is incomplete." }, 400);
  }

  try {
    await run(
      "INSERT INTO requests (material_id, quantity, engineer_id, project_id, request_date, is_approve, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        num(data.material_id),
        num(data.quantity),
        num(data.engineer_id),
        num(data.project_id),
        toDate(data.request_date),
        num(data.is_approve),
        data.notes ?? "",
      ]
    );
    return json({ message: "Request was created." }, 201);
  } catch {
    return json({ message: "Unable to create request." }, 503);
  }
}
