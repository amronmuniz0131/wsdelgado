import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name)) {
    return json({ message: "Unable to create project. Data is incomplete." }, 400);
  }

  const ts = nowTs();
  try {
    const { lastInsertRowid } = await run(
      `INSERT INTO projects
         (name, client, address, progress, foreman_id, engineer_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.client ?? "",
        data.address ?? "",
        num(data.progress) ?? 0,
        num(data.foremanId),
        num(data.engineerId),
        ts,
        ts,
      ]
    );
    return json({ message: "Project was created.", id: lastInsertRowid }, 201);
  } catch {
    return json({ message: "Unable to create project." }, 503);
  }
}
