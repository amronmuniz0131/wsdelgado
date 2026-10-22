import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs, nowDate, toDate } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name) || !notEmpty(data.employeeId)) {
    return json({ message: "Unable to create employee. Data is incomplete." }, 400);
  }

  const ts = nowTs();
  try {
    await run(
      `INSERT INTO employees
         (employee_id, name, position, assigned_project_id, date_of_employment,
          status, email, phone, address, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(data.employeeId),
        data.name,
        data.position ?? "",
        num(data.assignedProjectId),
        toDate(data.dateOfEmployment) ?? nowDate(),
        data.status ?? "available",
        data.email ?? "",
        data.phone ?? "",
        data.address ?? "",
        data.notes ?? "",
        ts,
        ts,
      ]
    );
    return json({ message: "Employee was created." }, 201);
  } catch {
    return json({ message: "Unable to create employee." }, 503);
  }
}
