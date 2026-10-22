import { run } from "@/lib/db";
import { json, readJson, notEmpty, num, nowTs, toDateTime } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.name)) {
    return json({ message: "Unable to create project. Data is incomplete." }, 400);
  }

  const ts = nowTs();
  try {
    await run(
      `INSERT INTO materials
         (name, quantity, unit, max_stock, last_restocked, price, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        num(data.quantity) ?? 0,
        data.uom ?? data.unit ?? "",
        num(data.max_stock) ?? 0,
        toDateTime(data.last_restocked) ?? ts,
        num(data.price) ?? 0,
        ts,
        ts,
      ],
    );
    return json({ message: "Material was created." }, 201);
  } catch {
    return json({ message: "Unable to create material." }, 503);
  }
}
