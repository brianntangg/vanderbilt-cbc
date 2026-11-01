import { AirtableEmbed } from "@/components/AirtableEmbed";
import { Button } from "@/components/Button";
import { RoleCard } from "@/components/RoleCard";
import { Section } from "@/components/Section";
import { site } from "@/content/site";
import { isBoardApplicationOpen, openPositionsLabel, openRoles } from "@/lib/board";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Join the Board",
  description: "Open board positions for the Claude Builder Club at Vanderbilt, and the application form.",
  path: "/join",
});

export default function JoinPage() {
  const open = isBoardApplicationOpen();
  // After the deadline, roles are treated as filled even if still marked open.
  const roles = open ? openRoles() : [];
  const deadline = formatDate(site.board.deadline);
  const decisionDate = formatDate(site.board.decisionDate);

  const steps = [
    `Submit the form by ${deadline}`,
    "We review applications by role",
    "Short interview with the leads",
    `Decisions by ${decisionDate}`,
  ];

  return (
    <>
      <Section
        as="h1"
        eyebrow={`Join the board · ${site.board.term}`}
        title="Help run Vanderbilt's community for building with Claude"
        intro="We host monthly meetings, hands-on workshops, campus demos, and a spring hackathon. Board members shape all of it."
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          {open && <Button href="#apply">Apply to the board</Button>}
          <span className="inline-flex items-center rounded-full border border-accent bg-accent-soft px-3 py-1.5 text-sm text-ink">
            Every board member receives Claude Pro
          </span>
          <span className="text-sm text-muted">
            {open ? `Applications close ${deadline}` : "Applications are closed"}
          </span>
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <h2 className="font-display text-[30px] font-medium leading-[1.1] tracking-[-0.015em] sm:text-[38px]">
          Open positions
        </h2>
        <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
          {openPositionsLabel(roles.length)}
        </p>

        {roles.length > 0 ? (
          <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {roles.map((role) => (
              <RoleCard key={role.title} role={role} />
            ))}
            <div className="flex flex-col rounded-xl border border-accent/40 bg-accent-soft p-6">
              <h3 className="text-[19px] font-semibold">Not sure which fits?</h3>
              <p className="mt-2 text-muted">
                Check more than one role on the form. We&apos;ll talk through fit in your interview.
              </p>
              <a
                href="#apply"
                className="mt-4 font-semibold text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
              >
                Go to the application
              </a>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-lg text-muted">All board positions are filled for this year.</p>
        )}
      </Section>

      <section id="apply" className="scroll-mt-6 border-t border-line bg-surface-2 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1160px] gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className="font-display text-[38px] font-medium leading-[1.05] tracking-[-0.015em] sm:text-[48px]">
              Apply
            </h2>
            <p className="mt-4 text-lg text-muted">
              About 5 minutes. Role-specific questions appear only for the roles you pick.
            </p>
            <ol className="mt-8 space-y-4">
              {steps.map((step, i) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-[13px] text-accent">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-muted">
              Questions? Email <span className="select-all text-ink">{site.contactEmail}</span>
            </p>
          </div>

          {open ? (
            <AirtableEmbed />
          ) : (
            <div className="self-start rounded-xl border border-line bg-surface p-8">
              <p className="text-lg">
                Board applications for {site.board.term} are closed. Join the club to hear about future openings.
              </p>
              <div className="mt-6">
                <Button href={site.memberSignupUrl}>Member Interest Form</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
