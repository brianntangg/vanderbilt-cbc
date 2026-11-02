import type { ProjectStore } from "./store";
import { toPublicProject, type Project } from "./types";

export function createMemoryStore({ now = Date.now }: { now?: () => number } = {}): ProjectStore {
  const projects = new Map<string, Project>();
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    async create(project) {
      projects.set(project.id, { ...project });
    },
    async get(id) {
      const project = projects.get(id);
      return project ? { ...project } : null;
    },
    async remove(id) {
      projects.delete(id);
    },
    async transition(id, to, at) {
      const project = projects.get(id);
      if (!project || project.status !== "pending") return false;
      project.status = to;
      if (to === "approved") project.approvedAt = at;
      return true;
    },
    async listApproved() {
      return [...projects.values()]
        .filter((p) => p.status === "approved")
        .sort((a, b) => (b.approvedAt ?? 0) - (a.approvedAt ?? 0))
        .map(toPublicProject);
    },
    async hit(key, limit, windowSeconds) {
      const entry = hits.get(key);
      if (!entry || now() >= entry.resetAt) {
        hits.set(key, { count: 1, resetAt: now() + windowSeconds * 1000 });
        return limit >= 1;
      }
      entry.count += 1;
      return entry.count <= limit;
    },
  };
}
