export type TeamMember = {
  name: string;
  role: string;
  /** One or two sentences: year, major, and what they're excited about. */
  bio?: string;
  /** File in public/team/, e.g. "/team/first-last.jpg". Falls back to initials. */
  photo?: string;
  linkedin?: string;
  github?: string;
};

export const team: TeamMember[] = [
  {
    name: "Brian Tang",
    role: "Ambassador",
    bio: "Brian is a Computer Science major in Vanderbilt's Class of 2027 who helped launch the Claude Builder Club and loves building with AI. He most recently interned at Microsoft and is back for a second year to help students build with Claude.",
    photo: "/team/brian-tang.jpg",
    linkedin: "https://www.linkedin.com/in/brian-tang05/",
  },
  {
    name: "Sophie Lin",
    role: "Ambassador",
    bio: "Sophie is a Computer Science major in Vanderbilt's Class of 2029 focused on AI, machine learning, and full-stack development. She most recently interned at the Federal Reserve Bank of Atlanta.",
    photo: "/team/sophie-lin.jpg",
    linkedin: "https://www.linkedin.com/in/sophie-lin-csds/",
  },
];

export const pastAmbassadors: TeamMember[] = [
  {
    name: "Vince Lin",
    role: "Previous Ambassador",
    photo: "/team/vince-lin.jpg",
    linkedin: "https://www.linkedin.com/in/vince-lin-3676b9238/",
  },
  {
    name: "Aribah Mahmud",
    role: "Previous Ambassador",
    photo: "/team/aribah-mahmud.jpg",
    linkedin: "https://www.linkedin.com/in/aribah-mahmud/",
  },
  {
    name: "Sanjana Srikanth",
    role: "Previous Ambassador",
    photo: "/team/sanjana-srikanth.jpg",
    linkedin: "https://www.linkedin.com/in/sanjanasrikanth/",
  },
];
