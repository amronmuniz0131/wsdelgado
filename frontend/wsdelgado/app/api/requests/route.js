import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT r.*, m.name as material_name, e.name as engineer_name, p.name as project_name
      FROM requests r
      LEFT JOIN materials m ON r.material_id = m.id
      LEFT JOIN employees e ON r.engineer_id = e.id
      LEFT JOIN projects p ON r.project_id = p.id
      ORDER BY r.request_date DESC
    `;
    const result = await turso.execute(query);
    return NextResponse.json({ records: result.rows });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ message: "Error fetching requests." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.material_id) {
      return NextResponse.json(
        { message: "Unable to create request. Data is incomplete." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO requests (material_id, quantity, engineer_id, project_id, request_date, is_approve) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const args = [
      data.material_id,
      data.quantity || 0,
      data.engineer_id || null,
      data.project_id || null,
      data.request_date || new Date().toISOString().split('T')[0],
      data.is_approve || null
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json(
      { message: "Request was created." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { message: "Error creating request." },
      { status: 500 }
    );
  }
}
