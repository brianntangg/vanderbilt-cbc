import type { ProjectStore } from "./store";
import { PROJECT_TYPES, toPublicProject, type Project, type ProjectType } from "./types";

type AirtableRecord = { id: string; createdTime: string; fields: Record<string, unknown> };

const TABLE = "Projects";
const RECORD_ID = /^rec[A-Za-z0-9]{14}$/;
const STATUS = { pending: "Pending", approved: "Approved", rejected: "Rejected" } as const;
// Everything the public page needs. Email is deliberately absent.
const PUBLIC_FIELDS = ["Title", "Link", "Type", "Description", "Name", "Approved at"];
/** The free Airtable plan allows 1,000 API calls a month, so the public list is cached for an hour. */
export const LIST_CACHE_SECONDS = 3600;

/** Escapes a value for use inside a double-quoted Airtable formula string. */
const formulaString = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function toProject(record: AirtableRecord): Project {
  const f = record.fields;
  const text = (key: string) => (typeof f[key] === "string" ? (f[key] as string) : "");
  const type = PROJECT_TYPES.includes(f.Type as ProjectType) ? (f.Type as ProjectType) : "Other";
  const status = (Object.keys(STATUS) as Array<keyof typeof STATUS>).find((k) => STATUS[k] === f.Status) ?? "pending";
  const approvedAt = typeof f["Approved at"] === "string" ? Date.parse(f["Approved at"]) : undefined;
  return {
    id: record.id,
    title: text("Title"),
    url: text("Link"),
    type,
    description: text("Description"),
    name: text("Name"),
    email: text("Email"),
    status,
    createdAt: Date.parse(record.createdTime),
    ...(approvedAt !== undefined && !Number.isNaN(approvedAt) ? { approvedAt } : {}),
  };
}

/**
 * ProjectStore on an Airtable table named "Projects". Airtable can't make a conditional update, so two
 * reviewers pressing opposite buttons at the same instant could both succeed; the last write wins.
 */
export function createAirtableStore({
  token,
  baseId,
  fetch: fetchImpl = fetch,
}: {
  token: string;
  baseId: string;
  fetch?: typeof fetch;
}): ProjectStore {
  const root = `https://api.airtable.com/v0/${baseId}/${TABLE}`;

  async function call(method: string, path: string, body?: unknown, cacheSeconds?: number): Promise<Response> {
    const response = await fetchImpl(`${root}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(cacheSeconds ? { next: { revalidate: cacheSeconds } } : { cache: "no-store" as const }),
    });
    if (!response.ok && response.status !== 404) throw new Error(`Airtable ${method} failed with ${response.status}`);
    return response;
  }

  async function list(params: URLSearchParams, cacheSeconds?: number): Promise<AirtableRecord[]> {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;
    do {
      const page = new URLSearchParams(params);
      if (offset) page.set("offset", offset);
      const response = await call("GET", `?${page}`, undefined, cacheSeconds);
      const data = (await response.json()) as { records: AirtableRecord[]; offset?: string };
      records.push(...data.records);
      offset = data.offset;
    } while (offset);
    return records;
  }

  async function read(id: string): Promise<Project | null> {
    if (!RECORD_ID.test(id)) return null;
    const response = await call("GET", `/${id}`);
    return response.status === 404 ? null : toProject((await response.json()) as AirtableRecord);
  }

  return {
    async create(project) {
      const response = await call("POST", "", {
        fields: {
          Title: project.title,
          Link: project.url,
          Type: project.type,
          Description: project.description,
          Name: project.name,
          Email: project.email,
          Status: STATUS.pending,
        },
      });
      return toProject((await response.json()) as AirtableRecord);
    },
    get: read,
    async remove(id) {
      if (RECORD_ID.test(id)) await call("DELETE", `/${id}`);
    },
    async transition(id, to, now) {
      const project = await read(id);
      if (!project || project.status !== "pending") return false;
      const fields: Record<string, string> = { Status: STATUS[to] };
      if (to === "approved") fields["Approved at"] = new Date(now).toISOString();
      const response = await call("PATCH", `/${id}`, { fields });
      return response.status !== 404;
    },
    async listApproved() {
      const params = new URLSearchParams({ filterByFormula: '{Status}="Approved"', pageSize: "100" });
      params.set("sort[0][field]", "Approved at");
      params.set("sort[0][direction]", "desc");
      for (const field of PUBLIC_FIELDS) params.append("fields[]", field);
      return (await list(params, LIST_CACHE_SECONDS)).map((r) => toPublicProject(toProject(r)));
    },
    async countPendingByEmail(email) {
      const formula = `AND({Status}="Pending",LOWER({Email})=${formulaString(email.toLowerCase())})`;
      const params = new URLSearchParams({ filterByFormula: formula, pageSize: "100" });
      params.append("fields[]", "Email");
      return (await list(params)).length;
    },
  };
}
