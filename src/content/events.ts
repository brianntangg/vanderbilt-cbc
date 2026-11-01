export type EventType = "meeting" | "workshop" | "campus-session" | "hackathon" | "social";

export type ClubEvent = {
  /** Must be unique. */
  id: string;
  title: string;
  type: EventType;
  /** ISO "YYYY-MM-DD", or "TBD". */
  date: string;
  /** Shown when date is "TBD". */
  term?: string;
  time?: string;
  location?: string;
  description: string;
  rsvpUrl?: string;
  slidesUrl?: string;
  recap?: string;
};

export const events: ClubEvent[] = [
  {
    id: "2026-11-12-meeting",
    title: "CBC Meeting",
    type: "meeting",
    date: "2026-11-12",
    description:
      "Our monthly club meeting: what members are building, club updates, and a short Claude demo.",
  },
  {
    id: "2026-11-17-claude-code-skills",
    title: "Workshop: Claude Code & Skills",
    type: "workshop",
    date: "2026-11-17",
    description:
      "A hands-on workshop on Claude Code and Skills. Bring a laptop and leave with a working setup.",
  },
  {
    id: "2026-12-02-workshop",
    title: "CBC Workshop",
    type: "workshop",
    date: "2026-12-02",
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
