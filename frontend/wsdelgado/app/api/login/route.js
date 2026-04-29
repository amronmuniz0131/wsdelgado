import { turso } from "@/lib/turso";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Login failed. Incomplete data." },
        { status: 400 }
      );
    }

    // Use turso to find the user
    const result = await turso.execute({
      sql: "SELECT id, name, email, password, role, first_login FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "Login failed. Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Login failed. Invalid email or password." },
        { status: 401 }
      );
    }

    // Success response matching the PHP format
    return NextResponse.json({
      message: "Login successful.",
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      first_login: user.first_login,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 }
    );
  }
}
