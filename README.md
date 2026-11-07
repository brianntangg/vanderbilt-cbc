# Claude Builder Club at Vanderbilt

Website for the Claude Builder Club at Vanderbilt, a student club in Anthropic's Claude Campus Program. Static Next.js + Tailwind, deployed on Vercel.

Live: https://vanderbilt-cbc.vercel.app

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + type check (run before pushing)
```

## Common updates

All editable content lives in `src/content/`. You shouldn't need to touch components. If you make a typo in a field, `npm run check` will tell you.

**Add or edit an event** (`src/content/events.ts`)
1. Copy an existing entry and give it a unique `id`.
2. Set `date` as `"2027-02-10"`, or `"TBD"` plus `term: "Spring 2027"`.
3. Add `time: "6:00–7:30 PM"` and `location: "Featheringill 134"` once they're set. Until then, cards show "Time and location TBA".
4. Upcoming and past sort themselves by date (Central Time).

**Add slides or a recap after an event**
1. Find the event in `events.ts`.
2. Add `slidesUrl: "https://..."` and/or `recap: "..."`. It appears on /slides automatically.

**Add a team member** (`src/content/team.ts`)
1. Put a square photo in `public/team/` (e.g. `first-last.jpg`).
2. Add `{ name, role, photo: "/team/first-last.jpg" }`. `bio`, `linkedin`, and `github` are optional.
3. No photo? Leave `photo` out and initials are shown.

**Board applications** (`src/content/roles.ts`, `src/content/site.ts` → `board`)
- Close a role: set `open: false`. Add a role: copy an entry. The count, banner, and /join update automatically.
- Change dates: edit `deadline` / `decisionDate` (`"YYYY-MM-DD"`). Applications close after the deadline day, Central Time.
- Change the form: update `formUrl` and `embedUrl` (Airtable → Share form → Embed). If you switch away from Airtable, also add the new domain to `frame-src` in `next.config.ts`, or the embed will be blocked.
- Force open/closed: set `forceOpen: true` or `false`. Set it back to `undefined` to follow the deadline.
- New year: update `term`, the dates, and set roles back to `open: true`.

**Update hackathon details** (`src/content/hackathon.ts`)
1. Fill in `date`, `time`, `venue`, and `registrationUrl`.
2. Add items to `schedule`, `prizes`, `judgingCriteria`, and `sponsors`. Empty lists stay hidden.
3. Until `date` is set, the page shows "Coming" plus `term` (e.g. "Coming Spring 2027").

**Add a social link** (`src/content/site.ts`)
1. Add one line under `socials`, e.g. `discord: "https://discord.gg/..."`.
2. If it's a new platform, add its name to the `SocialPlatform` type at the top of the file and to `labels` in `src/components/SocialLinks.tsx`.

**Replace the logo**: swap the files in `public/brand/` (keep the names) and `src/app/icon.svg` (favicon). Use official files only, unmodified.

**Switch to a custom domain**: change `url` in `src/content/site.ts`, then add the domain in Vercel (see below).

## Student projects

The **Projects** tab (`/projects`) lets Vanderbilt students submit a link. The board gets an email at claudeatvanderbilt@gmail.com; its button opens a review page where one click on **Approve and publish** puts the project on the site. Reject hides it. Review links work once and expire after 14 days. Only `@vanderbilt.edu` emails are accepted.

**One-time setup (Vercel → Project → Settings → Environment Variables):**
1. Storage is the Airtable base "CBC Website" (table `Projects`, in the club Airtable account). Create a personal access token at airtable.com/create/tokens with scopes `data.records:read` and `data.records:write`, and access to that base only. Add it as `AIRTABLE_TOKEN`, and add the base id (the `app...` part of the base's URL) as `AIRTABLE_BASE_ID`.
2. In the club Gmail account, turn on 2-step verification, then create an app password (Google Account → Security → App passwords). Add it as `GMAIL_APP_PASSWORD`.
3. Add `PROJECTS_TOKEN_SECRET`: any long random string (e.g. run `openssl rand -base64 32`). It signs the review links. Changing it invalidates links already emailed.
4. Redeploy, then submit a test project from the live site, approve it from the email, and confirm it appears on `/projects`. If it doesn't, check Vercel → Logs: a storage problem shows an empty page rather than an error.

**Locally:** `npm run dev` works with no setup. Emails are printed in the terminal instead of sent, and projects are kept in memory (lost on restart).

**Airtable limits:** the free plan allows 1,000 API calls a month and 1,000 records per base. The public list is cached for an hour (and refreshed the moment a project is approved) so page views don't use up the calls.

**Spam limit:** one email address can have at most 3 projects waiting for review. Approving or rejecting frees a slot.

**Remove a project:** in the Airtable Projects table, set its Status to Rejected or delete the row. The site updates within an hour.

**Run the tests:** `npm test`.

## How dates work

Pages are static but re-render hourly on Vercel, so events move to "Past" and the board banner disappears after the deadline without a redeploy.

## Deploy and checks

- Every push to `main` deploys to Vercel automatically. If the build fails, the previous version stays live.
- GitHub Actions runs `npm run check`, `npm test`, and `npm run build` on every push and pull request. A red X on a commit means something broke; click it to see which step.
- Dependabot opens weekly pull requests to update dependencies. Merge them when the checks pass.
- Visitor stats are in Vercel → Project → Analytics.
- Custom domain: Vercel → Project → Settings → Domains.

## Maintainers

Brian Tang, Sophie Lin
