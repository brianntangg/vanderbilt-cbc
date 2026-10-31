// Hackathon details. Leave a field unset (or a list empty) and its section stays hidden.
// Once `date` is set, the page switches from "Coming soon" to the full details view.

export type Hackathon = {
  term: string;
  /** ISO "YYYY-MM-DD". */
  date?: string;
  /** e.g. "Saturday 9:00 AM – Sunday 5:00 PM". */
  time?: string;
  venue?: string;
  registrationUrl?: string;
  /** Shown while details are TBD. */
  whatToExpect: string[];
  schedule: { time: string; item: string }[];
  prizes: { title: string; description?: string }[];
  judgingCriteria: { name: string; description?: string }[];
  sponsors: { name: string; url?: string }[];
};

export const hackathon: Hackathon = {
  term: "Spring 2027",
  whatToExpect: [
    "A weekend of building with Claude, solo or in teams.",
    "Workshops and mentors to help you get started.",
    "API credits for every participant.",
    "Prizes and judging by people from industry and campus.",
  ],
  schedule: [],
  prizes: [],
  judgingCriteria: [],
  sponsors: [],
};
