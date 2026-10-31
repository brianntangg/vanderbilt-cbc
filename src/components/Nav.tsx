"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

const links = [
  { href: "/", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/slides", label: "Slides" },
  { href: "/links", label: "Links" },
];

export function Nav({ boardOpen }: { boardOpen: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className="border-b border-line">
      <nav aria-label="Main" className="mx-auto flex max-w-[1160px] items-center justify-between gap-6 px-6 py-4">
        <Link href="/" onClick={close} className="flex items-center gap-2.5">
          <Image src="/brand/claude-symbol.svg" alt="Claude logo" width={24} height={24} unoptimized />
          <span className="whitespace-nowrap font-semibold">Claude Builder Club</span>
          <span className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[11px] tracking-[0.08em] text-muted min-[420px]:inline">
            VANDERBILT
          </span>
        </Link>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
        </button>

        <ul
          id="main-menu"
          className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-0 top-[65px] z-20 flex-col gap-1 border-b border-line bg-bg px-6 pb-6 pt-2 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:p-0`}
        >
          {links.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`block border-b-2 py-2 text-[15px] transition-colors md:py-1 ${
                    active ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          {boardOpen && (
            <li className="mt-2 md:mt-0">
              <Link
                href="/join"
                onClick={close}
                aria-current={pathname === "/join" ? "page" : undefined}
                className="inline-flex min-h-9 items-center rounded-lg border border-accent px-3 text-[15px] font-medium text-accent transition-colors hover:bg-accent-soft"
              >
                Join the Board
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
