// Grouped links on /links.
import { site } from "./site";

export type LinkItem =
  | {
      kind: "link";
      label: string;
      href: string;
      description?: string;
      /** Only shown while board applications are open. */
      boardOnly?: boolean;
    }
  | { kind: "email"; label: string; email: string };

export type LinkGroup = { title: string; items: LinkItem[] };

export const linkGroups: LinkGroup[] = [
  {
    title: "Club",
    items: [
      { kind: "link", label: "Member Interest Form", href: site.memberSignupUrl, description: "Get updates about meetings and events." },
      ...(site.socials.instagram
        ? [{ kind: "link" as const, label: "Instagram", href: site.socials.instagram }]
        : []),
      ...(site.socials.linkedin
        ? [{ kind: "link" as const, label: "LinkedIn", href: site.socials.linkedin }]
        : []),
      { kind: "link", label: "Board Application", href: "/join", description: "Apply to help run the club.", boardOnly: true },
      { kind: "email", label: "Email", email: site.contactEmail },
    ],
  },
  {
    title: "Learn Claude",
    items: [
      { kind: "link", label: "Claude Docs", href: "https://docs.claude.com" },
      {
        kind: "link",
        label: "Prompt Engineering Guide",
        href: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
      { kind: "link", label: "Anthropic Cookbook", href: "https://github.com/anthropics/anthropic-cookbook" },
      { kind: "link", label: "Claude.ai", href: "https://claude.ai" },
    ],
  },
  {
    title: "Build",
    items: [
      { kind: "link", label: "Anthropic Console", href: "https://console.anthropic.com" },
      { kind: "link", label: "Claude Code Docs", href: "https://docs.claude.com/en/docs/claude-code/overview" },
    ],
  },
];
