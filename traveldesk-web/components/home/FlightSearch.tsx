
"use client";

import { useState } from "react";
import { searchFlights, type Flight } from "@/lib/api";
import FlightCard from "@/components/home/FlightCard";

const cities = [
  "Erbil",
  "Baghdad",
  "Istanbul",
  "Ankara",
  "Antalya",
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Doha",
  "Riyadh",
  "Jeddah",
  "Cairo",
  "Amman",
  "Beirut",
  "Kuwait City",
  "Tehran",
  "Tbilisi",
  "Baku",
  "London",
  "Paris",
  "Frankfurt",
  "Rome",
  "Vienna",
  "New York",
  "Toronto",
  "Bangkok",
  "Kuala Lumpur",
];

type CityAutocompleteProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function CityAutocomplete({
  label,
  value,
  placeholder,
  onChange,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = cities
    .filter((city) => city.toLowerCase().includes(value.trim().toLowerCase()))
    .slice(0, 6);

  return (
    <div className="relative">
      <label className="text-sm font-medium">
        {label}

        <input
          required
          autoComplete="off"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && value.trim().length > 0 && suggestions.length > 0}
          className="mt-2 w-full rounded-lg border border-[#ded7ca] bg-white px-3 py-3 outline-none transition focus:border-[#ad915b] focus:ring-2 focus:ring-[#c9ad75]/20"
        />
      </label>

      {isOpen && value.trim().length > 0 && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#e8e1d5] bg-white py-2 shadow-xl"
        >
          {suggestions.map((city) => (
            <li key={city} role="option" aria-selected={city === value}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(city);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#191d3a] transition hover:bg-[#f7f5f0]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f7f5f0] text-[#ad915b]">
                  ✈
                </span>
                <span>{city}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FlightSearch() {
  const [departureCity, setDepartureCity] = useState("Erbil");
  const [arrivalCity, setArrivalCity] = useState("Istanbul");
  const [departureDate, setDepartureDate] = useState("2026-11-10");

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setFlights([]);

    try {
      const results = await searchFlights({
        departureCity,
        arrivalCity,
        departureDate,
      });

      setFlights(results);

      if (results.length === 0) {
        setError("No flights found for your search.");
      }
    } catch {
      setError(
        "Unable to load flights. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="flight-search"
      className="w-full rounded-2xl border border-[#e8e1d5] bg-[#f7f5f0] p-6 text-[#191d3a] shadow-sm sm:p-8"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ad915b]">
          DUBAILAND TRAVEL & TOURISM
        </p>

        <h2 className="mt-2 text-2xl font-semibold">Find Your Flight</h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Search available flights for your next journey.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <CityAutocomplete
          label="From"
          value={departureCity}
          onChange={setDepartureCity}
          placeholder="Departure city"
        />

        <CityAutocomplete
          label="To"
          value={arrivalCity}
          onChange={setArrivalCity}
          placeholder="Arrival city"
        />

        <label className="text-sm font-medium">
          Departure date
          <input
            required
            type="date"
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#ded7ca] bg-white px-3 py-3 outline-none transition focus:border-[#ad915b] focus:ring-2 focus:ring-[#c9ad75]/20"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#191d3a] px-5 py-3 font-semibold text-white transition hover:bg-[#292f58] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9ad75] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </form>

      {loading && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-[#e8e1d5] bg-white p-5 text-sm text-gray-600"
        >
          Searching available flights...
        </div>
      )}

      {!loading && error && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-[#e8e1d5] bg-white p-5 text-sm text-gray-700"
        >
          {error}
        </div>
      )}

      {!loading && flights.length > 0 && (
        <div className="mt-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#e4ded2] pb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#191d3a]">
                Available Flights
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {departureCity} → {arrivalCity}
              </p>
            </div>

            <span className="rounded-full border border-[#d9c9a6] bg-white px-3 py-1.5 text-xs font-semibold text-[#8d7445]">
              {flights.length} {flights.length === 1 ? "flight" : "flights"}
            </span>
          </div>

          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
