import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { hackathon } from "@/content/hackathon";
import { site } from "@/content/site";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Hackathon",
  description: `The ${hackathon.term} campus-wide hackathon from the Claude Builder Club at Vanderbilt.`,
  path: "/hackathon",
});

export default function HackathonPage() {
  const { date, time, venue, registrationUrl, schedule, prizes, judgingCriteria, sponsors } = hackathon;

  if (!date) {
    return (
      <Section
        as="h1"
        eyebrow={`Hackathon · Coming ${hackathon.term}`}
        title="A campus-wide hackathon for building with Claude"
        intro="Date, venue, and prizes are coming soon. Here's what to expect."
        className="pt-20 sm:pt-24"
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {hackathon.whatToExpect.map((item) => (
            <Card as="li" key={item} className="text-muted">
              {item}
            </Card>
          ))}
        </ul>
        <div className="mt-10">
          <p className="mb-4 text-muted">Fill out the interest form to hear when registration opens.</p>
          <Button href={site.memberSignupUrl}>Get hackathon updates</Button>
        </div>
      </Section>
    );
  }

  const facts = [formatDate(date, { weekday: true, year: true }), time, venue].filter(Boolean);

  return (
    <>
      <Section
        as="h1"
        eyebrow={`Hackathon · ${hackathon.term}`}
        title="A campus-wide hackathon for building with Claude"
        intro={facts.join(" · ")}
        className="pt-20 sm:pt-24"
      >
        <Button href={registrationUrl ?? site.memberSignupUrl}>
          {registrationUrl ? "Register" : "Get hackathon updates"}
        </Button>
      </Section>

      {schedule.length > 0 && (
        <Section title="Schedule" className="pt-0 sm:pt-0">
          <Card as="div" className="p-0">
            <ol className="divide-y divide-line">
              {schedule.map((slot) => (
                <li key={`${slot.time}-${slot.item}`} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:gap-8">
                  <span className="w-40 shrink-0 font-mono text-[13px] text-accent">{slot.time}</span>
                  <span>{slot.item}</span>
                </li>
              ))}
            </ol>
          </Card>
        </Section>
      )}

      {prizes.length > 0 && (
        <Section title="Prizes" className="pt-0 sm:pt-0">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prizes.map((prize) => (
              <Card as="li" key={prize.title}>
                <h3 className="text-[19px] font-semibold">{prize.title}</h3>
                {prize.description && <p className="mt-2 text-muted">{prize.description}</p>}
              </Card>
            ))}
          </ul>
        </Section>
      )}

      {judgingCriteria.length > 0 && (
        <Section title="Judging criteria" className="pt-0 sm:pt-0">
          <ul className="grid gap-4 sm:grid-cols-2">
            {judgingCriteria.map((criterion) => (
              <Card as="li" key={criterion.name}>
                <h3 className="text-[19px] font-semibold">{criterion.name}</h3>
                {criterion.description && <p className="mt-2 text-muted">{criterion.description}</p>}
              </Card>
            ))}
          </ul>
        </Section>
      )}

      {sponsors.length > 0 && (
        <Section title="Sponsors" className="pt-0 sm:pt-0">
          <ul className="flex flex-wrap gap-3">
            {sponsors.map((sponsor) => (
              <li key={sponsor.name}>
                {sponsor.url ? (
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg border border-line px-4 py-2 transition-colors hover:border-muted"
                  >
                    {sponsor.name}
                  </a>
                ) : (
                  <span className="inline-flex rounded-lg border border-line px-4 py-2">{sponsor.name}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
