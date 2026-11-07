# Student Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/projects` tab where Vanderbilt students submit a project link, the club Gmail receives a review email, and one click on its button publishes the project on the site.

**Architecture:** Logic lives in small pure modules under `src/lib/projects/` (validation, signed tokens, email building, submission handler) that take their dependencies as arguments, so vitest can test them with an in-memory store and a fake mailer. Thin Next.js route handlers, server actions, and pages call them. Production storage is Upstash Redis; email goes out through Gmail SMTP via Nodemailer.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, TypeScript, `@upstash/redis`, `nodemailer`, `vitest` (new dev dependency).

**Spec:** `docs/superpowers/specs/2026-11-01-student-projects-design.md`

## Global Constraints

- Single Vercel deployment; no separate site. Route is `/projects`; nav tab "Projects" sits between "Slides" and "Links".
- Banner uses `<Section as="h1" eyebrow="Projects" title="Student projects" intro="Projects our club members have made.">` with a **Submit your project** button under it, left-aligned like other pages.
- Approved projects render as a **grid of cards** (title, creator name, description, link, type tag via `Pill`), newest approved first. With zero approved projects, show only the banner and button.
- Submitter email must end in `@vanderbilt.edu` (case-insensitive, exact domain). It is shown to reviewers only and never rendered on the site.
- Project link must be `https://`. Type is one of `GitHub | Claude artifact | Design | Other`. Description max 200 characters.
- Review email goes from and to `claudeatvanderbilt@gmail.com` (`site.contactEmail`) via Gmail SMTP with an app password.
- Approve links are single-use and expire after 14 days. States: `pending`, `approved`, `rejected`. Approval happens only on a POST from a confirmation page, never on GET.
- No project goes public without the approve action. All user text is rendered as plain text and HTML-escaped in email.
- Secrets only in env vars: `GMAIL_APP_PASSWORD`, `PROJECTS_TOKEN_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Optional `SITE_URL` overrides `site.url` (for local dev).
- With no Gmail credentials, email sending logs to the console. With no Upstash credentials, an in-memory store is used in development only; in production missing storage env vars must throw.
- `npm run check` (lint + typecheck) and `npm test` must pass. Follow existing code style (named exports, `@/` imports, Tailwind classes from `globals.css` tokens like `bg-surface`, `border-line`, `text-muted`).

## Review Focus

- Email lookalikes: `a@vanderbilt.edu.evil.com`, `a@evilvanderbilt.edu`, `A@VANDERBILT.EDU` (the last must pass, the first two must fail).
- Bad links: `javascript:alert(1)`, `http://...`, leading/trailing whitespace, 2,000-character URLs, and `https://user:pw@host` (all rejected except trimmed valid `https://` links).
- Script/HTML in title, name, or description (`<script>`, `<img onerror>`) must appear as literal text on the site and escaped in the email.
- Reusing, tampering with, or letting an approve link expire; and an email scanner doing a GET on the link must not approve anything.
- Bots and repeats: a filled honeypot looks like success but stores and emails nothing; the 6th submission from one IP in an hour is refused; if the email fails to send, the user sees an error and no pending record is left behind.

---

### Task 1: Test runner, types, and submission validation

**Files:**
- Modify: `package.json` (add devDependency `vitest`, script `"test": "vitest run"`), `eslint.config.mjs` only if lint rejects test files
- Create: `vitest.config.ts` (alias `@` → `./src`), `src/lib/projects/types.ts`, `src/lib/projects/validation.ts`
- Test: `src/lib/projects/validation.test.ts`

**Interfaces:**
- Produces (`types.ts`):
  - `export const PROJECT_TYPES = ["GitHub", "Claude artifact", "Design", "Other"] as const; export type ProjectType = (typeof PROJECT_TYPES)[number];`
  - `export type SubmissionInput = { title: string; url: string; type: ProjectType; description: string; name: string; email: string }`
  - `export type Project = SubmissionInput & { id: string; status: "pending" | "approved" | "rejected"; createdAt: number; approvedAt?: number }`
  - `export type PublicProject = Omit<Project, "email" | "status">`
- Produces (`validation.ts`): `export function validateSubmission(input: unknown): { ok: true; value: SubmissionInput } | { ok: false; errors: Partial<Record<keyof SubmissionInput, string>> }` — trims all strings, enforces the Global Constraints limits (title ≤ 80, name ≤ 80, all required).

