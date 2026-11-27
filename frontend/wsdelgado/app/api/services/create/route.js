import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name)) {
    return json({ message: "Unable to create service. Data is incomplete." }, 400);
  }

  const ts = nowTs();

  try {
    const result = await run(
      `INSERT INTO services (name, description, image, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description ?? null,
        data.image ?? null,
        num(data.sort_order) ?? 0,
        ts,
        ts,
      ]
    );

    return json({ message: "Service was created.", id: result.lastInsertRowid }, 201);
  } catch {
    return json({ message: "Unable to create service." }, 503);
  }
}
