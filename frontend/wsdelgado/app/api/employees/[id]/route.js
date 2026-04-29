import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await turso.execute({
      sql: "SELECT * FROM employees WHERE id = ? LIMIT 1",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Employee not found." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ message: "Error fetching employee." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const query = `
      UPDATE employees 
      SET employee_id=?, name=?, position=?, assigned_project_id=?, 
          date_of_employment=?, status=?, email=?, phone=?, address=?, notes=?,
          updated_at=CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.employee_id,
      data.name,
      data.position || null,
      data.assigned_project_id || null,
      data.date_of_employment || null,
      data.status || 'available',
      data.email || null,
      data.phone || null,
      data.address || null,
      data.notes || '',
      id
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Employee updated successfully." });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ message: "Error updating employee." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await turso.execute({
      sql: "DELETE FROM employees WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ message: "Error deleting employee." }, { status: 500 });
  }
}
