export type Hackathon = {
  term: string;
  /** ISO "YYYY-MM-DD". */
  date?: string;
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
