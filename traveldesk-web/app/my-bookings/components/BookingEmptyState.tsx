type BookingEmptyStateProps = {
    title?: string;
    message?: string;
  };
  
  export default function BookingEmptyState({
    title = "No bookings found",
    message = "Your bookings will appear here when you make a reservation.",
  }: BookingEmptyStateProps) {
    return (
      <div className="rounded-2xl border border-dashed border-[#DCD5C8] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F5F0] text-2xl">
          ✈
        </div>
  
        <h3 className="mt-4 text-lg font-semibold text-[#191D3A]">
          {title}
        </h3>
  
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#737386]">
          {message}
        </p>
      </div>
    );
  }