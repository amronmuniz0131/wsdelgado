import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await turso.execute("SELECT id, name, email, role, first_login, created_at FROM users ORDER BY name ASC");
    return NextResponse.json({ records: result.rows });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json({ message: "Error fetching accounts." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ message: "Incomplete data." }, { status: 400 });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await turso.execute({
      sql: "INSERT INTO users (name, email, password, role, first_login) VALUES (?, ?, ?, ?, ?)",
      args: [data.name, data.email, hashedPassword, data.role || 'user', 0],
    });

    return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json({ message: "Error creating account." }, { status: 500 });
  }
}
