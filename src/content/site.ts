// Club-wide settings. Edit values here; components read from this file.

/** Add a platform here (and to `socials` below) to show it in the footer and on /links. */
export type SocialPlatform = "instagram" | "linkedin" | "discord" | "github" | "x" | "youtube";

export type Site = {
  name: string;
  shortName: string;
  tagline: string;
  /** Public site URL, used for metadata and Open Graph. Change this when switching to a custom domain. */
  url: string;
  contactEmail: string;
  memberSignupUrl: string;
  socials: Partial<Record<SocialPlatform, string>>;
  board: {
    formUrl: string;
    embedUrl: string;
    /** "YYYY-MM-DD". Applications close at the end of this day, Central Time. */
    deadline: string;
    /** "YYYY-MM-DD". */
    decisionDate: string;
    /** "2026–27". Shown in the eyebrow and closed message. */
    term: string;
    /** true/false overrides the deadline; undefined follows it. */
    forceOpen: boolean | undefined;
  };
};

export const site: Site = {
  name: "Claude Builder Club at Vanderbilt",
  shortName: "CBC Vanderbilt",
  tagline: "Vanderbilt's student community for building with Claude",
  url: "https://vanderbilt-cbc.vercel.app",
  contactEmail: "claudeatvanderbilt@gmail.com",
  memberSignupUrl: "https://www.jotform.com/253555944387168",
  socials: {
    instagram: "https://www.instagram.com/cbcvanderbilt",
    linkedin: "https://www.linkedin.com/company/claude-builder-club-vanderbilt/",
  },
  board: {
    formUrl: "https://airtable.com/appGwA9kZRLa2WTNA/pagjinjDnBhHTSF45/form",
    embedUrl: "https://airtable.com/embed/appGwA9kZRLa2WTNA/pagjinjDnBhHTSF45/form",
    deadline: "2026-11-16",
    decisionDate: "2026-11-23",
    term: "2026–27",
    forceOpen: undefined,
  },
};
