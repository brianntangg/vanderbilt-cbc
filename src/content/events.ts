// Club events. Upcoming vs past is decided automatically from `date` (Central Time).
// Add `slidesUrl` after an event and it appears on /slides.

export type EventType = "meeting" | "workshop" | "campus-session" | "hackathon" | "social";

export type ClubEvent = {
  /** Unique slug, e.g. "2026-11-18-claude-code-workshop". */
  id: string;
  title: string;
  type: EventType;
  /** ISO "YYYY-MM-DD", or "TBD". */
  date: string;
  /** e.g. "Spring 2027". Shown when date is "TBD". */
  term?: string;
  /** e.g. "6:00–7:30 PM". */
  time?: string;
  location?: string;
  description: string;
  rsvpUrl?: string;
  slidesUrl?: string;
  recap?: string;
};

export const events: ClubEvent[] = [
  {
    id: "fall-2026-meeting",
    title: "CBC Meeting",
    type: "meeting",
    date: "TBD",
    term: "Fall 2026",
    description:
      "Our monthly club meeting: what members are building, club updates, and a short Claude demo.",
  },
  {
    id: "fall-2026-claude-code-skills",
    title: "Claude Code & Skills",
    type: "workshop",
    date: "TBD",
    term: "Fall 2026",
    description:
      "A hands-on workshop on Claude Code and Skills. Bring a laptop and leave with a working setup.",
  },
  {
    id: "fall-2026-workshop",
    title: "Workshop: Topic TBA",
    type: "workshop",
    date: "TBD",
    term: "Fall 2026",
    description: "Our last workshop of the semester. Topic coming soon.",
  },
  {
    id: "spring-2027-hackathon",
    title: "Campus-wide Hackathon",
    type: "hackathon",
    date: "TBD",
    term: "Spring 2027",
    description: "A campus-wide hackathon for building with Claude. Details on the Hackathon page as they're set.",
  },
  {
    id: "spring-2027-meeting-1",
    title: "CBC Meeting",
    type: "meeting",
    date: "TBD",
    term: "Spring 2027",
    description: "Monthly club meeting.",
  },
  {
    id: "spring-2027-meeting-2",
    title: "CBC Meeting",
    type: "meeting",
    date: "TBD",
    term: "Spring 2027",
    description: "Monthly club meeting.",
  },
  {
    id: "spring-2027-meeting-3",
    title: "CBC Meeting",
    type: "meeting",
    date: "TBD",
    term: "Spring 2027",
    description: "Monthly club meeting.",
  },
  {
    id: "spring-2027-workshop-1",
    title: "Workshop",
    type: "workshop",
    date: "TBD",
    term: "Spring 2027",
    description: "Hands-on workshop. Topic coming soon.",
  },
  {
    id: "spring-2027-workshop-2",
    title: "Workshop",
    type: "workshop",
    date: "TBD",
    term: "Spring 2027",
    description: "Hands-on workshop. Topic coming soon.",
  },
];
