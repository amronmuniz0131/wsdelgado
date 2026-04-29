import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await turso.execute("SELECT id, position FROM positions ORDER BY position ASC");
    return NextResponse.json({ records: result.rows });
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { message: "Error fetching positions." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.position) {
      return NextResponse.json({ message: "Position name is required." }, { status: 400 });
    }

    await turso.execute({
      sql: "INSERT INTO positions (position) VALUES (?)",
      args: [data.position],
    });

    return NextResponse.json({ message: "Position created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error creating position:", error);
    return NextResponse.json({ message: "Error creating position." }, { status: 500 });
  }
}
