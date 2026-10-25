
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getBookings,
  getFlights,
  type Booking,
  type Flight,
} from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

export default function DashboardPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [flightsData, bookingsData] = await Promise.all([
          getFlights(),
          getBookings(),
        ]);

        if (!cancelled) {
          setFlights(flightsData);
          setBookings(bookingsData);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadDashboard() {
    try {
      setRefreshing(true);
      setError("");

      const [flightsData, bookingsData] = await Promise.all([
        getFlights(),
        getBookings(),
      ]);

      setFlights(flightsData);
      setBookings(bookingsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh dashboard data."
      );
    } finally {
      setRefreshing(false);
    }
  }

  const activeBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() !== "cancelled"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "cancelled"
  ).length;

  const activeRevenue = activeBookings.reduce(
    (total, booking) => total + Number(booking.totalPrice || 0),
    0
  );

  const pendingPercentage =
    bookings.length > 0
      ? Math.round((pendingBookings / bookings.length) * 100)
      : 0;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const lowSeatFlights = [...flights]
    .filter((flight) => Number(flight.availableSeats) <= 5)
    .sort(
      (a, b) =>
        Number(a.availableSeats) - Number(b.availableSeats)
    )
    .slice(0, 4);

  function formatDate(value: string) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function statusStyle(status: string) {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 ring-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 ring-red-200";
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      default:
        return "bg-slate-100 text-slate-600 ring-slate-200";
    }
  }

  const stats = [
    {
      title: "Total Flights",
      value: flights.length,
      description: "Flight records in the system",
      icon: "✈",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      description: "All booking records",
      icon: "▤",
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      description: "Awaiting processing",
      icon: "◷",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Active Booking Value",
      value: formatPrice(activeRevenue),
      description: "Excludes cancelled bookings",
      icon: "$",
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Monitor flights, bookings, and business performance."
    >
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-2xl bg-[#202650] p-6 text-white sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-medium tracking-wider text-amber-300">
              BUSINESS TRAVEL MANAGEMENT
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Welcome to TravelDesk
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Track reservations, monitor seat availability, and review
              your travel operations from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-lg bg-amber-300 px-5 py-3 text-sm font-semibold text-[#171A3A] transition hover:bg-amber-200"
              >
                Search Flights
              </Link>

              <Link
                href="/my-bookings"
                className="rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Manage Bookings
              </Link>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-12 h-48 w-48 rounded-full border border-white/10" />
        </section>

        {!loading && !error && (
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#171A3A]">
                Operations Snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Current information retrieved from the API
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={refreshing}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#171A3A] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh Data"}
            </button>
          </section>
        )}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#171A3A]" />
            <p className="mt-4 text-sm text-slate-500">
              Loading dashboard data...
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-5"
          >
            <h3 className="font-semibold text-red-800">
              Unable to load dashboard
            </h3>
            <p className="mt-2 wrap-break-word text-sm text-red-700">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={refreshing}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
            >
              {refreshing ? "Retrying..." : "Try Again"}
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#171A3A]">
                  Key Statistics
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Live figures from your booking system
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${stat.color}`}
                      >
                        {stat.icon}
                      </div>
                      <span className="text-xs text-slate-400">
                        Live data
                      </span>
                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <p className="mt-1 wrap-break-word text-2xl font-bold tracking-tight text-[#171A3A] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-[#171A3A]">
                      Booking Status
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Overview of reservation processing
                    </p>
                  </div>
                  <span className="text-2xl">◷</span>
                </div>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      Pending reservations
                    </p>
                    <p className="mt-1 text-3xl font-bold text-[#171A3A]">
                      {pendingBookings}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-amber-700">
                    {pendingPercentage}% of all bookings
                  </p>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${pendingPercentage}%` }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">
                      Active bookings
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-800">
                      {activeBookings.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      Cancelled bookings
                    </p>
                    <p className="mt-1 text-2xl font-bold text-red-800">
                      {cancelledBookings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-[#171A3A]">
                      Limited Seat Availability
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Flights with five seats or fewer
                    </p>
                  </div>
                  <span className="text-2xl">⚠</span>
                </div>

                {lowSeatFlights.length === 0 ? (
                  <div className="mt-6 rounded-xl bg-emerald-50 p-5">
                    <p className="font-semibold text-emerald-800">
                      No low-seat flights
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      No flights currently meet this warning threshold.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {lowSeatFlights.map((flight) => (
                      <div
                        key={flight.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#171A3A]">
                            {flight.airline}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {flight.departureCity} → {flight.arrivalCity}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
                          {flight.availableSeats} seats
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-[#171A3A]">
                    Recent Bookings
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    The five latest reservations
                  </p>
                </div>
                <Link
                  href="/my-bookings"
                  className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  View all bookings →
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <div className="text-4xl">✈</div>
                  <h3 className="mt-3 font-semibold text-slate-800">
                    No bookings yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Reservations will appear here after a booking is created.
                  </p>
                  <Link
                    href="/"
                    className="mt-5 inline-block rounded-lg bg-[#171A3A] px-5 py-3 text-sm font-medium text-white hover:bg-[#292f60]"
                  >
                    Find a Flight
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-180 text-left">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Reference</th>
                        <th className="px-6 py-4 font-semibold">Passenger</th>
                        <th className="px-6 py-4 font-semibold">Route</th>
                        <th className="px-6 py-4 font-semibold">Booking Date</th>
                        <th className="px-6 py-4 font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <span className="font-semibold text-[#171A3A]">
                              {booking.bookingReference || `#${booking.id}`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">
                              {booking.passengerName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {booking.passengerEmail}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">
                              {booking.flight?.departureCity ?? "—"} →{" "}
                              {booking.flight?.arrivalCity ?? "—"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {booking.flight?.airline ?? "Flight details"}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {formatDate(booking.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                            {formatPrice(Number(booking.totalPrice || 0))}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyle(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#171A3A]">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Shortcuts to common travel operations
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link
                  href="/"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-700">
                    ✈
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#171A3A]">
                      Search Flights
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Find available flights and create reservations.
                    </p>
                  </div>
                  <span className="text-slate-400 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/my-bookings"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700">
                    ▤
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#171A3A]">
                      Manage Bookings
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Review reservations and check their statuses.
                    </p>
                  </div>
                  <span className="text-slate-400 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </section>
          </>
        )}

        <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          TravelDesk · Booking Management Prototype
        </footer>
      </div>
    </AdminLayout>
  );
}
