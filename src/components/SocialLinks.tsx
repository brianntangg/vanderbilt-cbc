import { site, type SocialPlatform } from "@/content/site";
import { ExternalLinkIcon, InstagramIcon, LinkedInIcon } from "./icons";

const labels: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  discord: "Discord",
  github: "GitHub",
  x: "X",
  youtube: "YouTube",
};

const icons: Partial<Record<SocialPlatform, typeof InstagramIcon>> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
};

export function SocialLinks() {
  const entries = Object.entries(site.socials) as [SocialPlatform, string | undefined][];
  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([platform, url]) => {
        if (!url) return null;
        const Icon = icons[platform] ?? ExternalLinkIcon;
        return (
          <li key={platform}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-muted hover:text-ink"
            >
              <Icon />
              <span className="sr-only">{labels[platform]}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
