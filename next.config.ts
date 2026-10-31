import type { NextConfig } from "next";

// Security headers for every page. Vercel already adds HSTS.
// If you embed something new in an iframe, add its domain to frame-src.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-src https://airtable.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Stop `next dev` from writing an AGENTS.md file into the repo.
  agentRules: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
