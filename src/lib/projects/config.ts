import { site } from "@/content/site";

/** Secret used to sign review links. Required in production; a fixed fallback keeps local dev working. */
export function tokenSecret(): string {
  const secret = process.env.PROJECTS_TOKEN_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("PROJECTS_TOKEN_SECRET is not set");
  return "dev-only-secret";
}

export function baseUrl(): string {
  return process.env.SITE_URL ?? site.url;
}
