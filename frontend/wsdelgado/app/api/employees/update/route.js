import { get, run } from "@/lib/db";
import { json, readJson, notEmpty, num, has, nowTs, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update employee. Data is incomplete." }, 400);
  }

  const id = num(data.id);
  const employee = await get("SELECT id FROM employees WHERE id = ?", [id]);
  if (!employee) {
    return json({ message: "Unable to update employee." }, 503);
  }

  const sets = [];
  const args = [];

  if (has(data, "employeeId")) {
    sets.push("employee_id = ?");
    args.push(String(data.employeeId));
  }
  if (has(data, "name")) {
    sets.push("name = ?");
    args.push(data.name);
  }
  if (has(data, "position")) {
    sets.push("position = ?");
    args.push(data.position);
  }
  if (has(data, "assignedProjectId")) {
    sets.push("assigned_project_id = ?");
    args.push(num(data.assignedProjectId));
  }
  if (has(data, "dateOfEmployment")) {
    sets.push("date_of_employment = ?");
    args.push(toDate(data.dateOfEmployment));
  }
  if (has(data, "status")) {
    sets.push("status = ?");
    args.push(data.status);
  }
  if (has(data, "email")) {
    sets.push("email = ?");
    args.push(data.email);
  }
  if (has(data, "phone")) {
    sets.push("phone = ?");
    args.push(data.phone);
  }
  if (has(data, "address")) {
    sets.push("address = ?");
    args.push(data.address);
  }
  if (has(data, "notes")) {
    sets.push("notes = ?");
    args.push(data.notes);
  }

  sets.push("updated_at = ?");
  args.push(nowTs());
  args.push(id);

  try {
    await run(`UPDATE employees SET ${sets.join(", ")} WHERE id = ?`, args);
    return json({ message: "Employee was updated." });
  } catch {
    return json({ message: "Unable to update employee." }, 503);
  }
}
