import { site } from "@/content/site";
import { ExternalLinkIcon } from "./icons";

export function AirtableEmbed() {
  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <iframe
          src={site.board.embedUrl}
          title={`${site.shortName} board application form (Airtable)`}
          loading="lazy"
          className="block h-[1200px] w-full bg-transparent sm:h-[1000px]"
        />
      </div>
      <p className="mt-3 text-sm">
        <a
          href={site.board.formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-accent transition-colors hover:text-accent-hover"
        >
          Form not loading? Open it in a new tab
          <ExternalLinkIcon />
        </a>
      </p>
    </div>
  );
}
