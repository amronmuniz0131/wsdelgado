import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await turso.execute({
      sql: "SELECT * FROM requests WHERE id = ? LIMIT 1",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Request not found." }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({ message: "Error fetching request." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Fetch existing data first to handle partial updates if needed, 
    // or just use the provided data.
    const query = `
      UPDATE requests 
      SET material_id=?, quantity=?, engineer_id=?, project_id=?, 
          request_date=?, is_approve=?
      WHERE id = ?
    `;

    const args = [
      data.material_id,
      data.quantity,
      data.engineer_id || null,
      data.project_id || null,
      data.request_date || null,
      data.is_approve || null,
      id
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Request was updated." });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ message: "Error updating request." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await turso.execute({
      sql: "DELETE FROM requests WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Request deleted successfully." });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json({ message: "Error deleting request." }, { status: 500 });
  }
}
