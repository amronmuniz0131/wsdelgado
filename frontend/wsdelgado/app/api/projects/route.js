import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT p.*, f.name as foreman_name, u.name as engineer_name, c.name as client_name 
      FROM projects p
      LEFT JOIN employees f ON p.foreman_id = f.id
      LEFT JOIN employees u ON p.engineer_id = u.id
      LEFT JOIN users c ON p.client = c.id
      ORDER BY p.created_at DESC
    `;

    const result = await turso.execute(query);

    return NextResponse.json({
      records: result.rows,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Error fetching projects." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { message: "Incomplete data. Project name is required." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO projects (
        name, location, client, address, progress, 
        foreman_id, engineer_id, start_date, end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.end_date || null
    ];

    const result = await turso.execute({ sql: query, args });

    return NextResponse.json(
      { 
        message: "Project created successfully.",
        id: result.lastInsertRowid?.toString()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Error creating project." },
      { status: 500 }
    );
  }
}
