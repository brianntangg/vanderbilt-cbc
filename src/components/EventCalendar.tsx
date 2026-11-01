import type { ClubEvent } from "@/content/events";
import { isTbd, todayCentral } from "@/lib/dates";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Month = { year: number; month: number }; // month is 0-based

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** Every month that has at least one dated event, in order. */
function monthsWithEvents(events: ClubEvent[]): Month[] {
  const keys = [...new Set(events.filter((e) => !isTbd(e)).map((e) => monthKey(e.date)))].sort();
  return keys.map((key) => {
    const [year, month] = key.split("-").map(Number);
    return { year, month: month - 1 };
  });
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function EventCalendar({ events, today = todayCentral() }: { events: ClubEvent[]; today?: string }) {
  const months = monthsWithEvents(events);
  if (months.length === 0) return null;

  const byDate = new Map<string, ClubEvent[]>();
  for (const event of events) {
    if (isTbd(event)) continue;
    byDate.set(event.date, [...(byDate.get(event.date) ?? []), event]);
  }

  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))]">
      {months.map((m) => (
        <MonthGrid key={`${m.year}-${m.month}`} {...m} byDate={byDate} today={today} />
      ))}
    </div>
  );
}

function MonthGrid({
  year,
  month,
  byDate,
  today,
}: Month & { byDate: Map<string, ClubEvent[]>; today: string }) {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leading = first.getUTCDay();
  const label = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" }).format(first);

  const cells: (number | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <section aria-label={label} className="rounded-xl border border-line bg-surface p-5">
      <h3 className="font-display text-[22px] font-medium">{label}</h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} aria-hidden="true" className="pb-1 font-mono text-[11px] uppercase tracking-[0.06em] text-subtle">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} aria-hidden="true" />;
          const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
          const dayEvents = byDate.get(iso) ?? [];
          const isToday = iso === today;
          const isPast = iso < today;

          if (dayEvents.length === 0) {
            return (
              <div
                key={iso}
                aria-hidden="true"
                className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
                  isToday ? "border border-muted text-ink" : "text-muted"
                }`}
              >
                {day}
              </div>
            );
          }

          const titles = dayEvents.map((e) => e.title).join(", ");
          return (
            <a
              key={iso}
              href={`#${dayEvents[0].id}`}
              title={titles}
              className={`group flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm font-semibold transition-colors ${
                isPast
                  ? "bg-surface-2 text-muted hover:text-ink"
                  : "bg-accent-soft text-accent ring-1 ring-accent/40 hover:bg-accent hover:text-bg"
              }`}
            >
              <span>{day}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-current" />
              <span className="sr-only">: {titles}</span>
            </a>
          );
        })}
      </div>
      <ul className="mt-5 space-y-2 border-t border-line pt-4">
        {[...byDate.entries()]
          .filter(([iso]) => iso.startsWith(`${year}-${pad(month + 1)}`))
          .sort(([a], [b]) => a.localeCompare(b))
          .flatMap(([iso, evs]) =>
            evs.map((e) => (
              <li key={e.id} className="flex items-baseline gap-3 text-[15px]">
                <time dateTime={iso} className="w-12 shrink-0 font-mono text-[13px] text-accent">
                  {new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" }).format(
                    new Date(`${iso}T12:00:00Z`),
                  )}
                </time>
                <a href={`#${e.id}`} className="text-ink transition-colors hover:text-accent">
                  {e.title}
                </a>
              </li>
            )),
          )}
      </ul>
    </section>
  );
}
