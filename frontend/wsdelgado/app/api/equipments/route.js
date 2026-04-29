import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT q.*, p.name as project_name, o.name as operator_name, r.name as requested_by_name 
      FROM equipments q
      LEFT JOIN projects p ON q.project_id = p.id
      LEFT JOIN employees o ON q.operator_id = o.id
      LEFT JOIN employees r ON q.requested_by_id = r.id
      ORDER BY q.created_at DESC
    `;

    const result = await turso.execute(query);

    // Map keys to match the frontend expectations (projectId, operator, etc.)
    const records = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      projectId: row.project_id,
      projectName: row.project_name,
      operatorId: row.operator_id,
      operator: row.operator_name,
      requestedById: row.requested_by_id,
      requestedBy: row.requested_by_name,
      borrowDate: row.borrow_date,
      returnDate: row.return_date,
      is_approved: row.is_approved,
      estimatedHours: row.estimated_hours
    }));

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching equipments:", error);
    return NextResponse.json(
      { message: "Error fetching equipments." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { message: "Incomplete data. Equipment name is required." },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO equipments (
        name, type, status, project_id, operator_id, 
        requested_by_id, estimated_hours, borrow_date, return_date, is_approved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const args = [
      data.name,
      data.type || null,
      data.status || 'Available',
      data.projectId || data.project_id || null,
      data.operatorId || data.operator_id || null,
      data.requestedById || data.requested_by_id || null,
      data.estimatedHours || data.estimated_hours || 0,
      data.borrowDate || data.borrow_date || null,
      data.returnDate || data.return_date || null,
      data.is_approved || 0
    ];

    await turso.execute({ sql: query, args });

    return NextResponse.json(
      { message: "Equipment created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating equipment:", error);
    return NextResponse.json(
      { message: "Error creating equipment." },
      { status: 500 }
    );
  }
}
