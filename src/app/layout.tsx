import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { Banner } from "@/components/Banner";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/content/site";
import { isBoardApplicationOpen } from "@/lib/board";
import "./globals.css";

// Pages are static but re-render hourly, so date-based content (upcoming events,
// the board banner) updates on its own without a new deploy.
export const revalidate = 3600;

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", weight: ["400", "500"] });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.tagline,
  openGraph: { title: site.name, description: site.tagline, url: "/", siteName: site.name, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const boardOpen = isBoardApplicationOpen();
  return (
    <html lang="en" className={`${newsreader.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-ink px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {boardOpen && <Banner />}
        <div className="relative">
          <Nav boardOpen={boardOpen} />
        </div>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
