
"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="dubai-hero relative isolate overflow-hidden"
    >
      <div className="hero-image absolute inset-0 -z-20" />
      <div className="hero-overlay absolute inset-0 -z-10" />

      <div className="hero-grid absolute inset-0 -z-10" />

      <div className="mx-auto flex min-h-162.5 max-w-7xl items-center px-6 py-24 sm:px-10 lg:min-h-180">
        <div className="hero-content max-w-3xl">
          <div className="hero-reveal inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#d5ba80] shadow-[0_0_12px_#d5ba80]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#e5d2a8] sm:text-xs">
              DUBAILAND · Travel & Technology
            </span>
          </div>

          <h1 className="hero-title hero-reveal mt-8 text-5xl font-light leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-8xl">
            The world,
            <br />
            <span className="font-semibold">within your</span>
            <br />
            <span className="hero-gold italic">reach.</span>
          </h1>

          <p className="hero-reveal mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Thoughtfully connected journeys. Seamless travel solutions.
            A world of possibilities, brought closer to you.
          </p>

          <div className="hero-reveal mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#flight-search"
              className="group inline-flex items-center gap-4 rounded-sm bg-[#c9ad75] px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#171a36] transition duration-300 hover:bg-[#e0ca9b] hover:shadow-[0_8px_35px_rgba(201,173,117,0.22)]"
            >
              Explore your journey
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#why-dubailand"
              className="inline-flex items-center gap-3 px-3 py-4 text-xs uppercase tracking-[0.16em] text-white/80 transition hover:text-[#e5d2a8]"
            >
              Discover our approach
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="hero-reveal mt-16 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/20 pt-7">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Designed around you
              </p>
              <p className="mt-2 text-sm text-white/90">
                Travel with purpose
              </p>
            </div>

            <div className="hidden h-10 w-px bg-white/20 sm:block" />

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Connected solutions
              </p>
              <p className="mt-2 text-sm text-white/90">
                One journey, less friction
              </p>
            </div>
          </div>
        </div>

        <div className="hero-orbit absolute right-[8%] top-[22%] hidden h-64 w-64 rounded-full border border-white/15 xl:block">
          <div className="absolute -right-2 top-1/2 h-3 w-3 rounded-full bg-[#d5ba80] shadow-[0_0_24px_#d5ba80]" />
          <div className="absolute inset-6 rounded-full border border-white/10" />
          <div className="absolute inset-12 rounded-full border border-dashed border-[#d5ba80]/30" />
        </div>

        <div className="absolute bottom-8 right-8 hidden items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-white/50 lg:flex">
          <span>Travel beyond boundaries</span>
          <span className="h-px w-12 bg-[#c9ad75]" />
          <span>01 / 03</span>
        </div>
      </div>
    </section>
  );
}
