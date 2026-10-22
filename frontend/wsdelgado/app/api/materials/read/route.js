import { all } from "@/lib/db";
import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await all(
    `SELECT id, name, quantity, unit, last_restocked, max_stock, price
       FROM materials
      ORDER BY name ASC`,
  );

  const records = rows.map((m) => ({
    id: m.id,
    name: m.name,
    quantity: m.quantity,
    unit: m.unit,
    lastRestocked: m.last_restocked ?? null,
    max_stock: m.max_stock,
    price: m.price,
    uom: m.unit,
  }));

  return json({ records });
}
