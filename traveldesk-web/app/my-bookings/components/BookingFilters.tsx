"use client";

export type BookingFilter =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Cancelled";

type BookingFiltersProps = {
  activeFilter: BookingFilter;
  onFilterChange: (filter: BookingFilter) => void;
};

const filters: BookingFilter[] = [
  "All",
  "Pending",
  "Confirmed",
  "Cancelled",
];

export default function BookingFilters({
  activeFilter,
  onFilterChange,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-[#191D3A] bg-[#191D3A] text-white"
                : "border-[#E8E1D5] bg-white text-[#191D3A] hover:border-[#C9AD75]"
            }`}
          >
            {filter === "All" ? "All Bookings" : filter}
          </button>
        );
      })}
    </div>
  );
}