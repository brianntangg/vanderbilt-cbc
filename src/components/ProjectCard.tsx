import { Card } from "./Card";
import { ExternalLinkIcon } from "./icons";
import { Pill } from "./Pill";
import type { PublicProject } from "@/lib/projects/types";

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <Card as="li" className="flex flex-col">
      <div>
        <Pill>{project.type}</Pill>
      </div>
      <h3 className="mt-3 text-[19px] font-semibold break-words">{project.title}</h3>
      <p className="mt-2 text-muted break-words">{project.description}</p>
      <p className="mt-4 text-sm text-subtle">by {project.name}</p>
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 pt-1 text-[15px] font-medium text-accent hover:text-accent-hover"
      >
        View project
        <ExternalLinkIcon />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </Card>
  );
}
