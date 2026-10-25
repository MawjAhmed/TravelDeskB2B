"use client";

import { useState } from "react";
import BrandMark from "./BrandMark";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Corporate", href: "#corporate" },
  { label: "Contact", href: "#contact" },
];

const navLinkStyle =
  "whitespace-nowrap text-sm font-semibold text-white transition-colors duration-200 hover:text-[#f0dfb7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0dfb7]";

const mobileLinkStyle =
  "block border-b border-white/15 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#252a4b] hover:text-[#f0dfb7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0dfb7]";

const bookingsLinkStyle =
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-[#d6bb83] bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-[#f0dfb7] hover:bg-[#f0dfb7] hover:text-[#171a36] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0dfb7]";

const dashboardLinkStyle =
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-[#d6bb83] bg-[#252a4b] px-4 py-3 text-sm font-semibold text-[#f0dfb7] transition-all duration-200 hover:bg-[#f0dfb7] hover:text-[#171a36] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0dfb7]";

const bookingButtonStyle =
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-md border border-[#f0dfb7] bg-[#c9ad75] px-4 py-3 text-xs font-bold tracking-wide text-[#171a36] transition-all duration-200 hover:border-white hover:bg-[#f0dfb7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0dfb7]";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-[#d6bb83]/60 bg-[#171a36] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-5 lg:px-10">
        <a
          href="#home"
          aria-label="DUBAILAND Home"
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0dfb7]"
        >
          <BrandMark />
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-5 xl:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={navLinkStyle}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a href="/dashboard" className={dashboardLinkStyle}>
            Dashboard
          </a>

          <a href="/my-bookings" className={bookingsLinkStyle}>
            My Bookings
          </a>

          <a href="#flight-search" className={bookingButtonStyle}>
            BOOK YOUR TRIP
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#d6bb83] text-2xl font-bold text-white transition-colors hover:bg-[#252a4b] hover:text-[#f0dfb7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0dfb7] lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#d6bb83]/50 bg-[#171a36] px-6 py-4 lg:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={mobileLinkStyle}
            >
              {link.label}
            </a>
          ))}

          <a
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`${dashboardLinkStyle} mt-4 flex w-full`}
          >
            Dashboard
          </a>

          <a
            href="/my-bookings"
            onClick={() => setMenuOpen(false)}
            className={`${bookingsLinkStyle} mt-3 flex w-full`}
          >
            My Bookings
          </a>

          <a
            href="#flight-search"
            onClick={() => setMenuOpen(false)}
            className={`${bookingButtonStyle} mt-3 flex w-full`}
          >
            BOOK YOUR TRIP
          </a>
        </nav>
      )}
    </header>
  );
}