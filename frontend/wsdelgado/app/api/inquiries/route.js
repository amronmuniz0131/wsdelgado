import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = "SELECT * FROM inquiries ORDER BY created_at DESC";
    const result = await turso.execute(query);

    // Calculate unread count similar to the PHP API
    const unreadCount = result.rows.filter(row => row.is_read === 0).length;

    return NextResponse.json({
      records: result.rows,
      unread_count: unreadCount
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { message: "Error fetching inquiries." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { message: "Incomplete data." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO inquiries (name, email, subject, message) 
      VALUES (?, ?, ?, ?)
    `;

    const args = [
      data.name,
      data.email,
      data.subject || '',
      data.message
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json(
      { message: "Inquiry submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return NextResponse.json(
      { message: "Error submitting inquiry." },
      { status: 500 }
    );
  }
}
