import { Section } from "@/components/Section";
import { TeamCard } from "@/components/TeamCard";
import { pastAmbassadors, team } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Team",
  description: "The students who run the Claude Builder Club at Vanderbilt.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <Section
        as="h1"
        eyebrow="Team"
        title="Meet the Team"
        intro="The Claude Ambassadors leading the Builder Club at Vanderbilt."
      >
        <ul className="mx-auto grid max-w-[760px] gap-6 sm:grid-cols-2">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </ul>
        <p className="mx-auto mt-12 max-w-[640px] text-center text-lg text-muted">
          This club is by students, for students. If you have any questions, don&apos;t hesitate to reach out.
        </p>
      </Section>

      {pastAmbassadors.length > 0 && (
        <Section className="pt-0 sm:pt-0">
          <h2 className="mb-8 text-center font-display text-[30px] font-medium tracking-[-0.015em] sm:text-[38px]">
            Previous Ambassadors
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastAmbassadors.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
