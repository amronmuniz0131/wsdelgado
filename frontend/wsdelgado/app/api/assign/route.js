import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');

    let query;
    let args = [];

    if (taskId) {
      query = `
        SELECT th.*, e.name as employee_name, t.name as task_name, p.id as project_id, p.name as project_name
        FROM task_history th
        LEFT JOIN employees e ON th.employee_id = e.id
        LEFT JOIN tasks t ON th.task_id = t.id
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE th.task_id = ?
        ORDER BY th.created_at DESC
      `;
      args = [taskId];
    } else {
      query = `
        SELECT th.*, e.name as employee_name, t.name as task_name, p.id as project_id, p.name as project_name
        FROM task_history th
        LEFT JOIN employees e ON th.employee_id = e.id
        LEFT JOIN tasks t ON th.task_id = t.id
        LEFT JOIN projects p ON t.project_id = p.id
        ORDER BY th.created_at DESC
      `;
    }

    const result = await turso.execute({ sql: query, args });

    return NextResponse.json({ records: result.rows });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { message: "Error fetching assignments." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.task_id || !data.employee_id) {
      return NextResponse.json(
        { message: "Unable to create assignment. Data is incomplete." },
        { status: 400 }
      );
    }

    const employeeIds = Array.isArray(data.employee_id) ? data.employee_id : [data.employee_id];

    // Use a transaction for multiple inserts if possible, 
    // or just execute them in a loop for simplicity with libSQL.
    for (const empId of employeeIds) {
      await turso.execute({
        sql: "INSERT INTO task_history (task_id, employee_id) VALUES (?, ?)",
        args: [data.task_id, empId],
      });
    }

    return NextResponse.json(
      { message: "Assignments created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { message: "Error creating assignment." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const taskId = searchParams.get('task_id');
    const employeeId = searchParams.get('employee_id');

    if (id) {
      await turso.execute({
        sql: "DELETE FROM task_history WHERE id = ?",
        args: [id],
      });
    } else if (taskId && employeeId) {
      await turso.execute({
        sql: "DELETE FROM task_history WHERE task_id = ? AND employee_id = ?",
        args: [taskId, employeeId],
      });
    } else {
      return NextResponse.json(
        { message: "Incomplete data for deletion." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Assignment deleted successfully." });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { message: "Error deleting assignment." },
      { status: 500 }
    );
  }
}
