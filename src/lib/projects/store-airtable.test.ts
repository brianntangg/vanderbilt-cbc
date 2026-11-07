import { describe, expect, it } from "vitest";
import { createAirtableStore } from "./store-airtable";

type Call = { method: string; url: URL; body?: unknown; auth: string | null };

/** Replies from a queue and records every request, so tests can check exactly what was sent. */
function fakeFetch(replies: Array<{ status?: number; json?: unknown }>) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? "GET",
      url: new URL(String(input)),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      auth: new Headers(init?.headers).get("authorization"),
    });
    const reply = replies.shift();
    if (!reply) throw new Error("unexpected extra request");
    return new Response(JSON.stringify(reply.json ?? {}), { status: reply.status ?? 200 });
  }) as typeof fetch;
  return { calls, store: createAirtableStore({ token: "tok", baseId: "appBase", fetch: fetchImpl }) };
}

const ID = "recAAAAAAAAAAAAAA";
const record = (fields: Record<string, unknown>, id = ID) => ({ id, createdTime: "2026-11-01T12:00:00.000Z", fields });
const pendingFields = {
  Title: "Study buddy",
  Link: "https://github.com/someone/study-buddy",
  Type: "GitHub",
  Description: "A flashcard maker.",
  Name: "Sam Student",
  Email: "sam@vanderbilt.edu",
  Status: "Pending",
};

describe("airtable store", () => {
  it("create posts the fields as a Pending record and returns the project with Airtable's record id", async () => {
    const { calls, store } = fakeFetch([{ json: record(pendingFields) }]);
    const created = await store.create({
      title: "Study buddy",
      url: "https://github.com/someone/study-buddy",
      type: "GitHub",
      description: "A flashcard maker.",
      name: "Sam Student",
      email: "sam@vanderbilt.edu",
      status: "pending",
      createdAt: 1,
    });

    expect(created.id).toBe(ID);
    expect(created.status).toBe("pending");
    expect(created.createdAt).toBe(Date.parse("2026-11-01T12:00:00.000Z"));
    expect(calls[0].method).toBe("POST");
    expect(calls[0].url.pathname).toBe("/v0/appBase/Projects");
    expect(calls[0].auth).toBe("Bearer tok");
    expect(calls[0].body).toEqual({ fields: pendingFields });
  });

  it("get returns null for an unknown record and never calls Airtable for a malformed id", async () => {
    const { calls, store } = fakeFetch([{ status: 404, json: { error: { type: "NOT_FOUND" } } }]);
    expect(await store.get(ID)).toBeNull();
    expect(await store.get("../../etc")).toBeNull();
    expect(calls).toHaveLength(1);
  });

  it("get maps a record back to a project", async () => {
    const { store } = fakeFetch([{ json: record({ ...pendingFields, Status: "Approved", "Approved at": "2026-11-02T00:00:00.000Z" }) }]);
    const project = await store.get(ID);
    expect(project).toMatchObject({ id: ID, status: "approved", email: "sam@vanderbilt.edu", type: "GitHub" });
    expect(project?.approvedAt).toBe(Date.parse("2026-11-02T00:00:00.000Z"));
  });

  it("transition approves a pending record by patching Status and Approved at", async () => {
    const { calls, store } = fakeFetch([{ json: record(pendingFields) }, { json: record({}) }]);
    expect(await store.transition(ID, "approved", Date.parse("2026-11-03T00:00:00.000Z"))).toBe(true);
    expect(calls[1].method).toBe("PATCH");
    expect(calls[1].body).toEqual({ fields: { Status: "Approved", "Approved at": "2026-11-03T00:00:00.000Z" } });
  });

  it("transition reject only changes Status, and does nothing to an already-decided record", async () => {
    const reject = fakeFetch([{ json: record(pendingFields) }, { json: record({}) }]);
    expect(await reject.store.transition(ID, "rejected", 5)).toBe(true);
    expect(reject.calls[1].body).toEqual({ fields: { Status: "Rejected" } });

    const decided = fakeFetch([{ json: record({ ...pendingFields, Status: "Approved" }) }]);
    expect(await decided.store.transition(ID, "rejected", 5)).toBe(false);
    expect(decided.calls).toHaveLength(1);

    const missing = fakeFetch([{ status: 404 }]);
    expect(await missing.store.transition(ID, "approved", 5)).toBe(false);
  });

  it("listApproved pages through results, asks for newest first, and never requests or returns the email", async () => {
    const second = "recBBBBBBBBBBBBBB";
    const { calls, store } = fakeFetch([
      { json: { records: [record({ ...pendingFields, Status: "Approved", "Approved at": "2026-11-03T00:00:00.000Z" })], offset: "next1" } },
      { json: { records: [record({ ...pendingFields, Title: "Older", Status: "Approved", "Approved at": "2026-11-02T00:00:00.000Z" }, second)] } },
    ]);
    const projects = await store.listApproved();

    expect(projects.map((p) => p.id)).toEqual([ID, second]);
    expect("email" in projects[0]).toBe(false);
    expect("status" in projects[0]).toBe(false);
    const first = calls[0].url.searchParams;
    expect(first.get("filterByFormula")).toBe('{Status}="Approved"');
    expect(first.get("sort[0][field]")).toBe("Approved at");
    expect(first.get("sort[0][direction]")).toBe("desc");
    expect(first.getAll("fields[]")).not.toContain("Email");
    expect(calls[1].url.searchParams.get("offset")).toBe("next1");
  });

  it("countPendingByEmail filters on the lowercased address and escapes quotes in it", async () => {
    const { calls, store } = fakeFetch([{ json: { records: [record(pendingFields), record(pendingFields, "recBBBBBBBBBBBBBB")] } }]);
    expect(await store.countPendingByEmail('Sa"m@Vanderbilt.edu')).toBe(2);
    expect(calls[0].url.searchParams.get("filterByFormula")).toBe(
      'AND({Status}="Pending",LOWER({Email})="sa\\"m@vanderbilt.edu")',
    );
  });

  it("remove deletes the record", async () => {
    const { calls, store } = fakeFetch([{ json: { deleted: true, id: ID } }]);
    await store.remove(ID);
    expect(calls[0].method).toBe("DELETE");
    expect(calls[0].url.pathname).toBe(`/v0/appBase/Projects/${ID}`);
  });

  it("throws on an Airtable error so the caller doesn't treat a failure as success", async () => {
    const { store } = fakeFetch([{ status: 401, json: { error: { type: "AUTHENTICATION_REQUIRED" } } }]);
    await expect(store.listApproved()).rejects.toThrow(/401/);
  });
});
