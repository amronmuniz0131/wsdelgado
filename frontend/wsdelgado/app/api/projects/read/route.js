import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  // Mirrors the legacy query: projects sorted by created_at DESC, with the
  // foreman/engineer names from employees and the client name from users.
  const rows = await all(
    `SELECT p.id, p.name, p.client, p.address, p.progress,
            p.foreman_id, p.engineer_id,
            f.name AS foreman_name, u.name AS engineer_name, c.name AS client_name,
            p.updated_at, p.start_date, p.end_date, p.completion_date
     FROM projects p
     LEFT JOIN employees f ON f.id = p.foreman_id
     LEFT JOIN employees u ON u.id = p.engineer_id
     LEFT JOIN users c ON c.id = p.client
     ORDER BY p.created_at DESC`
  );

  if (rows.length === 0) return json({ records: [] });

  const records = rows.map((p) => ({
    id: p.id,
    name: p.name,
    client: p.client,
    address: p.address,
    progress: p.progress,
    foremanId: p.foreman_id ?? null,
    engineerId: p.engineer_id ?? null,
    foremanName: p.foreman_name ?? null,
    engineerName: p.engineer_name ?? null,
    clientName: p.client_name ?? null,
    updated_at: p.updated_at,
    start_date: p.start_date ?? null,
    end_date: p.end_date ?? null,
    completion_date: p.completion_date ?? null,
  }));

  return json({ records });
}
