import { createMemoryStore } from "./store-memory";
import { createAirtableStore } from "./store-airtable";
import type { Project, PublicProject } from "./types";

export interface ProjectStore {
  /** Stores a new project and returns it with its assigned id. */
  create(project: Omit<Project, "id">): Promise<Project>;
  get(id: string): Promise<Project | null>;
  remove(id: string): Promise<void>;
  /** True only if the project existed and was pending. Approving also sets `approvedAt = now`. */
  transition(id: string, to: "approved" | "rejected", now: number): Promise<boolean>;
  /** Newest approved first, with email and status stripped. */
  listApproved(): Promise<PublicProject[]>;
  /** Pending projects submitted with this address (case-insensitive). */
  countPendingByEmail(email: string): Promise<number>;
}

const globalForStore = globalThis as unknown as { __projectStore?: ProjectStore };

/** Memoized on globalThis: Next dev reloads modules per route, and every route must share one memory store. */
export function getStore(): ProjectStore {
  if (globalForStore.__projectStore) return globalForStore.__projectStore;

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  let store: ProjectStore;
  if (token && baseId) {
    store = createAirtableStore({ token, baseId });
  } else if (process.env.NODE_ENV !== "production") {
    store = createMemoryStore();
  } else {
    throw new Error("Project storage is not configured");
  }
  globalForStore.__projectStore = store;
  return store;
}
