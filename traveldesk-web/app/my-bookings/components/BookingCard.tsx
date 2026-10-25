"use client";

import type { Booking } from "@/lib/api";

type BookingCardProps = {
  booking: Booking;
  onCancel: (id: number) => void;
  cancelling: boolean;
};

export default function BookingCard({
  booking,
  onCancel,
  cancelling,
}: BookingCardProps) {
  const status = booking.status?.toLowerCase() || "pending";

  const statusStyle =
    status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  const departureCity = booking.flight?.departureCity || "Unknown";
  const arrivalCity = booking.flight?.arrivalCity || "Unknown";

  return (
    <article className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#737386]">Booking reference</p>
          <h3 className="mt-1 font-semibold text-[#191D3A]">
            {booking.bookingReference || `Booking #${booking.id}`}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle}`}
        >
          {booking.status || "Pending"}
        </span>
      </div>

      <div className="my-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-[#737386]">Passenger</p>
          <p className="mt-1 font-medium text-[#191D3A]">
            {booking.passengerName}
          </p>
          <p className="mt-1 break-all text-sm text-[#737386]">
            {booking.passengerEmail}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#737386]">Flight route</p>
          <p className="mt-1 font-medium text-[#191D3A]">
            {departureCity} → {arrivalCity}
          </p>
          <p className="mt-1 text-sm text-[#737386]">
            {booking.numberOfPassengers} passenger(s)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EEE9E0] pt-4">
        <div>
          <p className="text-xs text-[#737386]">Total price</p>
          <p className="mt-1 text-xl font-bold text-[#191D3A]">
            ${Number(booking.totalPrice).toFixed(2)}
          </p>
        </div>

        {status !== "cancelled" && (
          <button
            type="button"
            disabled={cancelling}
            onClick={() => onCancel(booking.id)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </article>
  );
}