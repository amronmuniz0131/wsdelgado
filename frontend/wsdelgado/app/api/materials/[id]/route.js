import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const query = `
      UPDATE materials 
      SET name = COALESCE(?, name),
          quantity = COALESCE(?, quantity),
          unit = COALESCE(?, unit),
          max_stock = COALESCE(?, max_stock),
          last_restocked = COALESCE(?, last_restocked),
          price = COALESCE(?, price),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const args = [
      data.name || null,
      data.quantity !== undefined ? data.quantity : null,
      data.unit || null,
      data.max_stock !== undefined ? data.max_stock : null,
      data.last_restocked || null,
      data.price !== undefined ? data.price : null,
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
    const { id } = await params;

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
