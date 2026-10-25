
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FlightSearch from "@/components/home/FlightSearch";

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f5f0]">
        <Hero />

        <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 pb-20 sm:px-8">
          <FlightSearch />
        </section>

        <section
          id="why-dubailand"
          className="mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-10"
        >
          <div className="grid gap-8 border-t border-[#ded7ca] pt-8 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#ad915b]">
                01 / Thoughtful travel
              </p>
              <h2 className="mt-3 text-xl font-medium text-[#191d3a]">
                Every journey starts with you.
              </h2>
            </div>

            <p className="text-sm leading-7 text-gray-600">
              From flight reservations to hotels and ground transportation,
              bring your travel arrangements together through one connected
              travel partner.
            </p>

            <p className="text-sm leading-7 text-gray-600">
              A considered approach to travel, supported by technology and
              designed to make planning your next journey simpler.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
