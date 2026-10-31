import Image from "next/image";
import type { TeamMember } from "@/content/team";
import { Card } from "./Card";
import { GitHubIcon, LinkedInIcon } from "./icons";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card as="li">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={`Photo of ${member.name}`}
          width={72}
          height={72}
          className="size-[72px] rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex size-[72px] items-center justify-center rounded-full border border-line bg-surface-2 font-display text-2xl text-ink"
        >
          {initials(member.name)}
        </div>
      )}
      <h3 className="mt-5 text-[19px] font-semibold">{member.name}</h3>
      <p className="mt-1 font-mono text-[13px] uppercase tracking-[0.06em] text-accent">{member.role}</p>
      {member.bio && <p className="mt-3 text-muted">{member.bio}</p>}
      {(member.linkedin || member.github) && (
        <div className="mt-4 flex gap-2">
          {member.linkedin && (
            <ProfileLink href={member.linkedin} label={`${member.name} on LinkedIn`} icon={<LinkedInIcon />} />
          )}
          {member.github && (
            <ProfileLink href={member.github} label={`${member.name} on GitHub`} icon={<GitHubIcon />} />
          )}
        </div>
      )}
    </Card>
  );
}

function ProfileLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-muted hover:text-ink"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
}
