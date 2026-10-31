import { Section } from "@/components/Section";
import { TeamCard } from "@/components/TeamCard";
import { team } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Team",
  description: "The students who run the Claude Builder Club at Vanderbilt.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <Section as="h1" eyebrow="Team" title="The people behind the club" intro="Students who run CBC Vanderbilt.">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </ul>
    </Section>
  );
}
