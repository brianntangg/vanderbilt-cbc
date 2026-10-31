# vanderbilt-cbc

Website for the Claude Builder Club at Vanderbilt, a student club in Anthropic's Claude Campus Program. Static Next.js + Tailwind, deployed on Vercel.

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
- Change the form: update `formUrl` and `embedUrl` (Airtable → Share form → Embed).
- Force open/closed: set `forceOpen: true` or `false`. Set it back to `undefined` to follow the deadline.
- New year: update `term`, the dates, and set roles back to `open: true`.

**Update hackathon details** (`src/content/hackathon.ts`)
1. Fill in `date`, `time`, `venue`, and `registrationUrl`.
2. Add items to `schedule`, `prizes`, `judgingCriteria`, and `sponsors`. Empty lists stay hidden.
3. Until `date` is set, the page shows "Coming Spring 2027".

**Add a social link** (`src/content/site.ts`)
1. Add one line under `socials`, e.g. `discord: "https://discord.gg/..."`.
2. If it's a new platform, add its name to the `SocialPlatform` type at the top of the file and to `labels` in `src/components/SocialLinks.tsx`.

**Replace the logo**: swap the files in `public/brand/` (keep the names) and `src/app/icon.svg` (favicon). Use official files only, unmodified.

**Switch to a custom domain**: change `url` in `src/content/site.ts`, then add the domain in Vercel (see below).

## How dates work

Pages are static but re-render hourly on Vercel, so events move to "Past" and the board banner disappears after the deadline without a redeploy.

## Deploy

Vercel imports the GitHub repo. Every push to `main` deploys automatically. Add a custom domain under Project → Settings → Domains.

## Maintainers

Brian Tang, Sophie Lin
