import { buildReviewEmail } from "./email";
import type { Mailer } from "./mailer";
import type { ProjectStore } from "./store";
import { signToken } from "./token";
import type { Project } from "./types";
import { validateSubmission } from "./validation";

export type SubmitContext = {
  store: ProjectStore;
  mailer: Mailer;
  secret: string;
  baseUrl: string;
  ip: string;
  now: number;
};

export type SubmitResult = {
  status: 200 | 400 | 429 | 502;
  body: { ok: boolean; errors?: Record<string, string>; message?: string };
};

const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 60 * 60;

export async function handleSubmission(body: unknown, ctx: SubmitContext): Promise<SubmitResult> {
  // Bots fill the hidden "website" field. Pretend it worked so they don't adapt.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return { status: 200, body: { ok: true } };
  }

  if (!(await ctx.store.hit(`submit:${ctx.ip}`, RATE_LIMIT, RATE_WINDOW_SECONDS))) {
    return { status: 429, body: { ok: false, message: "Too many submissions. Please try again later." } };
  }

  const result = validateSubmission(body);
  if (!result.ok) return { status: 400, body: { ok: false, errors: result.errors } };

  const project: Project = { ...result.value, id: crypto.randomUUID(), status: "pending", createdAt: ctx.now };
  await ctx.store.create(project);

  try {
    const reviewUrl = `${ctx.baseUrl}/projects/review/${signToken(project.id, ctx.secret, ctx.now)}`;
    await ctx.mailer(buildReviewEmail(project, reviewUrl));
  } catch (error) {
    console.error("[projects] could not send review email", error);
    await ctx.store.remove(project.id);
    return { status: 502, body: { ok: false, message: "We couldn't send your project for review. Please try again." } };
  }

  return { status: 200, body: { ok: true } };
}
