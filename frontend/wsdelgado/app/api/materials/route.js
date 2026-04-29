import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = "SELECT * FROM materials ORDER BY name ASC";
    const result = await turso.execute(query);

    return NextResponse.json({ records: result.rows });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { message: "Error fetching materials." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { message: "Incomplete data. Material name is required." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO materials (name, quantity, unit, max_stock, last_restocked, price) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const args = [
      data.name,
      data.quantity || 0,
      data.unit || null,
      data.max_stock || 0,
      data.last_restocked || null,
      data.price || 0
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json(
      { message: "Material created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json(
      { message: "Error creating material." },
      { status: 500 }
    );
  }
}
