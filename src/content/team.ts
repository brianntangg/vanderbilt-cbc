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
    // TODO: bio
    photo: "/team/brian-tang.jpg",
    linkedin: "https://www.linkedin.com/in/brian-tang05/",
  },
  {
    name: "Sophie Lin",
    role: "Ambassador",
    // TODO: bio
    photo: "/team/sophie-lin.jpg",
    linkedin: "https://www.linkedin.com/in/sophie-lin-csds/",
  },
];

export const pastAmbassadors: TeamMember[] = [
  {
    name: "Vince Lin",
    role: "Previous Ambassador",
    // TODO: photo: "/team/vince-lin.jpg",
    linkedin: "https://www.linkedin.com/in/vince-lin-3676b9238/",
  },
  {
    name: "Aribah Mahmud",
    role: "Previous Ambassador",
    // TODO: photo: "/team/aribah-mahmud.jpg",
    linkedin: "https://www.linkedin.com/in/aribah-mahmud/",
  },
  {
    name: "Sanjana Srikanth",
    role: "Previous Ambassador",
    // TODO: photo: "/team/sanjana-srikanth.jpg",
    linkedin: "https://www.linkedin.com/in/sanjanasrikanth/",
  },
];
