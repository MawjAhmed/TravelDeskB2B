"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  cancelBooking,
  getBookings,
  type Booking,
} from "@/lib/api";

type StatusFilter = "All" | "Pending" | "Confirmed" | "Cancelled";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getBookings();
      setBookings(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
  
    async function fetchBookings() {
      try {
        const result = await getBookings();
  
        if (active) {
          setBookings(result);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load bookings."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
  
    void fetchBookings();
  
    return () => {
      active = false;
    };
  }, []);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const visibleBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      const matchesSearch =
        !query ||
        String(booking.bookingReference ?? "").toLowerCase().includes(query) ||
        String(booking.passengerName ?? "").toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchTerm, statusFilter]);

  async function handleCancel(booking: Booking) {
    if (booking.status === "Cancelled") return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.bookingReference}?`
    );

    if (!confirmed) return;

    setCancellingId(booking.id);
    setError("");
    setMessage("");

    try {
      await cancelBooking(booking.id);

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id
            ? { ...item, status: "Cancelled" }
            : item
        )
      );

      setMessage(
        `Booking ${booking.bookingReference} has been cancelled successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to cancel this booking."
      );
    } finally {
      setCancellingId(null);
    }
  }

  const statusOptions: StatusFilter[] = [
    "All",
    "Pending",
    "Confirmed",
    "Cancelled",
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ad915b]">
          TravelDesk · Booking Operations
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#191d3a] sm:text-4xl">
          Booking Management
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Review reservations, search bookings, and manage cancellations.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e4ded2] bg-white p-5">
          <p className="text-sm text-gray-500">Total bookings</p>
          <p className="mt-2 text-3xl font-semibold text-[#191d3a]">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#e4ded2] bg-white p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-[#191d3a]">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#e4ded2] bg-white p-5">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="mt-2 text-3xl font-semibold text-[#191d3a]">
            {cancelledCount}
          </p>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadBookings()}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#e4ded2] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4ded2] px-5 py-4">
          <h2 className="font-semibold text-[#191d3a]">Reservations</h2>

          <button
            type="button"
            onClick={() => void loadBookings()}
            disabled={loading}
            className="rounded-lg border border-[#d8c8a6] px-4 py-2 text-sm font-medium text-[#191d3a] transition hover:bg-[#f7f5f0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="space-y-4 border-b border-[#e4ded2] p-5">
          <div className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by booking reference or passenger name..."
              aria-label="Search bookings"
              className="w-full rounded-lg border border-[#e4ded2] py-3 pl-10 pr-10 text-sm text-[#191d3a] outline-none transition focus:border-[#c9ad75] focus:ring-2 focus:ring-[#c9ad75]/20"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#191d3a]"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  statusFilter === status
                    ? "border-[#191d3a] bg-[#191d3a] text-white"
                    : "border-[#e4ded2] bg-white text-gray-600 hover:border-[#c9ad75]"
                }`}
              >
                {status}
                {status === "All"
                  ? ` (${bookings.length})`
                  : status === "Pending"
                    ? ` (${pendingCount})`
                    : status === "Cancelled"
                      ? ` (${cancelledCount})`
                      : ` (${bookings.filter((booking) => booking.status === status).length})`}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500" aria-live="polite">
            Showing {visibleBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading bookings...
          </div>
        ) : visibleBookings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-[#191d3a]">
              {bookings.length === 0
                ? "No bookings found."
                : "No matching bookings."}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Try another search term or status filter.
            </p>
            {(searchTerm || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-[#ad915b] underline underline-offset-4"
              >
                Clear search and filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#eee8dc]">
            {visibleBookings.map((booking) => (
              <article
                key={booking.id}
                className="p-5 transition hover:bg-[#fcfbf8] sm:p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="break-all font-semibold text-[#191d3a]">
                        {booking.bookingReference}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "Cancelled"
                            ? "bg-red-50 text-red-700"
                            : booking.status === "Pending"
                              ? "bg-amber-50 text-amber-800"
                              : booking.status === "Confirmed"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-3 font-medium text-[#191d3a]">
                      {booking.passengerName}
                    </p>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {booking.passengerEmail}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <span>{booking.flight?.airline ?? "Flight"}</span>

                      <span>
                        {booking.flight
                          ? `${booking.flight.departureCity} → ${booking.flight.arrivalCity}`
                          : `Flight ID: ${booking.flightId}`}
                      </span>

                      <span>Passengers: {booking.numberOfPassengers}</span>
                    </div>

                    {booking.createdAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        Created:{" "}
                        {new Date(booking.createdAt).toLocaleString("en-GB")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-between gap-4 border-t border-[#eee8dc] pt-4 lg:min-w-44 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                    <div className="lg:text-right">
                      <p className="text-xs text-gray-500">Total price</p>
                      <p className="mt-1 text-xl font-semibold text-[#191d3a]">
                        {booking.totalPrice.toLocaleString("en-US")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleCancel(booking)}
                      disabled={
                        booking.status === "Cancelled" ||
                        cancellingId === booking.id
                      }
                      className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {cancellingId === booking.id
                        ? "Cancelling..."
                        : booking.status === "Cancelled"
                          ? "Cancelled"
                          : "Cancel Booking"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}