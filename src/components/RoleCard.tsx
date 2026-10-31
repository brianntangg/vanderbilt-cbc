import type { Role } from "@/content/roles";
import { Card } from "./Card";
import { Pill } from "./Pill";

export function RoleCard({ role }: { role: Role }) {
  return (
    <Card as="article">
      <Pill>Open</Pill>
      <h3 className="mt-4 text-[19px] font-semibold">{role.title}</h3>
      <p className="mt-2 text-muted">{role.summary}</p>
      <ul className="mt-4 space-y-2 text-[15px] text-muted">
        {role.duties.map((duty) => (
          <li key={duty} className="flex gap-3">
            <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent" />
            <span>{duty}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
