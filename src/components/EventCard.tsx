import type { ClubEvent, EventType } from "@/content/events";
import { formatDate, isTbd } from "@/lib/dates";
import { Card } from "./Card";
import { ExternalLinkIcon } from "./icons";
import { Pill } from "./Pill";

const typeLabels: Record<EventType, string> = {
  meeting: "Meeting",
  workshop: "Workshop",
  "campus-session": "Campus Session",
  hackathon: "Hackathon",
  social: "Social",
};

export function EventCard({ event }: { event: ClubEvent }) {
  const when = isTbd(event) ? (event.term ?? "Date TBA") : formatDate(event.date, { weekday: true });
  const details = [event.time, event.location].filter(Boolean);

  return (
    <Card as="article" className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3">
        <Pill>{typeLabels[event.type]}</Pill>
        <p className="font-mono text-[13px] text-muted">
          {isTbd(event) ? when : <time dateTime={event.date}>{when}</time>}
        </p>
      </div>
      <h3 className="mt-4 text-[19px] font-semibold">{event.title}</h3>
      {details.length > 0 ? (
        <p className="mt-1 text-sm text-muted">{details.join(" · ")}</p>
      ) : (
        <p className="mt-1 text-sm text-subtle">Time and location TBA</p>
      )}
      <p className="mt-3 text-muted">{event.description}</p>
      {event.recap && <p className="mt-3 text-muted">{event.recap}</p>}
      {(event.rsvpUrl || event.slidesUrl) && (
        <div className="mt-5 flex flex-wrap gap-4 text-[15px] font-medium">
          {event.rsvpUrl && <CardLink href={event.rsvpUrl}>RSVP</CardLink>}
          {event.slidesUrl && <CardLink href={event.slidesUrl}>Slides</CardLink>}
        </div>
      )}
    </Card>
  );
}

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-accent transition-colors hover:text-accent-hover"
    >
      {children}
      <ExternalLinkIcon />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
