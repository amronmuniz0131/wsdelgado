import { get, run } from "@/lib/db";
import { json, readJson, notEmpty, num, has, nowTs, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update equipment. ID is missing." }, 400);
  }

  const id = num(data.id);
  const equipment = await get("SELECT id FROM equipments WHERE id = ?", [id]);
  if (!equipment) {
    return json({ message: "Equipment not found." }, 404);
  }

  const set = [];
  const args = [];

  if (has(data, "name")) {
    set.push("name = ?");
    args.push(data.name);
  }
  if (has(data, "type")) {
    set.push("type = ?");
    args.push(data.type);
  }
  if (has(data, "status")) {
    set.push("status = ?");
    args.push(data.status);
  }
  if (has(data, "project_id")) {
    set.push("project_id = ?");
    args.push(num(data.project_id));
  }
  if (has(data, "operator_id")) {
    set.push("operator_id = ?");
    args.push(num(data.operator_id));
  }
  if (has(data, "requested_by_id")) {
    set.push("requested_by_id = ?");
    args.push(num(data.requested_by_id));
  }
  if (has(data, "estimated_hours")) {
    set.push("estimated_hours = ?");
    args.push(num(data.estimated_hours) ?? 0);
  }
  if (has(data, "borrow_date")) {
    set.push("borrow_date = ?");
    args.push(toDate(data.borrow_date));
  }
  if (has(data, "return_date")) {
    set.push("return_date = ?");
    args.push(toDate(data.return_date));
  }
  if (has(data, "is_approved")) {
    set.push("is_approved = ?");
    args.push(num(data.is_approved) ?? 0);
  }

  set.push("updated_at = ?");
  args.push(nowTs());

  try {
    await run(`UPDATE equipments SET ${set.join(", ")} WHERE id = ?`, [...args, id]);
    return json({ message: "Equipment was updated." });
  } catch {
    return json({ message: "Unable to update equipment." }, 503);
  }
}
