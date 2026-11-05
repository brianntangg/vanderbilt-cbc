import { baseUrl, tokenSecret } from "@/lib/projects/config";
import { getMailer } from "@/lib/projects/mailer";
import { getStore } from "@/lib/projects/store";
import { handleSubmission } from "@/lib/projects/submit";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const result = await handleSubmission(body, {
    store: getStore(),
    mailer: getMailer(),
    secret: tokenSecret(),
    baseUrl: baseUrl(),
    ip,
    now: Date.now(),
  });
  return Response.json(result.body, { status: result.status });
}
