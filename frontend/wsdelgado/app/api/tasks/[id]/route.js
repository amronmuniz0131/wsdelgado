import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const query = `
      SELECT t.*, p.name as project_name, GROUP_CONCAT(e.name, ', ') as assigned_employees
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN task_history th ON th.task_id = t.id 
          AND th.created_at = (SELECT MAX(created_at) FROM task_history WHERE task_id = t.id)
      LEFT JOIN employees e ON th.employee_id = e.id
      WHERE t.id = ?
      GROUP BY t.id
    `;

    const result = await turso.execute({ sql: query, args: [id] });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ message: "Error fetching task." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const query = `
      UPDATE tasks 
      SET name=?, status=?, severity=?, project_id=?, 
          start_date=?, end_date=?, quantity=?, finished=?,
          updated_at=CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.name,
      data.status || 'pending',
      data.severity || 0,
      data.project_id,
      data.start_date || null,
      data.end_date || null,
      data.quantity || 0,
      data.finished || 0,
      id
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Task updated successfully." });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Error updating task." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await turso.execute({
      sql: "DELETE FROM tasks WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ message: "Error deleting task." }, { status: 500 });
  }
}
