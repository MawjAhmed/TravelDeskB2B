
using Microsoft.EntityFrameworkCore;
using TravelDesk.Api.Data;

namespace TravelDesk.Api.Endpoints;

public static class FlightEndpoints
{
    public static void MapFlightEndpoints(this WebApplication app)
    {
        // Get all flights
        app.MapGet("/api/flights", async (TravelDeskDbContext db) =>
        {
            var flights = await db.Flights
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            return Results.Ok(flights);
        });

        // Search flights by departure, arrival, and date
        app.MapGet("/api/flights/search", async (
            string? departureCity,
            string? arrivalCity,
            DateOnly? departureDate,
            TravelDeskDbContext db) =>
        {
            if (string.IsNullOrWhiteSpace(departureCity))
            {
                return Results.BadRequest(new
                {
                    message = "Departure city is required."
                });
            }

            if (string.IsNullOrWhiteSpace(arrivalCity))
            {
                return Results.BadRequest(new
                {
                    message = "Arrival city is required."
                });
            }

            if (departureDate is null)
            {
                return Results.BadRequest(new
                {
                    message = "Departure date is required in YYYY-MM-DD format."
                });
            }

            var startDate = departureDate.Value.ToDateTime(TimeOnly.MinValue);
            var endDate = startDate.AddDays(1);

            var flights = await db.Flights
                .Where(f =>
                    f.DepartureCity == departureCity.Trim() &&
                    f.ArrivalCity == arrivalCity.Trim() &&
                    f.DepartureTime >= startDate &&
                    f.DepartureTime < endDate)
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            return Results.Ok(flights);
        });
    }
}
