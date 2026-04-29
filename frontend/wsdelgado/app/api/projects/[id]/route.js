import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const query = `
      SELECT p.*, f.name as foreman_name, u.name as engineer_name, c.name as client_name 
      FROM projects p
      LEFT JOIN employees f ON p.foreman_id = f.id
      LEFT JOIN employees u ON p.engineer_id = u.id
      LEFT JOIN users c ON p.client = c.id
      WHERE p.id = ? LIMIT 1
    `;

    const result = await turso.execute({ sql: query, args: [id] });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ message: "Error fetching project." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const query = `
      UPDATE projects 
      SET name=?, location=?, client=?, address=?, progress=?, 
          foreman_id=?, engineer_id=?, start_date=?, end_date=?, completion_date=?,
          updated_at=CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.name,
      data.location || null,
      data.client || null,
      data.address || null,
      data.progress || 0,
      data.foreman_id || null,
      data.engineer_id || null,
      data.start_date || null,
      data.end_date || null,
      data.completion_date || null,
      id
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Project updated successfully." });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ message: "Error updating project." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await turso.execute({
      sql: "DELETE FROM projects WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Error deleting project." }, { status: 500 });
  }
}
