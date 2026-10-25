
type BookingSummaryProps = {
  total: number;
  pending: number;
  confirmed: number;
};

export default function BookingSummary({
  total,
  pending,
  confirmed,
}: BookingSummaryProps) {
  const summaries = [
    { title: "Total Bookings", value: total },
    { title: "Pending Bookings", value: pending },
    { title: "Confirmed Bookings", value: confirmed },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {summaries.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-[#E8E1D5] bg-white p-6"
        >
          <p className="text-sm text-[#737386]">{item.title}</p>

          <p className="mt-4 text-3xl font-semibold text-[#191D3A]">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
