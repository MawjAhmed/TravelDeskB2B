import BrandMark from "./BrandMark";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#171a36] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-3">
          <div>
            <a href="#home" aria-label="DUBAILAND Home">
              <BrandMark />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              Thoughtful travel solutions, designed around your journey.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xs tracking-[0.2em] text-[#c9ad75]">
              QUICK LINKS
            </h3>
            <nav className="flex flex-col items-start gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/65 transition hover:text-[#c9ad75]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-5 text-xs tracking-[0.2em] text-[#c9ad75]">
              GET IN TOUCH
            </h3>
            <p className="text-sm leading-7 text-white/65">
              DUBAILAND TRAVEL & TOURISM
            </p>
            <a
              href="#contact"
              className="mt-4 inline-block text-sm text-[#c9ad75] transition hover:text-white"
            >
              Contact our team →
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 DUBAILAND TRAVEL & TOURISM.</p>
        <p>Developed by Mawj Ahmed</p>
          <p>Every journey begins with a better plan.</p>
        </div>
      </div>
    </footer>
  );
}