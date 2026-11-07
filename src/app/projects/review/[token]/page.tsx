import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { reviewContext } from "@/lib/projects/config";
import { loadReview } from "@/lib/projects/review";
import { approveProject, rejectProject } from "./actions";

export const metadata: Metadata = {
  title: "Review project",
  robots: { index: false, follow: false },
};

const messages = {
  invalid: "This review link is invalid.",
  expired: "This review link has expired.",
  "already-handled": "This project was already handled.",
} as const;

const outcomes: Record<string, string> = {
  approved: "Approved. The project is now live on the Projects page.",
  rejected: "Rejected. The project will not be shown.",
};

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ done?: string }>;
}) {
  const { token: rawToken } = await params;
  const { done } = await searchParams;
  const token = decodeURIComponent(rawToken);
  const review = await loadReview(token, reviewContext());

  // Only trust the ?done= message once the project is actually no longer pending.
  const outcome = review.state === "already-handled" && done ? outcomes[done] : undefined;

  return (
    <Section as="h1" eyebrow="Projects" title="Review project">
      {review.state !== "ready" ? (
        <p className="text-lg text-muted">{outcome ?? messages[review.state]}</p>
      ) : (
        <Card className="max-w-[640px]">
          <dl className="grid gap-4">
            <Field label="Title" value={review.project.title} />
            <Field label="Name" value={review.project.name} />
            <Field label="Email" value={review.project.email} />
            <Field label="Type" value={review.project.type} />
            <div>
              <dt className="font-mono text-[13px] uppercase tracking-[0.08em] text-accent">Link</dt>
              <dd className="mt-1 break-all">
                <a
                  href={review.project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2"
                >
                  {review.project.url}
                </a>
              </dd>
            </div>
            <Field label="Description" value={review.project.description} />
          </dl>
          <p className="mt-6 text-sm text-muted">Open the link and check it before approving.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <form action={approveProject.bind(null, token)}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-lg bg-ink px-5 text-[15px] font-semibold text-bg transition-colors hover:bg-ink/90"
              >
                Approve and publish
              </button>
            </form>
            <form action={rejectProject.bind(null, token)}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-lg border border-line px-5 text-[15px] font-semibold text-ink transition-colors hover:border-muted"
              >
                Reject
              </button>
            </form>
          </div>
        </Card>
      )}
    </Section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[13px] uppercase tracking-[0.08em] text-accent">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}
