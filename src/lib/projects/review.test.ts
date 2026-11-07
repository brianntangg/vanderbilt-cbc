import { describe, expect, it } from "vitest";
import { decideReview, loadReview } from "./review";
import { createMemoryStore } from "./store-memory";
import { signToken, TOKEN_TTL_MS } from "./token";
import type { Project } from "./types";

const secret = "test-secret";
const now = 1_700_000_000_000;

function project(): Omit<Project, "id"> {
  return {
    title: "Study buddy",
    url: "https://github.com/someone/study-buddy",
    type: "GitHub",
    description: "A flashcard maker.",
    name: "Sam Student",
    email: "sam@vanderbilt.edu",
    status: "pending",
    createdAt: now,
  };
}

async function setup() {
  const store = createMemoryStore();
  const { id } = await store.create(project());
  return { store, id, ctx: { store, secret, now }, token: signToken(id, secret, now) };
}

describe("review", () => {
  it("loadReview does not change status (GET safety)", async () => {
    const { id, store, ctx, token } = await setup();
    await loadReview(token, ctx);
    const second = await loadReview(token, ctx);
    expect(second.state).toBe("ready");
    expect((await store.get(id))?.status).toBe("pending");
  });

  it("approve publishes once; second approve returns already-handled", async () => {
    const { id, store, ctx, token } = await setup();
    expect(await decideReview(token, "approve", ctx)).toBe("approved");
    expect(await decideReview(token, "approve", ctx)).toBe("already-handled");
    expect((await store.listApproved()).map((p) => p.id)).toEqual([id]);
  });

  it("approved project appears in store.listApproved without the email", async () => {
    const { store, ctx, token } = await setup();
    await decideReview(token, "approve", ctx);
    const [listed] = await store.listApproved();
    expect(listed.title).toBe("Study buddy");
    expect("email" in listed).toBe(false);
  });

  it("reject then approve returns already-handled and project stays unlisted", async () => {
    const { store, ctx, token } = await setup();
    expect(await decideReview(token, "reject", ctx)).toBe("rejected");
    expect(await decideReview(token, "approve", ctx)).toBe("already-handled");
    expect(await store.listApproved()).toEqual([]);
  });

  it("loadReview on a handled project returns already-handled", async () => {
    const { ctx, token } = await setup();
    await decideReview(token, "approve", ctx);
    expect((await loadReview(token, ctx)).state).toBe("already-handled");
  });

  it("expired token returns expired and project stays pending", async () => {
    const { id, store, ctx, token } = await setup();
    const late = { ...ctx, now: now + TOKEN_TTL_MS };
    expect(await decideReview(token, "approve", late)).toBe("expired");
    expect((await loadReview(token, late)).state).toBe("expired");
    expect((await store.get(id))?.status).toBe("pending");
  });

  it("tampered token returns invalid", async () => {
    const { ctx } = await setup();
    const forged = signToken("any-id", "wrong-secret", now);
    expect(await decideReview(forged, "approve", ctx)).toBe("invalid");
    expect((await loadReview("garbage", ctx)).state).toBe("invalid");
  });

  it("valid token for a missing project returns invalid", async () => {
    const { ctx } = await setup();
    const token = signToken("ghost", secret, now);
    expect(await decideReview(token, "approve", ctx)).toBe("invalid");
    expect((await loadReview(token, ctx)).state).toBe("invalid");
  });
});
