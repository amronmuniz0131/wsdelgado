import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const query = `
      UPDATE materials 
      SET name=?, quantity=?, unit=?, max_stock=?, last_restocked=?, price=?, updated_at=CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.name,
      data.quantity || 0,
      data.unit || null,
      data.max_stock || 0,
      data.last_restocked || null,
      data.price || 0,
      id
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Material updated successfully." });
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json(
      { message: "Error updating material." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await turso.execute({
      sql: "DELETE FROM materials WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ message: "Material deleted successfully." });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { message: "Error deleting material." },
      { status: 500 }
    );
  }
}
