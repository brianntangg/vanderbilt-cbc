import { buildReviewEmail } from "./email";
import type { Mailer } from "./mailer";
import type { ProjectStore } from "./store";
import { signToken } from "./token";
import { validateSubmission } from "./validation";

export type SubmitContext = {
  store: ProjectStore;
  mailer: Mailer;
  secret: string;
  baseUrl: string;
  now: number;
};

export type SubmitResult = {
  status: 200 | 400 | 429 | 502;
  body: { ok: boolean; errors?: Record<string, string>; message?: string };
};

/** Unreviewed submissions one address may have waiting. Stops a single person flooding the board's inbox. */
const MAX_PENDING_PER_EMAIL = 3;

export async function handleSubmission(body: unknown, ctx: SubmitContext): Promise<SubmitResult> {
  // Bots fill the hidden "website" field. Pretend it worked so they don't adapt.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return { status: 200, body: { ok: true } };
  }

  const result = validateSubmission(body);
  if (!result.ok) return { status: 400, body: { ok: false, errors: result.errors } };

  if ((await ctx.store.countPendingByEmail(result.value.email)) >= MAX_PENDING_PER_EMAIL) {
    return { status: 429, body: { ok: false, message: "You already have projects waiting for review. Please wait for a decision." } };
  }

  const project = await ctx.store.create({ ...result.value, status: "pending", createdAt: ctx.now });

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
