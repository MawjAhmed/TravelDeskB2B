"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "▦",
  },
  {
    label: "Search Flights",
    href: "/",
    icon: "✈",
  },
  {
    label: "Manage Bookings",
    href: "/my-bookings",
    icon: "▤",
  },
];

export default function AdminLayout({
  children,
  title,
  subtitle = "TravelDesk Management Workspace",
}: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col bg-[#171A3A] text-white md:min-h-screen md:w-64">
        <div className="border-b border-white/10 px-6 py-7">
          <Link
            href="/dashboard"
            className="text-2xl font-bold tracking-wide"
          >
            Travel<span className="text-amber-300">Desk</span>
          </Link>

          <p className="mt-2 text-xs tracking-[0.18em] text-slate-400">
            TRAVEL MANAGEMENT
          </p>
        </div>

        <div className="px-4 py-5 md:py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <nav
            aria-label="Admin navigation"
            className="flex gap-2 overflow-x-auto md:flex-col"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden border-t border-white/10 p-5 md:block">
          <p className="text-sm font-medium">TravelDesk Prototype</p>
          <p className="mt-1 text-xs text-slate-400">
            Booking management workspace
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm text-slate-500">
              Workspace / {title}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#171A3A] sm:text-3xl">
              {title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171A3A] text-sm font-bold text-white">
              TD
            </span>

            <div>
              <p className="text-sm font-semibold">TravelDesk</p>
              <p className="text-xs text-slate-500">
                Management Panel
              </p>
            </div>
          </div>
        </header>

        <main className="min-w-0 p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}