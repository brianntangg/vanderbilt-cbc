# Student Projects tab: design

## Intent and why

Club members build things with Claude (GitHub repos, Claude artifacts, designs) and the website has nowhere to show them. Add a **Projects** tab to the existing site where students submit a link to their work. The board reviews it by email, and one click makes it appear on the site. The goal is to celebrate member work and make the club look active, with almost no manual upkeep for the board.

## What the user decided

- It is a **new tab in the existing site's top nav** (between Slides and Links), not a separate site. Route: `/projects`.
- The page opens with the site's standard left-aligned banner (`Section as="h1"`): eyebrow, title **"Student projects"**, one sentence saying these are projects club members have made, and a **Submit your project** button underneath.
- Approved projects show below the banner as **cards in a grid** (title, creator name, short description, link, and a type tag such as GitHub / Claude artifact / Design).
- Students submit a **link** (GitHub, Claude artifact, design, or other Claude-related work).
- On submit, an **email is sent automatically to claudeatvanderbilt@gmail.com**. It shows what was submitted and has **a button**. Pressing it makes the project **go live on the site automatically**, with no manual editing.

## Goals

- A student can submit in under a minute, with no account.
- A reviewer can review and publish from the email alone.
- Looks and feels like the rest of the site (dark theme, existing Section/Card/Button/Pill components).

## Non-goals

- No student accounts or login, and no editing or deleting a project after submission (the board handles this by hand).
- No file uploads or screenshots in v1. Link, title, name, and description only.
- No admin dashboard.

## Anti-goals (would be a failure even if it technically works)

- Anything appearing publicly without a human having pressed the approve button.
- Spam or abusive links reaching the site, or the approve link being guessable, forgeable, or reusable by outsiders.
- The approve action firing just because an email scanner or link previewer fetched the link.

## Constraints

- The site is currently fully static Next.js (App Router) on Vercel, with content in `src/content/`. This feature needs a small server-side piece (API routes) and persistent storage. It must stay a single Vercel deployment.
- `next.config.ts` has a strict CSP (`form-action 'self'`). The submit form posts to the site's own API, so no CSP change is needed unless an external embed is added.
- `npm run check` (lint + typecheck) must pass.
- Secrets go in Vercel environment variables, never in the repo (`.env*` is already gitignored).

## How it gets made (my calls, not the user's. They can override)

- **Storage:** a small hosted key-value store from the Vercel Marketplace (Upstash Redis). Each submission is a record with status `pending` or `approved`.
- **Email:** Gmail SMTP from claudeatvanderbilt@gmail.com to itself (see "Decided after the builder check").
- **Approve link:** the email button opens a signed, unguessable URL (HMAC token tied to the submission id) that shows a confirmation page with an **Approve** button. Approval only happens on that button's POST, so email scanners can't trigger it. A matching **Reject** option is included.
- **Form:** on the Projects page (a modal or an anchored section, builder's choice). Fields: project title, link (https only), type (GitHub / Claude artifact / Design / Other), short description (max ~200 chars), your name, and your Vanderbilt email (`@vanderbilt.edu` required; shown to reviewers only, never published).
- **Abuse protection:** a hidden honeypot field, basic per-IP rate limiting, server-side validation, and all text rendered as plain text (no HTML). Reviewers see the link before approving.
- **Page rendering:** `/projects` reads approved projects from the store and updates when one is approved (revalidate on approve). Until there is at least one approved project, the page shows only the banner and the button.
- Add "Projects" to the nav list in `src/components/Nav.tsx`, and to the generated sitemap (`src/app/sitemap.ts`).
- **Approve link rules (my call):** single-use and expires after 14 days. Submission states are `pending`, `approved`, and `rejected`. Opening a link for a submission that is no longer `pending` shows a plain "already handled" page.
- **Existing code:** this is the repo at `vanderbilt-cbc` (Next.js 16, React 19, Tailwind 4, App Router). `Section`, `Card`, `Pill`, `Button`, and `Nav` already exist and should be reused.
- Reject behavior, rate-limit thresholds, and how long submitter emails are kept are left to the builder (keep emails no longer than needed).

## Left to the builder

- Exact card styling (reuse `Card` and `Pill`), copy for the submitted/thank-you states, email template look, ordering (newest first is a sensible default), and test approach.

## Decided after the builder check

- **Who can submit (user's decision):** Vanderbilt students only. The form requires a `@vanderbilt.edu` email address and rejects anything else. **My call:** the address is not verified by a confirmation email in v1. The reviewer sees it in the review email and is the check that the submitter is a real student. If fake submissions become a problem, add an emailed confirmation step later.
- **How the email is sent (user's decision):** through the club Gmail account, claudeatvanderbilt@gmail.com, using SMTP with a Gmail app password (e.g. Nodemailer). This replaces Resend, so no custom domain is needed. The user has access to both the Gmail account and the Vercel project and will create the app password and set the environment variables (Gmail app password, approve-link signing secret, storage credentials). The builder provides a checklist of exactly which variables to set. Gmail's daily sending limit is far above what this needs.
- Locally, with no credentials set, email sending should log to the console instead of failing, so the form can be developed without the Gmail account.

## Open for the user

- Nothing.
