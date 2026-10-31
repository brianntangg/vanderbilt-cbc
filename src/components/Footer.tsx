import { site } from "@/content/site";
import { MailIcon } from "./icons";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[560px] text-sm text-muted">
          <p className="font-semibold text-ink">Backed by Anthropic</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Vanderbilt Claude Builder Club</p>
          <p className="mt-3 flex items-center gap-2">
            <MailIcon className="shrink-0" />
            <span className="select-all">{site.contactEmail}</span>
          </p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
