import type { ProjectStore } from "./store";
import { verifyToken } from "./token";
import type { Project } from "./types";

type ReviewContext = { store: ProjectStore; secret: string; now: number };
type Problem = "invalid" | "expired" | "already-handled";

async function resolve(token: string, ctx: ReviewContext): Promise<{ project: Project } | { problem: Problem }> {
  const verified = verifyToken(token, ctx.secret, ctx.now);
  if (!verified.ok) return { problem: verified.reason === "expired" ? "expired" : "invalid" };
  const project = await ctx.store.get(verified.id);
  if (!project) return { problem: "invalid" };
  if (project.status !== "pending") return { problem: "already-handled" };
  return { project };
}

/** Read-only: opening the link (a GET) must never change a project's status. */
export async function loadReview(
  token: string,
  ctx: ReviewContext,
): Promise<{ state: "ready"; project: Project } | { state: Problem }> {
  const found = await resolve(token, ctx);
  return "project" in found ? { state: "ready", project: found.project } : { state: found.problem };
}

export async function decideReview(
  token: string,
  action: "approve" | "reject",
  ctx: ReviewContext,
): Promise<"approved" | "rejected" | Problem> {
  const found = await resolve(token, ctx);
  if ("problem" in found) return found.problem;

  const to = action === "approve" ? "approved" : "rejected";
  // transition re-checks "pending", so two quick clicks can't both win.
  return (await ctx.store.transition(found.project.id, to, ctx.now)) ? to : "already-handled";
}
