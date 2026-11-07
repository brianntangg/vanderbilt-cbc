import type { ProjectStore } from "./store";
import { toPublicProject, type Project } from "./types";

export function createMemoryStore(): ProjectStore {
  const projects = new Map<string, Project>();

  return {
    async create(input) {
      const project: Project = { ...input, id: crypto.randomUUID() };
      projects.set(project.id, project);
      return { ...project };
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
    async countPendingByEmail(email) {
      const wanted = email.toLowerCase();
      return [...projects.values()].filter((p) => p.status === "pending" && p.email.toLowerCase() === wanted).length;
    },
  };
}
