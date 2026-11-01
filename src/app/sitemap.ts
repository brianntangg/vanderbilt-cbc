import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const paths = ["/", "/team", "/events", "/hackathon", "/join", "/slides", "/links"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: path === "/events" || path === "/hackathon" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
