import type { Project } from "./types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildReviewEmail(project: Project, reviewUrl: string): { subject: string; text: string; html: string } {
  const subject = `New student project: ${project.title}`;

  const text = [
    "A student submitted a project for the Projects page.",
    "",
    `Title: ${project.title}`,
    `Name: ${project.name}`,
    `Email: ${project.email}`,
    `Type: ${project.type}`,
    `Link: ${project.url}`,
    `Description: ${project.description}`,
    "",
    "Open the link in the project, then review and publish it here:",
    reviewUrl,
  ].join("\n");

  const rows = [
    ["Title", project.title],
    ["Name", project.name],
    ["Email", project.email],
    ["Type", project.type],
    ["Link", project.url],
    ["Description", project.description],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111">
<p>A student submitted a project for the Projects page.</p>
<table style="border-collapse:collapse">${rows}</table>
<p style="margin-top:20px"><a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#d97757;color:#fff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:8px">Review and publish</a></p>
<p style="color:#666;font-size:13px">Check the project link first. The next page asks you to approve or reject.</p>
</div>`;

  return { subject, text, html };
}
