import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    const query = "UPDATE inquiries SET is_read = 1 WHERE id = ?";
    await turso.execute({ sql: query, args: [id] });

    return NextResponse.json({ message: "Inquiry marked as read." });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { message: "Error updating inquiry." },
      { status: 500 }
    );
  }
}