- [ ] **Step 1: Install and configure vitest** — `npm install -D vitest`, add `vitest.config.ts` and the `test` script. Run `npm test`; expected: "No test files found" (exit is fine).
- [ ] **Step 2: Write failing tests** in `validation.test.ts`: `accepts a valid submission and trims whitespace`; `rejects emails: a@vanderbilt.edu.evil.com, a@evilvanderbilt.edu, a@gmail.com` (each → `errors.email` set); `accepts A@VANDERBILT.EDU`; `rejects urls: javascript:alert(1), http://x.com, https://u:p@x.com, a 2000-char https url` (each → `errors.url`); `rejects description over 200 chars`; `rejects unknown type`; `rejects missing fields with one error per field`; `rejects non-object input`.
- [ ] **Step 3: Run `npm test`; expected: FAIL (module not found).**
- [ ] **Step 4: Implement** `types.ts` and `validation.ts` as specified above. Use `new URL()` for link parsing; max URL length 500.
- [ ] **Step 5: Run `npm test` and `npm run check`; expected: PASS.**
- [ ] **Step 6: Commit** — `feat: add project types and submission validation`

### Task 2: Signed review tokens

**Files:**
- Create: `src/lib/projects/token.ts`
- Test: `src/lib/projects/token.test.ts`

**Interfaces:**
- Produces:
  - `export const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000`
  - `export function signToken(id: string, secret: string, now?: number): string` — format `${id}.${expiresAt}.${hmac}` with HMAC-SHA256 (base64url) over `${id}.${expiresAt}`.
  - `export function verifyToken(token: string, secret: string, now?: number): { ok: true; id: string } | { ok: false; reason: "malformed" | "bad-signature" | "expired" }` — use `crypto.timingSafeEqual`.

- [ ] **Step 1: Write failing tests:** `round-trips a valid token to its id`; `rejects a token signed with a different secret (bad-signature)`; `rejects a token whose id or expiry was edited (bad-signature)`; `rejects after 14 days (expired)`; `accepts at 14 days minus 1 ms`; `rejects garbage, empty, and two-part tokens (malformed)`.
- [ ] **Step 2: Run `npm test -- token`; expected: FAIL.**
- [ ] **Step 3: Implement** `token.ts`. Project ids are `crypto.randomUUID()` (no dots), so splitting on `.` is safe.
- [ ] **Step 4: Run `npm test -- token`; expected: PASS.**
- [ ] **Step 5: Commit** — `feat: add signed review tokens`

### Task 3: Project store, memory and Upstash

**Files:**
- Create: `src/lib/projects/store.ts`, `src/lib/projects/store-memory.ts`, `src/lib/projects/store-upstash.ts`
- Modify: `package.json` (`npm install @upstash/redis`)
- Test: `src/lib/projects/store-memory.test.ts`

**Interfaces:**
- Produces (`store.ts`):
  - `export interface ProjectStore { create(p: Project): Promise<void>; get(id: string): Promise<Project | null>; remove(id: string): Promise<void>; transition(id: string, to: "approved" | "rejected", now: number): Promise<boolean>; listApproved(): Promise<PublicProject[]>; hit(key: string, limit: number, windowSeconds: number): Promise<boolean> }`
  - `transition` returns `true` only if the project existed and was `pending`; on approve it sets `approvedAt = now`. `listApproved` returns newest `approvedAt` first and strips `email` and `status`. `hit` returns `false` once `key` has been used more than `limit` times within the window.
  - `export function getStore(): ProjectStore` — Upstash if both `UPSTASH_REDIS_REST_*` vars are set; otherwise the memory store when `NODE_ENV !== "production"`; otherwise throws `Error("Project storage is not configured")`. Memoize the instance.
- Produces: `export function createMemoryStore(): ProjectStore` (`store-memory.ts`), `export function createUpstashStore(redis: Redis): ProjectStore` (`store-upstash.ts`; project JSON at `project:{id}`, approved ids in sorted set `projects:approved` scored by `approvedAt`, rate limit via `INCR` + `EXPIRE` on `rl:{key}`).

- [ ] **Step 1: Write failing tests** against `createMemoryStore()`: `transition approves a pending project once, second call returns false`; `transition on rejected or missing id returns false`; `listApproved returns newest first and never includes email or status` (assert `"email" in result[0]` is false); `pending and rejected projects are not listed`; `remove deletes a project`; `hit allows 5 and blocks the 6th for limit 5`; `hit window resets after windowSeconds` (inject time via a `now` option on `createMemoryStore({ now })`).
- [ ] **Step 2: Run `npm test -- store`; expected: FAIL.**
- [ ] **Step 3: Implement** `store-memory.ts`, then `store-upstash.ts` and `getStore()`. The Upstash implementation has no automated test (needs credentials); keep it a thin mapping of the same interface.
- [ ] **Step 4: Run `npm test` and `npm run check`; expected: PASS.**
- [ ] **Step 5: Commit** — `feat: add project store with memory and Upstash backends`

