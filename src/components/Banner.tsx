import Link from "next/link";
import { site } from "@/content/site";
import { openPositionsLabel } from "@/lib/board";
import { formatDate } from "@/lib/dates";

export function Banner() {
  return (
    <Link
      href="/join"
      className="block bg-accent-soft px-6 py-2 text-center text-sm text-ink transition-colors hover:bg-accent/20"
    >
      Join the CBC board: {openPositionsLabel()}. Apply by {formatDate(site.board.deadline)}.
      <span aria-hidden="true" className="ml-1 text-accent">
        &rarr;
      </span>
    </Link>
  );
}
