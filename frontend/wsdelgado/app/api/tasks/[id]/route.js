import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const query = `
      SELECT t.*, p.name as project_name, GROUP_CONCAT(e.name, ', ') as assigned_employees
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN task_history th ON th.task_id = t.id 
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
    const { id } = await params;
    const data = await request.json();

    const query = `
      UPDATE tasks 
      SET name = COALESCE(?, name),
          status = COALESCE(?, status),
          severity = COALESCE(?, severity),
          project_id = COALESCE(?, project_id),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date),
          quantity = COALESCE(?, quantity),
          finished = COALESCE(?, finished),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.name || null,
      data.status || null,
      data.severity || null,
      data.project_id || null,
      data.start_date || null,
      data.end_date || null,
      data.quantity || null,
      data.finished || null,
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
    const { id } = await params;

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