### Task 4: Review email and mailer

**Files:**
- Create: `src/lib/projects/email.ts`, `src/lib/projects/mailer.ts`
- Modify: `package.json` (`npm install nodemailer`, `npm install -D @types/nodemailer`)
- Test: `src/lib/projects/email.test.ts`

**Interfaces:**
- Produces (`email.ts`): `export function buildReviewEmail(project: Project, reviewUrl: string): { subject: string; text: string; html: string }` — subject `New student project: ${title}`; body lists title, name, email, type, link, description, and a button/link labeled "Review and publish" pointing to `reviewUrl`. HTML escapes `& < > " '` in every user field.
- Produces (`mailer.ts`): `export type Mailer = (mail: { subject: string; text: string; html: string }) => Promise<void>` and `export function getMailer(): Mailer` — Nodemailer Gmail SMTP (`smtp.gmail.com`, port 465, secure) with user and recipient `site.contactEmail` and pass `GMAIL_APP_PASSWORD`; if that env var is unset, returns a mailer that `console.log`s subject and text.

- [ ] **Step 1: Write failing tests:** `html escapes <script> in title, name, description`; `text contains the review URL and the submitter email`; `subject includes the title`; `link text for javascript-looking titles stays inert` (title `<img src=x onerror=alert(1)>` appears only as `&lt;img ...`).
- [ ] **Step 2: Run `npm test -- email`; expected: FAIL.**
- [ ] **Step 3: Implement** `email.ts` and `mailer.ts`.
- [ ] **Step 4: Run `npm test` and `npm run check`; expected: PASS.**
- [ ] **Step 5: Commit** — `feat: add review email builder and Gmail mailer`

### Task 5: Submission handler and API route

**Files:**
- Create: `src/lib/projects/submit.ts`, `src/app/api/projects/route.ts`
- Test: `src/lib/projects/submit.test.ts`

**Interfaces:**
- Consumes: `validateSubmission`, `ProjectStore`, `signToken`, `buildReviewEmail`, `Mailer`.
- Produces (`submit.ts`): `export async function handleSubmission(body: unknown, ctx: { store: ProjectStore; mailer: Mailer; secret: string; baseUrl: string; ip: string; now: number }): Promise<{ status: 200 | 400 | 429 | 502; body: { ok: boolean; errors?: Record<string, string>; message?: string } }>`
  - Order: honeypot field `website` non-empty → return `200 ok` without storing or emailing; rate limit `hit("submit:" + ip, 5, 3600)` false → 429; validate → 400 with `errors`; create `pending` project with `crypto.randomUUID()` id; send email with review URL `${baseUrl}/projects/review/${signToken(id, secret, now)}`; on mailer error `remove(id)` and return 502 with a "couldn't send, try again" message.
- Produces (`route.ts`): `export async function POST(request: Request)` — parses JSON (invalid JSON → 400), takes the IP from `x-forwarded-for` (first value) or `"unknown"`, builds ctx from `getStore()`, `getMailer()`, `process.env.PROJECTS_TOKEN_SECRET` (throw if unset in production; dev fallback constant), `process.env.SITE_URL ?? site.url`.

- [ ] **Step 1: Write failing tests** with `createMemoryStore()` and a fake mailer: `valid submission stores a pending project and sends one email containing a verifiable review link`; `invalid submission returns 400 with field errors and sends nothing`; `filled honeypot returns 200, stores nothing, sends nothing`; `sixth submission from one ip returns 429`; `mailer failure returns 502 and leaves no stored project`; `non-vanderbilt email returns 400`.
- [ ] **Step 2: Run `npm test -- submit`; expected: FAIL.**
- [ ] **Step 3: Implement** `submit.ts` and `route.ts`.
- [ ] **Step 4: Run `npm test` and `npm run check`; expected: PASS.**
- [ ] **Step 5: Commit** — `feat: add project submission API`

### Task 6: Review page and approve/reject actions

**Files:**
- Create: `src/lib/projects/review.ts`, `src/app/projects/review/[token]/page.tsx`, `src/app/projects/review/[token]/actions.ts`
- Test: `src/lib/projects/review.test.ts`

