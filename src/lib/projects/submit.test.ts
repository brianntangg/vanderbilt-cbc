import { describe, expect, it } from "vitest";
import type { Mail, Mailer } from "./mailer";
import { handleSubmission } from "./submit";
import { createMemoryStore } from "./store-memory";
import { verifyToken } from "./token";

const secret = "test-secret";
const baseUrl = "https://example.test";
const now = 1_700_000_000_000;

const body = {
  title: "Study buddy",
  url: "https://github.com/someone/study-buddy",
  type: "GitHub",
  description: "A flashcard maker.",
  name: "Sam Student",
  email: "sam@vanderbilt.edu",
  website: "",
};

function setup(mailer?: Mailer) {
  const sent: Mail[] = [];
  const created: string[] = [];
  const removed: string[] = [];
  const store = createMemoryStore();
  const { create, remove } = store;
  store.create = async (project) => {
    created.push(project.id);
    await create(project);
  };
  store.remove = async (id) => {
    removed.push(id);
    await remove(id);
  };
  const fake: Mailer = mailer ?? (async (mail) => void sent.push(mail));
  const ctx = { store, mailer: fake, secret, baseUrl, ip: "1.2.3.4", now };
  return { sent, created, removed, store, ctx };
}

describe("handleSubmission", () => {
  it("valid submission stores a pending project and sends one email containing a verifiable review link", async () => {
    const { sent, store, ctx } = setup();
    const result = await handleSubmission(body, ctx);
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(sent).toHaveLength(1);

    const link = sent[0].text.match(/https:\/\/example\.test\/projects\/review\/(\S+)/);
    expect(link).not.toBeNull();
    const verified = verifyToken(link![1], secret, now);
    expect(verified.ok).toBe(true);
    if (verified.ok) {
      const project = await store.get(verified.id);
      expect(project?.status).toBe("pending");
      expect(project?.title).toBe("Study buddy");
    }
  });

  it("invalid submission returns 400 with field errors and sends nothing", async () => {
    const { sent, ctx } = setup();
    const result = await handleSubmission({ ...body, url: "http://insecure.test" }, ctx);
    expect(result.status).toBe(400);
    expect(result.body.errors?.url).toBeTruthy();
    expect(sent).toHaveLength(0);
  });

  it("non-vanderbilt email returns 400", async () => {
    const { ctx } = setup();
    const result = await handleSubmission({ ...body, email: "sam@gmail.com" }, ctx);
    expect(result.status).toBe(400);
    expect(result.body.errors?.email).toBeTruthy();
  });

  it("filled honeypot returns 200, stores nothing, sends nothing", async () => {
    const { sent, created, ctx } = setup();
    const result = await handleSubmission({ ...body, website: "http://spam.test" }, ctx);
    expect(result.status).toBe(200);
    expect(result.body.ok).toBe(true);
    expect(sent).toHaveLength(0);
    expect(created).toHaveLength(0);
  });

  it("sixth submission from one ip returns 429", async () => {
    const { ctx } = setup();
    for (let i = 0; i < 5; i++) expect((await handleSubmission(body, ctx)).status).toBe(200);
    expect((await handleSubmission(body, ctx)).status).toBe(429);
  });

  it("mailer failure returns 502 and leaves no stored project", async () => {
    const failing: Mailer = async () => {
      throw new Error("smtp down");
    };
    const { store, created, removed, ctx } = setup(failing);
    const result = await handleSubmission(body, ctx);
    expect(result.status).toBe(502);
    expect(result.body.ok).toBe(false);
    expect(result.body.message).toMatch(/try again/i);
    expect(created).toHaveLength(1);
    expect(removed).toEqual(created);
    expect(await store.get(created[0])).toBeNull();
  });
});
