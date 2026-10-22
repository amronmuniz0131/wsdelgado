import { json, readJson, notEmpty } from "@/lib/http";

export const dynamic = "force-dynamic";

// The legacy PHP endpoint relied on XAMPP's sendmail configuration. No SMTP
// transport is configured for the Node backend, so this reports the same
// failure the PHP version produced when its mail transport was unavailable.
export async function POST(req) {
  const data = await readJson(req);

  if (
    !notEmpty(data.name) ||
    !notEmpty(data.email) ||
    !notEmpty(data.subject) ||
    !notEmpty(data.message)
  ) {
    return json({ message: "Unable to send email. Data is incomplete." }, 400);
  }

  return json(
    { message: "Unable to send email. SMTP is not configured." },
    503
  );
}
