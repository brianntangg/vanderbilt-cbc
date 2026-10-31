import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ExternalLinkIcon } from "@/components/icons";
import { Section } from "@/components/Section";
import { events } from "@/content/events";
import { formatDate, pastEvents } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Slides",
  description: "Slides from past Claude Builder Club at Vanderbilt meetings and workshops.",
  path: "/slides",
});

export default function SlidesPage() {
  // Derived from events.ts: any past event with a slidesUrl, newest first.
  const decks = pastEvents(events).filter((event) => event.slidesUrl);

  return (
    <Section as="h1" eyebrow="Slides" title="Slides from past events" intro="Catch up on anything you missed.">
      {decks.length > 0 ? (
        <ul className="grid gap-3">
          {decks.map((event) => (
            <li key={event.id}>
              <a
                href={event.slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-6 py-5 transition-colors hover:border-muted sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-semibold">{event.title}</span>
                <span className="inline-flex items-center gap-2 font-mono text-[13px] text-muted">
                  <time dateTime={event.date}>{formatDate(event.date, { year: true })}</time>
                  <ExternalLinkIcon className="text-accent" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="max-w-[640px]">
          <p className="text-lg">No slides yet.</p>
          <p className="mt-2 text-muted">Slides from our meetings and workshops will show up here after each event.</p>
          <div className="mt-6">
            <Button href="/events" variant="secondary">
              See upcoming events
            </Button>
          </div>
        </Card>
      )}
    </Section>
  );
}
