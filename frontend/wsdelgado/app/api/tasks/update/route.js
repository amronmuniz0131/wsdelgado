import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, has, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

const FIELDS = [
  "name",
  "status",
  "severity",
  "project_id",
  "start_date",
  "end_date",
  "actual_end",
  "proof_image",
  "before_image",
  "notes",
  "quantity",
  "finished",
];

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update task. ID is missing." }, 400);
  }

  // PHP loads the existing row then overrides only the keys present in the
  // request body, so a partial UPDATE here behaves identically.
  const sets = [];
  const args = [];
  for (const key of FIELDS) {
    if (has(data, key)) {
      let value = data[key];
      if (typeof value === "boolean") value = value ? 1 : 0;
      else if (value === undefined) value = null;
      sets.push(`${key} = ?`);
      args.push(value);
    }
  }

  sets.push("updated_at = ?");
  args.push(nowTs());
  args.push(num(data.id));

  try {
    await run(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`, args);
    return json({ message: "Task was updated." });
  } catch {
    return json({ message: "Unable to update task." }, 503);
  }
}
