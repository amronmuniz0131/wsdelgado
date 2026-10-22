import { run } from "@/lib/db";
import { json, readJson, notEmpty } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const data = await readJson(req);

  if (!notEmpty(data.position)) {
    return json({ message: "Unable to create position. Data is incomplete." }, 400);
  }

  try {
    await run("INSERT INTO positions (position) VALUES (?)", [data.position]);
    return json({ message: "Position was created." }, 201);
  } catch {
    return json({ message: "Unable to create position." }, 503);
  }
}
