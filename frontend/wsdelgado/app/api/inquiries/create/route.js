import { run } from "@/lib/db";
import { json, readJson, notEmpty, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (
    !notEmpty(data.name) ||
    !notEmpty(data.email) ||
    !notEmpty(data.subject) ||
    !notEmpty(data.message)
  ) {
    return json({ message: "Unable to create inquiry. Data is incomplete." }, 400);
  }

  try {
    await run(
      `INSERT INTO inquiries (name, email, subject, message, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.name, data.email, data.subject, data.message, 0, nowTs()]
    );
    return json({ message: "Inquiry was created." }, 201);
  } catch {
    return json({ message: "Unable to create inquiry." }, 503);
  }
}
