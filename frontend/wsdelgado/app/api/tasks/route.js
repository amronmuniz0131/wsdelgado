import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT t.*, p.name as project_name, GROUP_CONCAT(e.name, ', ') as assigned_employees
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN task_history th ON th.task_id = t.id 
      LEFT JOIN employees e ON th.employee_id = e.id
      GROUP BY t.id
      ORDER BY t.end_date ASC
    `;

    const result = await turso.execute(query);

    return NextResponse.json({
      records: result.rows,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.project_id) {
      return NextResponse.json(
        { message: "Incomplete data." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO tasks (
        name, status, project_id, start_date, end_date, finished
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const args = [
      data.name,
      data.status || 'pending',
      data.project_id,
      data.start_date || null,
      data.end_date || null,
      data.finished || 0
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json(
      { message: "Task created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Error creating task." },
      { status: 500 }
    );
  }
}
