import Image from "next/image";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EventCard } from "@/components/EventCard";
import { Section } from "@/components/Section";
import { events } from "@/content/events";
import { site } from "@/content/site";
import { upcomingEvents } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "About", description: site.tagline, path: "/" });

const offerings = [
  { title: "Workshops", body: "Hands-on sessions where you build something real with Claude, from prompts to agents." },
  { title: "Hackathon", body: "A campus-wide spring hackathon with mentors, API credits, and prizes." },
  { title: "Community", body: "Monthly meetings to share what you're building and meet other builders." },
  { title: "Campus Sessions", body: "Short Claude demos in classes and student orgs across Vanderbilt." },
];

export default function AboutPage() {
  const nextEvent = upcomingEvents(events)[0];

  return (
    <>
      <Section
        as="h1"
        eyebrow="Claude Builder Club · Vanderbilt"
        title="Build with Claude at Vanderbilt"
        intro={site.tagline + "."}
        className="pt-20 sm:pt-28"
      >
        <div className="flex flex-wrap gap-3">
          <Button href={site.memberSignupUrl}>Join the club</Button>
          <Button href="/events" variant="secondary">
            See upcoming events
          </Button>
        </div>
      </Section>

      <Section eyebrow="Our mission" title="Help every student build something useful with AI">
        <p className="max-w-[640px] text-lg text-muted">
          We&apos;re a student community for anyone curious about building with Claude, whatever your major or
          experience. We learn by making things together, then share what works.
        </p>
      </Section>

      <Section eyebrow="What we do" title="Four ways to get involved">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((item) => (
            <Card as="li" key={item.title}>
              <h3 className="text-[19px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted">{item.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {nextEvent && (
        <Section eyebrow="Next event" title="Come build with us">
          <div className="max-w-[640px]">
            <EventCard event={nextEvent} />
          </div>
          <p className="mt-6">
            <Button href="/events" variant="secondary">
              All events
            </Button>
          </p>
        </Section>
      )}

      <Section eyebrow="Backed by Anthropic" title="Part of the Claude Campus Program">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <p className="max-w-[560px] text-lg text-muted">
            We&apos;re one of the student clubs in Anthropic&apos;s Claude Campus Program, which supports students
            learning and building with Claude through resources, API credits, and events.
          </p>
          {/* The official wordmark is dark, so it sits on an ivory panel rather than being recolored. */}
          <div className="flex items-center justify-center rounded-xl bg-ink px-10 py-12">
            <Image src="/brand/claude-logo.svg" alt="Claude" width={230} height={49} unoptimized />
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-[30px] font-medium leading-[1.1] tracking-[-0.015em] sm:text-[38px]">
              Ready to start building?
            </h2>
            <p className="mt-3 text-lg text-muted">Fill out the interest form to hear about meetings and events.</p>
          </div>
          <Button href={site.memberSignupUrl}>Join the club</Button>
        </div>
      </Section>
    </>
  );
}
