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
  // Past events: Spring 2026
  {
    id: "2026-04-11-hackathon",
    title: "Claude Hackathon",
    type: "hackathon",
    date: "2026-04-11",
    time: "10:00 AM–6:00 PM",
    location: "FGH 134",
    description:
      "The second edition of our Claude-first hackathon, sponsored by Anthropic and open to students of all backgrounds, with $1,500 in Anthropic API credits as prizes.",
    recap:
      "Winners: Elara (1st), EntryPoint (2nd), StudySync (3rd), and Muse (WildCard Prize, sponsored by Procurement Labs). Thanks to Dr. Jesse Spencer-Smith of the College of Connected Computing for leading a workshop and judging.",
  },
  {
    id: "2026-04-02-hackathon-info-session",
    title: "Hackathon Info Session",
    type: "campus-session",
    date: "2026-04-02",
    time: "4:30 PM",
    location: "FGH 129",
    description:
      "Everything about the spring hackathon: prizes, how to sign up, and free Claude Pro and API credits before the event.",
  },
  {
    id: "2026-03-24-claude-code-workshop",
    title: "Technical Workshop: Claude Code in VS Code",
    type: "workshop",
    date: "2026-03-24",
    time: "2:30–3:30 PM",
    location: "FGH 129",
    description: "How to connect Claude Code to VS Code, plus an introduction to prompt engineering.",
  },
  {
    id: "2026-03-05-meeting",
    title: "CBC Meeting",
    type: "meeting",
    date: "2026-03-05",
    time: "4:00–5:00 PM",
    location: "FGH 129",
    description: "A club meeting on using Claude, with another chance to get a free Claude Pro account.",
  },
  {
    id: "2026-02-06-info-session",
    title: "Spring Info Session",
    type: "campus-session",
    date: "2026-02-06",
    time: "3:00–4:00 PM",
    location: "FGH 110",
    description: "Kicking off our second semester: what the club does, plus free Claude Pro and API credits for members.",
  },
  // Past events: Fall 2025
  {
    id: "2025-11-15-hackathon",
    title: "Claude Builder Club Hackathon",
    type: "hackathon",
    date: "2025-11-15",
    time: "2:00–8:00 PM",
    location: "FGH 134",
    description:
      "Our first hackathon: an afternoon of building with Claude, sponsored by Anthropic and Synquery, with $2,450 in prizes.",
  },
  {
    id: "2025-11-11-leetcode-competition",
    title: "LeetCode Competition with GDG Vanderbilt",
    type: "social",
    date: "2025-11-11",
    time: "6:00–7:00 PM",
    location: "FGH 132",
    description:
      "A friendly LeetCode competition co-hosted with Google Developer Groups at Vanderbilt, with prizes and food from Dumpling House.",
  },
  {
    id: "2025-10-29-mcp-watch-party",
    title: "Building with MCP Livestream Watch Party",
    type: "campus-session",
    date: "2025-10-29",
    time: "6:00–7:00 PM",
    location: "Buttrick 301",
    description:
      "A session hosted by a member of Anthropic's technical staff: watching an MCP server get built live and learning how to start building our own.",
  },
  {
    id: "2025-10-07-mcp-workshop",
    title: "Technical Workshop: Model Context Protocol",
    type: "workshop",
    date: "2025-10-07",
    time: "6:00–7:00 PM",
    location: "FGH 132",
    description:
      "A hands-on workshop from our technical leads on MCP, the protocol for connecting AI assistants to data sources and tools.",
  },
  {
    id: "2025-10-01-sonnet-4-5-challenge",
    title: "Claude Sonnet 4.5 Build Challenge",
    type: "hackathon",
    date: "2025-10-01",
    description:
      "A 36-hour coding challenge to celebrate the launch of Claude Sonnet 4.5: build and ship something with the new model.",
  },
  {
    id: "2025-09-24-claude-code-watch-party",
    title: "Claude Code Workshop Livestream Watch Party",
    type: "campus-session",
    date: "2025-09-24",
    time: "6:00–7:00 PM",
    location: "Calhoun 204",
    description: "A Claude Code workshop hosted by Alex Notov, Member of Technical Staff at Anthropic. Pizza provided.",
  },
  {
    id: "2025-09-04-info-session",
    title: "Info Session",
    type: "campus-session",
    date: "2025-09-04",
    time: "7:00 PM",
    location: "FGH 138",
    description: "Our very first meeting: an introduction to the club, where attendees could claim a free Claude Pro account.",
  },
];
