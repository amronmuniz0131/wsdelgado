import { get, run } from "@/lib/db";
import { json, readJson, notEmpty, num, has, nowTs, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update project. Data is incomplete." }, 400);
  }

  const id = num(data.id);
  const project = await get("SELECT id FROM projects WHERE id = ?", [id]);
  if (!project) {
    return json({ message: "Project not found." }, 404);
  }

  const sets = [];
  const args = [];
  if (has(data, "name")) {
    sets.push("name = ?");
    args.push(data.name);
  }
  if (has(data, "client")) {
    sets.push("client = ?");
    args.push(data.client);
  }
  if (has(data, "address")) {
    sets.push("address = ?");
    args.push(data.address);
  }
  if (has(data, "progress")) {
    sets.push("progress = ?");
    args.push(num(data.progress) ?? 0);
  }
  if (has(data, "foreman_id")) {
    sets.push("foreman_id = ?");
    args.push(num(data.foreman_id));
  }
  if (has(data, "engineer_id")) {
    sets.push("engineer_id = ?");
    args.push(num(data.engineer_id));
  }
  if (has(data, "start_date")) {
    sets.push("start_date = ?");
    args.push(toDate(data.start_date));
  }
  if (has(data, "end_date")) {
    sets.push("end_date = ?");
    args.push(toDate(data.end_date));
  }
  if (has(data, "completion_date")) {
    sets.push("completion_date = ?");
    args.push(toDate(data.completion_date));
  }

  sets.push("updated_at = ?");
  args.push(nowTs());
  args.push(id);

  try {
    await run(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`, args);
    return json({ message: "Project was updated." });
  } catch {
    return json({ message: "Unable to update project." }, 503);
  }
}
