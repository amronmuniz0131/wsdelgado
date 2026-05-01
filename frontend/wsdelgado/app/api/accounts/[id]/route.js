import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    let query = "UPDATE users SET name=?, email=?, role=?, updated_at=CURRENT_TIMESTAMP";
    let args = [data.name, data.email, data.role];

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      query += ", password=?";
      args.push(hashedPassword);
    }

    query += " WHERE id = ?";
    args.push(id);

    await turso.execute({ sql: query, args });

    return NextResponse.json({ message: "Account updated successfully." });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({ message: "Error updating account." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    // Delete related employee profile using employee_id format
    // await turso.execute({
    //   sql: "DELETE FROM employees WHERE employee_id = ?",
    //   args: [`EMP-${id}`],
    // });
    // Delete user record
    await turso.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    });
    return NextResponse.json({ message: "Account and employee deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ message: "Error deleting account." }, { status: 500 });
  }
}
