import { run } from "@/lib/db";
import { json, readJson, notEmpty, num } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.id)) {
    return json({ message: "Unable to update position. ID is missing." }, 400);
  }

  try {
    await run("UPDATE positions SET position = ? WHERE id = ?", [
      data.position ?? "",
      num(data.id),
    ]);
    return json({ message: "Position was updated." });
  } catch {
    return json({ message: "Unable to update position." }, 503);
  }
}
