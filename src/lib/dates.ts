// Date helpers. All "today" logic uses Central Time (America/Chicago), where the club is.
import type { ClubEvent } from "@/content/events";

const TIME_ZONE = "America/Chicago";

/** Today's date in Central Time as "YYYY-MM-DD". */
export function todayCentral(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now);
}

/** "2026-11-16" -> "November 16". Pass { weekday: true } for "Monday, November 16". */
export function formatDate(iso: string, opts: { weekday?: boolean; year?: boolean } = {}): string {
  // Noon UTC keeps the calendar day stable regardless of the server's time zone.
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    ...(opts.weekday ? { weekday: "long" } : {}),
    ...(opts.year ? { year: "numeric" } : {}),
  }).format(date);
}

export function isTbd(event: ClubEvent): boolean {
  return event.date === "TBD";
}

/** Upcoming includes today and every TBD event. Dated events come first, soonest first. */
export function upcomingEvents(events: ClubEvent[], today = todayCentral()): ClubEvent[] {
  const dated = events.filter((e) => !isTbd(e) && e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  return [...dated, ...events.filter(isTbd)];
}

/** Past events, most recent first. */
export function pastEvents(events: ClubEvent[], today = todayCentral()): ClubEvent[] {
  return events.filter((e) => !isTbd(e) && e.date < today).sort((a, b) => b.date.localeCompare(a.date));
}
