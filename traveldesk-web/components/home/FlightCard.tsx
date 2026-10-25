
"use client";

import { useState } from "react";
import type { Flight } from "@/lib/api";
import BookingForm from "@/components/home/BookingForm";

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <article className="rounded-xl border border-[#e4ded2] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#ad915b]">
              {flight.airline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div>
                <p className="text-xl font-semibold text-[#191d3a]">
                  {formatTime(departure)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {flight.departureCity}
                </p>
              </div>

              <div className="px-2 text-center text-gray-400">
                <span aria-hidden="true">────→</span>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#191d3a]">
                  {formatTime(arrival)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {flight.arrivalCity}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-semibold text-[#191d3a]">
              {flight.price.toLocaleString("en-US")}{" "}
              <span className="text-sm">{flight.currency}</span>
            </p>

            <p className="mt-2 text-xs text-gray-500">
              {flight.availableSeats} seats available
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#eee8dc] pt-4">
          <button
            type="button"
            onClick={() => setIsBookingOpen(true)}
            disabled={flight.availableSeats < 1}
            className="w-full rounded-lg bg-[#191d3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292f56] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {flight.availableSeats < 1 ? "Sold Out" : "Book Flight"}
          </button>
        </div>
      </article>

      {isBookingOpen && (
        <BookingForm
          flight={flight}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </>
  );
}
