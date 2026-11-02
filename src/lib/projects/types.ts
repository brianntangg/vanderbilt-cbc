export const PROJECT_TYPES = ["GitHub", "Claude artifact", "Design", "Other"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export type SubmissionInput = {
  title: string;
  url: string;
  type: ProjectType;
  description: string;
  name: string;
  email: string;
};

export type Project = SubmissionInput & {
  id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  approvedAt?: number;
};

/** What the public site may see: never the submitter's email or review status. */
export type PublicProject = Omit<Project, "email" | "status">;
