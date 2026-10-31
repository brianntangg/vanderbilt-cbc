export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  /** File in public/team/, e.g. "/team/first-last.jpg". */
  photo?: string;
  linkedin?: string;
  github?: string;
};

export const team: TeamMember[] = [
  { name: "Brian Tang", role: "Ambassador", photo: "/team/brian-tang.jpg", linkedin: "https://www.linkedin.com/in/brian-tang05/" },
  { name: "Sophie Lin", role: "Ambassador", photo: "/team/sophie-lin.jpg", linkedin: "https://www.linkedin.com/in/sophie-lin-csds/" },
  // {
  //   name: "First Last",
  //   role: "VP of Engineering",
  //   bio: "One or two sentences about them.",
  //   photo: "/team/first-last.jpg",
  //   linkedin: "https://www.linkedin.com/in/username/",
  //   github: "https://github.com/username",
  // },
];
