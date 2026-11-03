import { describe, expect, it } from "vitest";
import { buildReviewEmail } from "./email";
import type { Project } from "./types";

const base: Project = {
  id: "id-1",
  title: "Study buddy",
  url: "https://github.com/someone/study-buddy",
  type: "GitHub",
  description: "A flashcard maker.",
  name: "Sam Student",
  email: "sam@vanderbilt.edu",
  status: "pending",
  createdAt: 1,
};
const reviewUrl = "https://vanderbilt-cbc.vercel.app/projects/review/tok.123.sig";

describe("buildReviewEmail", () => {
  it("html escapes <script> in title, name, description", () => {
    const evil = "<script>alert(1)</script>";
    const { html } = buildReviewEmail({ ...base, title: evil, name: evil, description: evil }, reviewUrl);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("text contains the review URL and the submitter email", () => {
    const { text } = buildReviewEmail(base, reviewUrl);
    expect(text).toContain(reviewUrl);
    expect(text).toContain("sam@vanderbilt.edu");
  });

  it("subject includes the title", () => {
    expect(buildReviewEmail(base, reviewUrl).subject).toBe("New student project: Study buddy");
  });

  it("link text for javascript-looking titles stays inert", () => {
    const { html } = buildReviewEmail({ ...base, title: "<img src=x onerror=alert(1)>" }, reviewUrl);
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("html contains the review button pointing at the review URL", () => {
    const { html } = buildReviewEmail(base, reviewUrl);
    expect(html).toContain(`href="${reviewUrl}"`);
    expect(html).toContain("Review and publish");
  });
});
