
"use client";

import { useState } from "react";
import {
  createBooking,
  type Flight,
  type BookingResponse,
} from "@/lib/api";

interface BookingFormProps {
  flight: Flight;
  onClose: () => void;
}

export default function BookingForm({
  flight,
  onClose,
}: BookingFormProps) {
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<BookingResponse | null>(null);

  const totalPrice = flight.price * numberOfPassengers;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (numberOfPassengers > flight.availableSeats) {
      setError("عدد المسافرين أكبر من المقاعد المتاحة.");
      return;
    }

    setLoading(true);

    try {
      const result = await createBooking({
        flightId: flight.id,
        passengerName: passengerName.trim(),
        passengerEmail: passengerEmail.trim(),
        numberOfPassengers,
      });

      setBooking(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر إتمام الحجز. حاولي مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-[#E5DFD2] bg-[#F7F5F0] p-6 text-[#191D3A] shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A58A55]">
              TravelDesk
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              {booking ? "Booking Confirmed" : "Book Your Flight"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking form"
            className="rounded-full px-3 py-1 text-2xl text-[#777] transition hover:bg-[#EAE5DA]"
          >
            ×
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-[#E5DFD2] bg-white p-4">
          <p className="text-sm text-gray-500">{flight.airline}</p>
          <p className="mt-2 text-lg font-semibold">
            {flight.departureCity} → {flight.arrivalCity}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">Available seats</span>
            <span>{flight.availableSeats}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-500">Price per passenger</span>
            <span className="font-semibold">
              {flight.price.toLocaleString()} {flight.currency}
            </span>
          </div>
        </div>

        {booking ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-800">
                Booking created successfully.
              </p>
              <p className="mt-3 text-sm text-green-900">
                Booking reference
              </p>
              <p className="mt-1 break-all text-xl font-bold text-green-900">
                {booking.bookingReference}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span>Total price</span>
                <span className="font-bold">
                  {booking.totalPrice.toLocaleString()} {flight.currency}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span>Status</span>
                <span className="font-semibold">{booking.status}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-[#191D3A] px-5 py-3 font-semibold text-white transition hover:bg-[#292F56]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passengerName"
                className="mb-2 block text-sm font-medium"
              >
                Passenger full name
              </label>
              <input
                id="passengerName"
                type="text"
                autoComplete="name"
                required
                maxLength={150}
                value={passengerName}
                onChange={(event) => setPassengerName(event.target.value)}
                placeholder="Enter passenger name"
                className="w-full rounded-xl border border-[#DDD5C6] bg-white px-4 py-3 outline-none transition focus:border-[#A58A55] focus:ring-2 focus:ring-[#C9AD75]/20"
              />
            </div>

            <div>
              <label
                htmlFor="passengerEmail"
                className="mb-2 block text-sm font-medium"
              >
                Passenger email
              </label>
              <input
                id="passengerEmail"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={passengerEmail}
                onChange={(event) => setPassengerEmail(event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[#DDD5C6] bg-white px-4 py-3 outline-none transition focus:border-[#A58A55] focus:ring-2 focus:ring-[#C9AD75]/20"
              />
            </div>

            <div>
              <label
                htmlFor="numberOfPassengers"
                className="mb-2 block text-sm font-medium"
              >
                Number of passengers
              </label>
              <input
                id="numberOfPassengers"
                type="number"
                min={1}
                max={Math.max(1, flight.availableSeats)}
                required
                value={numberOfPassengers}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  if (Number.isInteger(value) && value >= 1) {
                    setNumberOfPassengers(value);
                  }
                }}
                className="w-full rounded-xl border border-[#DDD5C6] bg-white px-4 py-3 outline-none transition focus:border-[#A58A55] focus:ring-2 focus:ring-[#C9AD75]/20"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#DDD5C6] pt-4">
              <span className="text-sm text-gray-600">Estimated total</span>
              <span className="text-xl font-bold">
                {totalPrice.toLocaleString()} {flight.currency}
              </span>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                flight.availableSeats < 1 ||
                numberOfPassengers > flight.availableSeats
              }
              className="w-full rounded-xl bg-[#191D3A] px-5 py-3 font-semibold text-white transition hover:bg-[#292F56] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
