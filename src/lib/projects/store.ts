import { Redis } from "@upstash/redis";
import { createMemoryStore } from "./store-memory";
import { createUpstashStore } from "./store-upstash";
import type { Project, PublicProject } from "./types";

export interface ProjectStore {
  create(project: Project): Promise<void>;
  get(id: string): Promise<Project | null>;
  remove(id: string): Promise<void>;
  /** True only if the project existed and was pending. Approving also sets `approvedAt = now`. */
  transition(id: string, to: "approved" | "rejected", now: number): Promise<boolean>;
  /** Newest approved first, with email and status stripped. */
  listApproved(): Promise<PublicProject[]>;
  /** Counts a use of `key`; false once it has been used more than `limit` times within the window. */
  hit(key: string, limit: number, windowSeconds: number): Promise<boolean>;
}

const globalForStore = globalThis as unknown as { __projectStore?: ProjectStore };

/** Memoized on globalThis: Next dev reloads modules per route, and every route must share one memory store. */
export function getStore(): ProjectStore {
  if (globalForStore.__projectStore) return globalForStore.__projectStore;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  let store: ProjectStore;
  if (url && token) {
    store = createUpstashStore(new Redis({ url, token }));
  } else if (process.env.NODE_ENV !== "production") {
    store = createMemoryStore();
  } else {
    throw new Error("Project storage is not configured");
  }
  globalForStore.__projectStore = store;
  return store;
}
