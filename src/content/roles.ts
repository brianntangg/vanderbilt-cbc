export type Role = {
  title: string;
  summary: string;
  duties: string[];
  open: boolean;
};

export const roles: Role[] = [
  {
    title: "VP of Operations",
    summary: "Keeps every event running on time and in the right room.",
    duties: [
      "Book rooms for meetings and workshops through campus scheduling.",
      "Plan setup, food, and A/V.",
      "Run the check-in form and API credit distribution.",
      "Keep the event calendar up to date.",
    ],
    open: true,
  },
  {
    title: "VP of Engineering",
    summary: "Builds the technical content members learn from.",
    duties: [
      "Build workshop demos and starter repos.",
      "Co-present technical segments.",
      "Help attendees debug during hands-on sections.",
      "Mentor teams at the hackathon.",
    ],
    open: true,
  },
  {
    title: "VP of Marketing",
    summary: "Gets students to show up and learn something from our posts.",
    duties: [
      "Draft and design bi-weekly educational posts.",
      "Make flyers and announcements.",
      "Promote the hackathon.",
      "Keep the club's look consistent.",
    ],
    open: true,
  },
  {
    title: "VP of Partnerships",
    summary: "Brings in the people and sponsors behind our biggest events.",
    duties: [
      "Recruit sponsors, judges, and mentors.",
      "Define hackathon prizes and judging criteria.",
      "Build relationships with startups, companies, and faculty.",
      "Line up guest speakers.",
    ],
    open: true,
  },
  {
    title: "VP of Outreach",
    summary: "Grows the club and keeps members coming back.",
    duties: [
      "Book short Claude demos in classes and orgs.",
      "Manage the member list, group chat, and reminders.",
      "Collect feedback after events.",
      "Welcome new members.",
    ],
    open: true,
  },
];
