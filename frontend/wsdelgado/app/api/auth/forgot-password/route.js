import crypto from "crypto";
import { get, run } from "@/lib/db";
import { json, readJson, notEmpty } from "@/lib/http";
import { isSmtpConfigured, sendMail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const TOKEN_TTL_MINUTES = 30;

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.email)) {
    return json({ message: "Email is required." }, 400);
  }

  if (!isSmtpConfigured()) {
    return json(
      { message: "Unable to send reset email. SMTP is not configured." },
      503
    );
  }

  const email = String(data.email).trim().toLowerCase();
  const user = await get("SELECT id, name, email FROM users WHERE email = ? LIMIT 1", [email]);

  // Always respond OK to avoid revealing which emails exist.
  if (!user) {
    return json({ message: "If that email exists, a reset link has been sent." });
  }

  // Invalidate any previous unused tokens for this user.
  await run("UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0", [user.id]);

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  await run(
    "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
    [user.id, token, expiresAt]
  );

  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    await sendMail({
      to: user.email,
      subject: "Reset your password - WSDelgado Builders",
      html: `
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password. This link is valid for ${TOKEN_TTL_MINUTES} minutes.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
      text: `Hi ${user.name},\n\nReset your password (valid for ${TOKEN_TTL_MINUTES} minutes):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    });
  } catch {
    return json({ message: "Unable to send reset email. Please try again later." }, 503);
  }

  return json({ message: "If that email exists, a reset link has been sent." });
}
