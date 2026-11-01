import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} · ${site.shortName}`;
  // A page-level openGraph object replaces the root one, so re-attach the shared image from app/opengraph-image.tsx.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }];
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: site.name, type: "website", images },
    twitter: { card: "summary_large_image", images },
  };
}
