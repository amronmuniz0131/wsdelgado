import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT e.*, 
             COALESCE(ap.name, p.name) as project_name, 
             p.id as project_id_task, 
             t.name as task_name, 
             t.finished as is_finished
      FROM employees e
      LEFT JOIN projects ap ON e.assigned_project_id = ap.id
      LEFT JOIN task_history th ON th.id = (
          SELECT id FROM task_history 
          WHERE employee_id = e.id 
          ORDER BY created_at DESC, id DESC 
          LIMIT 1
      )
      LEFT JOIN tasks t ON th.task_id = t.id
      LEFT JOIN projects p ON t.project_id = p.id
      ORDER BY e.created_at DESC
    `;

    const result = await turso.execute(query);

    return NextResponse.json({
      records: result.rows,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { message: "Error fetching employees." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Basic validation (can be replaced with Zod)
    if (!data.name || !data.employee_id) {
      return NextResponse.json(
        { message: "Incomplete data." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO employees (
        employee_id, name, position, assigned_project_id, 
        date_of_employment, status, email, phone, address, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const args = [
      data.employee_id,
      data.name,
      data.position || null,
      data.assigned_project_id || null,
      data.date_of_employment || new Date().toISOString().split('T')[0],
      data.status || 'available',
      data.email || null,
      data.phone || null,
      data.address || null,
      data.notes || ''
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json(
      { message: "Employee created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { message: "Error creating employee." },
      { status: 500 }
    );
  }
}
