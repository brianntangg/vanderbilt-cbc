import type { Redis } from "@upstash/redis";
import type { ProjectStore } from "./store";
import { toPublicProject, type Project } from "./types";

const projectKey = (id: string) => `project:${id}`;
const decidedKey = (id: string) => `project:${id}:decided`;
const APPROVED = "projects:approved";

/** Thin mapping of ProjectStore onto Redis. Needs real credentials to exercise, so it has no automated test. */
export function createUpstashStore(redis: Redis): ProjectStore {
  async function read(id: string): Promise<Project | null> {
    return (await redis.get<Project>(projectKey(id))) ?? null;
  }

  return {
    async create(project) {
      await redis.set(projectKey(project.id), project);
    },
    get: read,
    async remove(id) {
      await Promise.all([redis.del(projectKey(id)), redis.zrem(APPROVED, id)]);
    },
    async transition(id, to, now) {
      const project = await read(id);
      if (!project || project.status !== "pending") return false;
      // SET NX is the atomic claim: of two simultaneous decisions, exactly one gets "OK".
      if ((await redis.set(decidedKey(id), to, { nx: true })) === null) return false;
      try {
        const next: Project = { ...project, status: to, ...(to === "approved" ? { approvedAt: now } : {}) };
        await redis.set(projectKey(id), next);
        if (to === "approved") await redis.zadd(APPROVED, { score: now, member: id });
      } catch (error) {
        await redis.del(decidedKey(id));
        throw error;
      }
      return true;
    },
    async listApproved() {
      const ids = await redis.zrange<string[]>(APPROVED, 0, -1, { rev: true });
      if (ids.length === 0) return [];
      const projects = await redis.mget<(Project | null)[]>(...ids.map(projectKey));
      return projects
        .filter((p): p is Project => p !== null && p.status === "approved")
        .map(toPublicProject);
    },
    async hit(key, limit, windowSeconds) {
      const redisKey = `rl:${key}`;
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.expire(redisKey, windowSeconds);
      return count <= limit;
    },
  };
}
