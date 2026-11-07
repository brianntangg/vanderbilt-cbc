import { describe, expect, it } from "vitest";
import { createMemoryStore } from "./store-memory";
import type { Project } from "./types";

function project(label: string, overrides: Partial<Project> = {}): Omit<Project, "id"> {
  return {
    title: `Project ${label}`,
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
  it("create assigns an id and the project can be fetched with it", async () => {
    const store = createMemoryStore();
    const created = await store.create(project("a"));
    expect(created.id).toBeTruthy();
    expect((await store.get(created.id))?.title).toBe("Project a");
  });

  it("transition approves a pending project once, second call returns false", async () => {
    const store = createMemoryStore();
    const { id } = await store.create(project("a"));
    expect(await store.transition(id, "approved", 100)).toBe(true);
    expect(await store.transition(id, "approved", 200)).toBe(false);
    expect((await store.get(id))?.approvedAt).toBe(100);
  });

  it("transition on rejected or missing id returns false", async () => {
    const store = createMemoryStore();
    const { id } = await store.create(project("a"));
    expect(await store.transition(id, "rejected", 1)).toBe(true);
    expect(await store.transition(id, "approved", 2)).toBe(false);
    expect(await store.transition("missing", "approved", 2)).toBe(false);
  });

  it("listApproved returns newest first and never includes email or status", async () => {
    const store = createMemoryStore();
    const old = await store.create(project("old"));
    const fresh = await store.create(project("new"));
    await store.transition(old.id, "approved", 100);
    await store.transition(fresh.id, "approved", 200);
    const result = await store.listApproved();
    expect(result.map((p) => p.id)).toEqual([fresh.id, old.id]);
    expect("email" in result[0]).toBe(false);
    expect("status" in result[0]).toBe(false);
  });

  it("pending and rejected projects are not listed", async () => {
    const store = createMemoryStore();
    await store.create(project("pending"));
    const rejected = await store.create(project("rejected"));
    await store.transition(rejected.id, "rejected", 5);
    expect(await store.listApproved()).toEqual([]);
  });

  it("remove deletes a project", async () => {
    const store = createMemoryStore();
    const { id } = await store.create(project("a"));
    await store.remove(id);
    expect(await store.get(id)).toBeNull();
  });

  it("countPendingByEmail counts only that address's pending projects, ignoring case", async () => {
    const store = createMemoryStore();
    await store.create(project("1"));
    await store.create(project("2", { email: "SAM@Vanderbilt.edu" }));
    await store.create(project("3", { email: "other@vanderbilt.edu" }));
    const decided = await store.create(project("4"));
    await store.transition(decided.id, "rejected", 1);
    expect(await store.countPendingByEmail("sam@vanderbilt.edu")).toBe(2);
  });
});
