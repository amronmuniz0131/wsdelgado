import { get } from "@/lib/db";
import { json, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const id = num(req.nextUrl.searchParams.get("id"));

  const project = await get(
    `SELECT p.id, p.name, p.client, p.address, p.progress,
            p.foreman_id, p.engineer_id,
            f.name AS foreman_name, u.name AS engineer_name, c.name AS client_name,
            p.created_at, p.updated_at, p.start_date, p.end_date, p.completion_date
     FROM projects p
     LEFT JOIN employees f ON f.id = p.foreman_id
     LEFT JOIN employees u ON u.id = p.engineer_id
     LEFT JOIN users c ON c.id = p.client
     WHERE p.id = ?`,
    [id]
  );

  if (!project) {
    return json({ message: "Project does not exist." }, 404);
  }

  return json({
    id: project.id,
    name: project.name,
    client: project.client,
    address: project.address,
    progress: project.progress,
    foreman_id: project.foreman_id ?? null,
    engineer_id: project.engineer_id ?? null,
    foreman_name: project.foreman_name ?? null,
    engineer_name: project.engineer_name ?? null,
    client_name: project.client_name ?? null,
    created_at: project.created_at,
    updated_at: project.updated_at,
    start_date: project.start_date ?? null,
    end_date: project.end_date ?? null,
    completion_date: project.completion_date ?? null,
  });
}
