import { EventCalendar } from "@/components/EventCalendar";
import { EventCard } from "@/components/EventCard";
import { Section } from "@/components/Section";
import { events } from "@/content/events";
import { pastEvents, upcomingEvents } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Events",
  description: "Meetings, workshops, and the hackathon from the Claude Builder Club at Vanderbilt.",
  path: "/events",
});

export default function EventsPage() {
  const upcoming = upcomingEvents(events);
  const past = pastEvents(events);

  return (
    <>
      <Section
        as="h1"
        eyebrow="Events"
        title="Meetings, workshops, and more"
        intro="Everything is open to all Vanderbilt students. No experience needed."
      >
        <h2 className="mb-6 font-display text-[28px] font-medium">Calendar</h2>
        <EventCalendar events={events} />

        <h2 className="mt-14 mb-6 font-display text-[28px] font-medium">Upcoming</h2>
        {upcoming.length > 0 ? (
          <EventGrid>
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </EventGrid>
        ) : (
          <p className="text-muted">No upcoming events yet. Check back soon.</p>
        )}
      </Section>

      {past.length > 0 && (
        <Section className="pt-0 sm:pt-0">
          <h2 className="mb-6 font-display text-[28px] font-medium">Past</h2>
          <EventGrid>
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </EventGrid>
        </Section>
      )}
    </>
  );
}

function EventGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))]">{children}</div>;
}
