import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, has, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

const UPDATABLE_FIELDS = [
  "material_id",
  "quantity",
  "engineer_id",
  "project_id",
  "request_date",
  "is_approve",
  "notes",
];

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update request. ID is missing." }, 400);
  }

  // PHP loads the row first and overrides only the provided keys.
  const sets = [];
  const args = [];
  for (const key of UPDATABLE_FIELDS) {
    if (has(data, key)) {
      sets.push(`${key} = ?`);
      if (key === "request_date") {
        args.push(toDate(data[key]));
      } else if (key === "notes" || key === "is_approve") {
        args.push(data[key]);
      } else {
        args.push(num(data[key]));
      }
    }
  }

  try {
    if (sets.length > 0) {
      args.push(num(data.id));
      await run(`UPDATE requests SET ${sets.join(", ")} WHERE id = ?`, args);
    }
    return json({ message: "Request was updated." });
  } catch {
    return json({ message: "Unable to update request." }, 503);
  }
}
