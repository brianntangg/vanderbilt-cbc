import { describe, expect, it } from "vitest";
import { createMemoryStore } from "./store-memory";
import type { Project } from "./types";

function project(id: string, overrides: Partial<Project> = {}): Project {
  return {
    id,
    title: `Project ${id}`,
    url: "https://github.com/someone/repo",
    type: "GitHub",
    description: "A thing.",
    name: "Sam Student",
    email: "sam@vanderbilt.edu",
    status: "pending",
    createdAt: 1,
    ...overrides,
  };
}

describe("memory store", () => {
  it("transition approves a pending project once, second call returns false", async () => {
    const store = createMemoryStore();
    await store.create(project("a"));
    expect(await store.transition("a", "approved", 100)).toBe(true);
    expect(await store.transition("a", "approved", 200)).toBe(false);
    expect((await store.get("a"))?.approvedAt).toBe(100);
  });

  it("transition on rejected or missing id returns false", async () => {
    const store = createMemoryStore();
    await store.create(project("a"));
    expect(await store.transition("a", "rejected", 1)).toBe(true);
    expect(await store.transition("a", "approved", 2)).toBe(false);
    expect(await store.transition("missing", "approved", 2)).toBe(false);
  });

  it("listApproved returns newest first and never includes email or status", async () => {
    const store = createMemoryStore();
    await store.create(project("old"));
    await store.create(project("new"));
    await store.transition("old", "approved", 100);
    await store.transition("new", "approved", 200);
    const result = await store.listApproved();
    expect(result.map((p) => p.id)).toEqual(["new", "old"]);
    expect("email" in result[0]).toBe(false);
    expect("status" in result[0]).toBe(false);
  });

  it("pending and rejected projects are not listed", async () => {
    const store = createMemoryStore();
    await store.create(project("pending"));
    await store.create(project("rejected"));
    await store.transition("rejected", "rejected", 5);
    expect(await store.listApproved()).toEqual([]);
  });

  it("remove deletes a project", async () => {
    const store = createMemoryStore();
    await store.create(project("a"));
    await store.remove("a");
    expect(await store.get("a")).toBeNull();
  });

  it("hit allows 5 and blocks the 6th for limit 5", async () => {
    const store = createMemoryStore();
    const results = [];
    for (let i = 0; i < 6; i++) results.push(await store.hit("ip", 5, 3600));
    expect(results).toEqual([true, true, true, true, true, false]);
  });

  it("hit window resets after windowSeconds", async () => {
    let now = 0;
    const store = createMemoryStore({ now: () => now });
    expect(await store.hit("ip", 1, 60)).toBe(true);
    expect(await store.hit("ip", 1, 60)).toBe(false);
    now = 61_000;
    expect(await store.hit("ip", 1, 60)).toBe(true);
  });

  it("hit counts keys separately", async () => {
    const store = createMemoryStore();
    expect(await store.hit("a", 1, 60)).toBe(true);
    expect(await store.hit("b", 1, 60)).toBe(true);
  });
});
