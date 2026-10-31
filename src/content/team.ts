// Team members, shown on /team in this order.
// Photos go in public/team/ and are referenced as "/team/filename.jpg".

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  /** e.g. "/team/brian-tang.jpg". Initials are shown when unset. */
  photo?: string;
  linkedin?: string;
  github?: string;
};

export const team: TeamMember[] = [
  { name: "Brian Tang", role: "Ambassador" },
  { name: "Sophie Lin", role: "Ambassador" },
  // {
  //   name: "First Last",
  //   role: "VP of Engineering",
  //   bio: "One or two sentences about them.",
  //   photo: "/team/first-last.jpg",
  //   linkedin: "https://www.linkedin.com/in/username/",
  //   github: "https://github.com/username",
  // },
];
