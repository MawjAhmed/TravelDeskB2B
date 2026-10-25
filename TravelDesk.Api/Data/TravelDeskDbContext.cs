
using Microsoft.EntityFrameworkCore;

namespace TravelDesk.Api.Data;

public class TravelDeskDbContext : DbContext
{
    public TravelDeskDbContext(
        DbContextOptions<TravelDeskDbContext> options)
        : base(options)
    {
    }

    public DbSet<Flight> Flights => Set<Flight>();

    public DbSet<Booking> Bookings => Set<Booking>();
}
