import { PROJECT_TYPES, type ProjectType, type SubmissionInput } from "./types";

type Errors = Partial<Record<keyof SubmissionInput, string>>;
type Result = { ok: true; value: SubmissionInput } | { ok: false; errors: Errors };

const MAX_TITLE = 80;
const MAX_NAME = 80;
const MAX_DESCRIPTION = 200;
const MAX_URL = 500;
const EMAIL_DOMAIN = "@vanderbilt.edu";

function text(raw: Record<string, unknown>, key: keyof SubmissionInput): string {
  const value = raw[key];
  return typeof value === "string" ? value.trim() : "";
}

function isHttpsUrl(value: string): boolean {
  if (value.length > MAX_URL) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateSubmission(input: unknown): Result {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, errors: { title: "Invalid submission." } };
  }
  const raw = input as Record<string, unknown>;
  const value = {
    title: text(raw, "title"),
    url: text(raw, "url"),
    type: text(raw, "type"),
    description: text(raw, "description"),
    name: text(raw, "name"),
    email: text(raw, "email"),
  };
  const errors: Errors = {};

  if (!value.title) errors.title = "Add a project title.";
  else if (value.title.length > MAX_TITLE) errors.title = `Keep the title under ${MAX_TITLE} characters.`;

  if (!value.url) errors.url = "Add a link to your project.";
  else if (!isHttpsUrl(value.url)) errors.url = "Use a full https:// link.";

  if (!(PROJECT_TYPES as readonly string[]).includes(value.type)) errors.type = "Pick a project type.";

  if (!value.description) errors.description = "Add a short description.";
  else if (value.description.length > MAX_DESCRIPTION) {
    errors.description = `Keep the description under ${MAX_DESCRIPTION} characters.`;
  }

  if (!value.name) errors.name = "Add your name.";
  else if (value.name.length > MAX_NAME) errors.name = `Keep your name under ${MAX_NAME} characters.`;

  const email = value.email.toLowerCase();
  const local = email.slice(0, -EMAIL_DOMAIN.length);
  if (!value.email) errors.email = "Add your Vanderbilt email.";
  else if (!email.endsWith(EMAIL_DOMAIN) || !local || /[\s@]/.test(local)) {
    errors.email = "Use your @vanderbilt.edu email address.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { ...value, type: value.type as ProjectType } };
}
