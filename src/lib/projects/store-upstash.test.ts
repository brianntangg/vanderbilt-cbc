import type { Redis } from "@upstash/redis";
import { describe, expect, it } from "vitest";
import { createUpstashStore } from "./store-upstash";
import type { Project } from "./types";

/** Just enough Redis to run transition: get/set(nx)/del/zadd/zrem. `get` yields so two callers can interleave. */
function fakeRedis() {
  const data = new Map<string, unknown>();
  const approved = new Set<string>();
  const redis = {
    async get(key: string) {
      const value = data.get(key);
      await Promise.resolve();
      return value === undefined ? null : structuredClone(value);
    },
    async set(key: string, value: unknown, options?: { nx?: boolean }) {
      if (options?.nx && data.has(key)) return null;
      data.set(key, structuredClone(value));
      return "OK";
    },
    async del(key: string) {
      data.delete(key);
      return 1;
    },
    async zadd(_key: string, member: { member: string }) {
      approved.add(member.member);
      return 1;
    },
    async zrem(_key: string, id: string) {
      approved.delete(id);
      return 1;
    },
  };
  return { redis: redis as unknown as Redis, data, approved };
}

const project: Project = {
  id: "p1",
  title: "Study buddy",
  url: "https://github.com/someone/study-buddy",
  type: "GitHub",
  description: "A flashcard maker.",
  name: "Sam Student",
  email: "sam@vanderbilt.edu",
  status: "pending",
  createdAt: 1,
};

describe("upstash store transition", () => {
  it("lets only one of two concurrent decisions win, and the stored state matches the winner", async () => {
    const { redis, data, approved } = fakeRedis();
    const store = createUpstashStore(redis);
    await store.create(project);

    const results = await Promise.all([store.transition("p1", "approved", 10), store.transition("p1", "rejected", 10)]);

    expect(results.filter(Boolean)).toHaveLength(1);
    const winner = results[0] ? "approved" : "rejected";
    expect((data.get("project:p1") as Project).status).toBe(winner);
    expect(approved.has("p1")).toBe(winner === "approved");
  });

  it("still approves a pending project once", async () => {
    const { redis, approved } = fakeRedis();
    const store = createUpstashStore(redis);
    await store.create(project);
    expect(await store.transition("p1", "approved", 10)).toBe(true);
    expect(await store.transition("p1", "approved", 11)).toBe(false);
    expect(approved.has("p1")).toBe(true);
  });
});
