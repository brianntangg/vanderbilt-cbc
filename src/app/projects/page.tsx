import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { SubmitProject } from "@/components/SubmitProject";
import { pageMetadata } from "@/lib/metadata";
import { getStore } from "@/lib/projects/store";
import type { PublicProject } from "@/lib/projects/types";

export const metadata = pageMetadata({
  title: "Projects",
  description: "Projects built by Claude Builder Club members at Vanderbilt.",
  path: "/projects",
});

// Cached for an hour to stay inside Airtable's free API allowance. Approving a project refreshes it at once.
export const revalidate = 3600;

async function loadProjects(): Promise<PublicProject[]> {
  try {
    return await getStore().listApproved();
  } catch (error) {
    // A storage problem should leave the page up, with just the banner and button.
    console.error("[projects] could not load approved projects", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await loadProjects();

  return (
    <>
      <Section as="h1" eyebrow="Projects" title="Student projects" intro="Projects our club members have made.">
        <SubmitProject />
      </Section>

      {projects.length > 0 && (
        <Section className="pt-0 sm:pt-0">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
