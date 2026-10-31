import Link from "next/link";
import { isExternal } from "@/components/Button";
import { ExternalLinkIcon, MailIcon } from "@/components/icons";
import { Section } from "@/components/Section";
import { linkGroups, type LinkItem } from "@/content/links";
import { isBoardApplicationOpen } from "@/lib/board";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Links",
  description: "Club links and resources for learning and building with Claude.",
  path: "/links",
});

const rowClass =
  "flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4 transition-colors";

export default function LinksPage() {
  const boardOpen = isBoardApplicationOpen();

  return (
    <Section as="h1" eyebrow="Links" title="Everything in one place">
      <div className="grid gap-12 lg:grid-cols-3">
        {linkGroups.map((group) => (
          <section key={group.title} aria-labelledby={`links-${group.title}`}>
            <h2 id={`links-${group.title}`} className="mb-4 font-mono text-[13px] uppercase tracking-[0.08em] text-accent">
              {group.title}
            </h2>
            <ul className="grid gap-3">
              {group.items
                .filter((item) => !(item.kind === "link" && item.boardOnly && !boardOpen))
                .map((item) => (
                  <li key={item.label}>
                    <LinkRow item={item} />
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}

function LinkRow({ item }: { item: LinkItem }) {
  if (item.kind === "email") {
    return (
      <div className={rowClass}>
        <div>
          <p className="font-semibold">{item.label}</p>
          <p className="mt-0.5 select-all break-all text-sm text-muted">{item.email}</p>
        </div>
        <MailIcon className="shrink-0 text-muted" />
      </div>
    );
  }

  const content = (
    <>
      <div>
        <p className="font-semibold">{item.label}</p>
        {item.description && <p className="mt-0.5 text-sm text-muted">{item.description}</p>}
      </div>
      {isExternal(item.href) && <ExternalLinkIcon className="shrink-0 text-accent" />}
    </>
  );

  if (isExternal(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={`${rowClass} hover:border-muted`}>
        {content}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={item.href} className={`${rowClass} hover:border-muted`}>
      {content}
    </Link>
  );
}
