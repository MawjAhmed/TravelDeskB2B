import type { Booking } from "@/lib/api";

export type BookingFilter =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Cancelled";

export function filterBookings(
  bookings: Booking[],
  filter: BookingFilter
): Booking[] {
  if (filter === "All") {
    return bookings;
  }

  return bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === filter.toLowerCase()
  );
}

export function countBookingsByStatus(
  bookings: Booking[],
  status: "Pending" | "Confirmed"
): number {
  return bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === status.toLowerCase()
  ).length;
}

export function formatBookingDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}