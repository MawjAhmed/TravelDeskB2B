"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cancelBooking, getBookings, type Booking } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

import BookingSummary from "./components/BookingSummary";
import BookingFilters, { type BookingFilter } from "./components/BookingFilters";
import BookingCard from "./components/BookingCard";
import BookingEmptyState from "./components/BookingEmptyState";

import { countBookingsByStatus, filterBookings } from "./lib/booking-utils";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchInitialBookings() {
      try {
        const data = await getBookings();

        if (isActive) {
          setBookings(data);
          setError("");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load bookings. Please try again."
          );
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void fetchInitialBookings();

    return () => {
      isActive = false;
    };
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const visibleBookings = useMemo(() => {
    const filtered = filterBookings(bookings, activeFilter);
    const query = searchTerm.trim().toLowerCase();

    if (!query) return filtered;

    return filtered.filter((booking) => {
      const reference = String(booking.bookingReference ?? "").toLowerCase();
      const passengerName = String(booking.passengerName ?? "").toLowerCase();

      return (
        reference.includes(query) ||
        passengerName.includes(query)
      );
    });
  }, [bookings, activeFilter, searchTerm]);

  const pendingCount = countBookingsByStatus(bookings, "Pending");
  const confirmedCount = countBookingsByStatus(bookings, "Confirmed");
 

  const handleCancel = useCallback(
    async (id: number) => {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this booking?"
      );

      if (!confirmed) return;

      setCancellingId(id);
      setError("");
      setMessage("");

      try {
        await cancelBooking(id);
        setMessage("Booking cancelled successfully.");
        await loadBookings();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to cancel this booking."
        );
      } finally {
        setCancellingId(null);
      }
    },
    [loadBookings]
  );

  return (
    <AdminLayout
      title="Manage Bookings"
      subtitle="View and manage your flight reservations."
    >
      <div className="space-y-8">
        <BookingSummary
          total={bookings.length}
          pending={pendingCount}
          confirmed={confirmedCount}
        />

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#191D3A]">
                Your Reservations
              </h2>
              <p className="mt-1 text-sm text-[#737386]">
                Search, filter, and manage your bookings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadBookings()}
              disabled={loading}
              className="rounded-lg border border-[#DCD5C8] bg-white px-4 py-2 text-sm font-medium text-[#191D3A] transition hover:border-[#C9AD75] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858598]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by booking reference or passenger name..."
                aria-label="Search bookings by reference or passenger name"
                className="w-full rounded-lg border border-[#DCD5C8] bg-white py-3 pl-10 pr-10 text-sm text-[#191D3A] outline-none transition placeholder:text-[#9999A8] focus:border-[#C9AD75] focus:ring-2 focus:ring-[#C9AD75]/20"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858598] transition hover:text-[#191D3A]"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>

          <BookingFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {message && (
            <p
              role="status"
              className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {message}
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
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

          {!loading && !error && (
            <p className="mt-4 text-sm text-[#737386]" aria-live="polite">
              Showing {visibleBookings.length} of {bookings.length} bookings
              {searchTerm.trim()
                ? ` matching "${searchTerm.trim()}"`
                : ""}
            </p>
          )}

          {loading ? (
            <div className="mt-6 rounded-xl border border-slate-100 bg-white p-10 text-center text-[#737386]">
              Loading your bookings...
            </div>
          ) : visibleBookings.length === 0 ? (
            <div className="mt-6">
              <BookingEmptyState
                title={
                  searchTerm.trim()
                    ? "No matching bookings"
                    : activeFilter === "All"
                      ? "No bookings yet"
                      : `No ${activeFilter.toLowerCase()} bookings`
                }
                message={
                  searchTerm.trim()
                    ? "Try another booking reference or passenger name."
                    : activeFilter === "All"
                      ? "Your flight reservations will appear here when available."
                      : "Try selecting another filter to view your bookings."
                }
              />

              {searchTerm.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-3 text-sm font-medium text-[#191D3A] underline underline-offset-4 hover:text-[#AD915B]"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5">
              {visibleBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                  cancelling={cancellingId === booking.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}