**Interfaces:**
- Consumes: `verifyToken`, `ProjectStore`.
- Produces (`review.ts`): `export async function decideReview(token: string, action: "approve" | "reject", ctx: { store: ProjectStore; secret: string; now: number }): Promise<"approved" | "rejected" | "invalid" | "expired" | "already-handled">`, and `export async function loadReview(token: string, ctx): Promise<{ state: "ready"; project: Project } | { state: "invalid" | "expired" | "already-handled" }>` (read-only; never changes status).
- Produces (`actions.ts`): server actions `approveProject(token: string)` and `rejectProject(token: string)` that call `decideReview` and, on `approved`, `revalidatePath("/projects")`; then redirect or return state so the page shows the outcome.
- Page: server component shows the submission (all fields as text, link opens in new tab with `rel="noopener noreferrer"`), and two forms with **Approve and publish** and **Reject** buttons. Non-ready states show a plain message ("This link is invalid", "This link has expired", "This project was already handled"). Export `metadata` with `robots: { index: false, follow: false }`.

- [ ] **Step 1: Write failing tests:** `loadReview does not change status (GET safety)` (load twice, project still pending); `approve publishes once; second approve returns already-handled`; `reject then approve returns already-handled and project stays unlisted`; `expired token returns expired and project stays pending`; `tampered token returns invalid`; `approved project appears in store.listApproved`.
- [ ] **Step 2: Run `npm test -- review`; expected: FAIL.**
- [ ] **Step 3: Implement** `review.ts`, `actions.ts`, and the page.
- [ ] **Step 4: Run `npm test` and `npm run check`; expected: PASS.**
- [ ] **Step 5: Commit** — `feat: add review page with approve and reject`

### Task 7: Projects page, submit form, nav, and sitemap

**Files:**
- Create: `src/app/projects/page.tsx`, `src/components/ProjectCard.tsx`, `src/components/SubmitProject.tsx`
- Modify: `src/components/Nav.tsx:9-16` (insert `{ href: "/projects", label: "Projects" }` after Slides), `src/app/sitemap.ts:4` (add `"/projects"`)

**Interfaces:**
- Consumes: `getStore().listApproved()`, `PublicProject`, `PROJECT_TYPES`, `Section`, `Card`, `Pill`, `Button`.
- Produces: `ProjectCard({ project }: { project: PublicProject })` — a `Card as="li"` with `Pill` type tag, title, description, "by {name}", and an external link (`target="_blank" rel="noopener noreferrer"`, using `ExternalLinkIcon` and an sr-only "(opens in a new tab)"). `SubmitProject()` — client component: renders the **Submit your project** button (styled like `Button` primary) that opens a `<dialog>` containing the form (fields per spec plus a hidden-from-users `website` honeypot input), POSTs JSON to `/api/projects`, shows per-field errors, a thank-you state ("Thanks! The board will review it soon."), and the server's message on 429/502. Page: `pageMetadata({ title: "Projects", description: "Projects built by Claude Builder Club members at Vanderbilt.", path: "/projects" })`; banner per Global Constraints with `<SubmitProject />` as its child; grid `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` below only when projects exist.

- [ ] **Step 1: Implement** the three components, the page, the nav entry, and the sitemap entry.
- [ ] **Step 2: Run `npm run check` and `npm run build`; expected: both succeed.**
- [ ] **Step 3: Manual check in dev (`npm run dev`):** `/projects` shows the banner and the button with no grid; the nav shows Projects between Slides and Links with the active underline; the form rejects `a@gmail.com` with an inline error and works with a `@vanderbilt.edu` address; the console prints the review email.
- [ ] **Step 4: Commit** — `feat: add Projects tab with submit form`

### Task 8: End-to-end verification, docs, and CI

**Files:**
- Modify: `README.md` (new "Student projects" section), `.github/workflows/ci.yml` (add `npm test` after the existing check step, matching its style)

- [ ] **Step 1: Walk the whole flow in dev:** submit a project, copy the review URL from the console, open it (the project must still not be on `/projects`), click **Approve and publish**, confirm the card appears on `/projects` and the email is not shown; reopen the link and confirm "already handled".
- [ ] **Step 2: Write the README section** with a setup checklist for the board: create an Upstash Redis database from the Vercel Marketplace; create a Gmail app password for claudeatvanderbilt@gmail.com (requires 2-step verification); set `GMAIL_APP_PASSWORD`, `PROJECTS_TOKEN_SECRET` (long random string), and the two `UPSTASH_REDIS_REST_*` vars in Vercel; how to remove a project by hand (delete its key in Upstash and its id from `projects:approved`).
- [ ] **Step 3: Run `npm run check`, `npm test`, `npm run build`; expected: all pass.**
- [ ] **Step 4: Commit** — `docs: document student projects setup and run tests in CI`
- [ ] **Step 5: After deploy, with env vars set:** submit a real test project, confirm the email arrives at claudeatvanderbilt@gmail.com, approve it, confirm it appears, then remove the test project.
