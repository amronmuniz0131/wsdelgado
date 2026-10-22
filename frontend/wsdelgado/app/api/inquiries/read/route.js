import { all } from "@/lib/db";
import { json, decodeEntities } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const inquiries = await all(
    "SELECT id, name, email, subject, message, is_read, created_at FROM inquiries ORDER BY created_at DESC"
  );
  if (inquiries.length === 0) {
    return json({ records: [], unread_count: 0, message: "No inquiries found." });
  }

  let unreadCount = 0;
  const records = inquiries.map((r) => {
    if (r.is_read === 0) unreadCount++;

    return {
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      message: decodeEntities(r.message),
      is_read: r.is_read,
      created_at: r.created_at,
    };
  });

  return json({ records, unread_count: unreadCount });
}
