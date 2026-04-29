import { turso } from "@/lib/turso";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { message: "Unable to update user. Data is incomplete." },
        { status: 400 }
      );
    }

    // Fetch existing user data
    const userResult = await turso.execute({
      sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
      args: [data.id],
    });

    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    let passwordHash = user.password;
    let firstLogin = user.first_login;

    // Handle password update
    if (data.password) {
      // Check current password if not an admin update and not first login
      if (!data.is_admin_update && user.first_login !== 0) {
        if (!data.current_password) {
          return NextResponse.json(
            { message: "Current password is required." },
            { status: 401 }
          );
        }

        const passwordMatch = await bcrypt.compare(data.current_password, user.password);
        if (!passwordMatch) {
          return NextResponse.json(
            { message: "Current password is incorrect." },
            { status: 401 }
          );
        }
      }

      // Hash the new password
      passwordHash = await bcrypt.hash(data.password, 10);
      firstLogin = 1;
    }

    // Update user
    const name = data.name || user.name;
    const email = data.email || user.email;
    const role = data.role || user.role;

    await turso.execute({
      sql: "UPDATE users SET name = ?, email = ?, role = ?, password = ?, first_login = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      args: [name, email, role, passwordHash, firstLogin, data.id],
    });

    return NextResponse.json({ message: "User was updated." });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "An error occurred during update." },
      { status: 500 }
    );
  }
}
