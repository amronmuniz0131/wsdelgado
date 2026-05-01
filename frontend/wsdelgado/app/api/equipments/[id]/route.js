import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const query = `
      UPDATE equipments 
      SET name = COALESCE(?, name),
          type = COALESCE(?, type),
          status = COALESCE(?, status),
          project_id = COALESCE(?, project_id),
          operator_id = COALESCE(?, operator_id),
          requested_by_id = COALESCE(?, requested_by_id),
          estimated_hours = COALESCE(?, estimated_hours),
          borrow_date = COALESCE(?, borrow_date),
          return_date = COALESCE(?, return_date),
          is_approved = COALESCE(?, is_approved),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.name || null,
      data.type || null,
      data.status || null,
      data.projectId || data.project_id || null,
      data.operatorId || data.operator_id || null,
      data.requestedById || data.requested_by_id || null,
      data.estimatedHours || data.estimated_hours || null,
      data.borrowDate || data.borrow_date || null,
      data.returnDate || data.return_date || null,
      data.is_approved !== undefined ? data.is_approved : null,
      id
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Equipment updated successfully." });
  } catch (error) {
    console.error("Error updating equipment:", error);
    return NextResponse.json(
      { message: "Error updating equipment." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await turso.execute({
      sql: "DELETE FROM equipments WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Equipment deleted successfully." });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return NextResponse.json(
      { message: "Error deleting equipment." },
      { status: 500 }
    );
  }
}
