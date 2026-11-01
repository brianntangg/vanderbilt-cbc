import Image from "next/image";
import type { TeamMember } from "@/content/team";
import { GitHubIcon, LinkedInIcon } from "./icons";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarClass =
  "size-24 rounded-full ring-2 ring-line transition-shadow group-hover:ring-accent/50 sm:size-32";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <li className="group flex flex-col items-center rounded-xl border border-line bg-surface p-6 text-center transition-colors hover:border-accent/40 sm:p-8">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={`Photo of ${member.name}`}
          width={128}
          height={128}
          className={`${avatarClass} object-cover`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`${avatarClass} flex items-center justify-center bg-surface-2 font-display text-3xl text-ink sm:text-4xl`}
        >
          {initials(member.name)}
        </div>
      )}
      <h3 className="mt-5 text-[19px] font-semibold">{member.name}</h3>
      <p className="mt-1 font-mono text-[13px] uppercase tracking-[0.06em] text-accent">{member.role}</p>
      {member.bio && <p className="mt-3 text-[15px] text-muted">{member.bio}</p>}
      {(member.linkedin || member.github) && (
        <div className="mt-auto flex justify-center gap-2 pt-5">
          {member.linkedin && (
            <ProfileLink href={member.linkedin} label={`${member.name} on LinkedIn`} icon={<LinkedInIcon />} />
          )}
          {member.github && (
            <ProfileLink href={member.github} label={`${member.name} on GitHub`} icon={<GitHubIcon />} />
          )}
        </div>
      )}
    </li>
  );
}

function ProfileLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-10 items-center justify-center rounded-full bg-surface-2 text-muted transition-colors hover:bg-accent-soft hover:text-accent"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  );
}
