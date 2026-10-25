
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using TravelDesk.Api.Data;
using TravelDesk.Api.DTOs;

namespace TravelDesk.Api.Endpoints;

public static class BookingEndpoints
{
    public static void MapBookingEndpoints(this WebApplication app)
    {
        // Create a booking with atomic seat reservation
        app.MapPost("/api/bookings", async (
            CreateBookingRequest request,
            TravelDeskDbContext db) =>
        {
            if (request.FlightId <= 0)
            {
                return Results.BadRequest(new
                {
                    message = "A valid flight ID is required."
                });
            }

            if (string.IsNullOrWhiteSpace(request.PassengerName))
            {
                return Results.BadRequest(new
                {
                    message = "Passenger name is required."
                });
            }

            if (string.IsNullOrWhiteSpace(request.PassengerEmail) ||
                !MailAddress.TryCreate(
                    request.PassengerEmail.Trim(), out _))
            {
                return Results.BadRequest(new
                {
                    message = "A valid passenger email is required."
                });
            }

            if (request.NumberOfPassengers <= 0)
            {
                return Results.BadRequest(new
                {
                    message = "Number of passengers must be greater than zero."
                });
            }

            await using var transaction =
                await db.Database.BeginTransactionAsync();

            var flight = await db.Flights
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == request.FlightId);

            if (flight is null)
            {
                await transaction.RollbackAsync();

                return Results.NotFound(new
                {
                    message = "Flight not found."
                });
            }

            // Reserve seats only when enough seats are available.
            var seatsUpdated = await db.Flights
                .Where(f =>
                    f.Id == request.FlightId &&
                    f.AvailableSeats >= request.NumberOfPassengers)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(
                        f => f.AvailableSeats,
                        f => f.AvailableSeats - request.NumberOfPassengers));

            if (seatsUpdated == 0)
            {
                await transaction.RollbackAsync();

                return Results.BadRequest(new
                {
                    message = "Not enough available seats."
                });
            }

            var totalPrice = flight.Price * request.NumberOfPassengers;

            var booking = new Booking
            {
                BookingReference =
                    $"TD-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}",

                FlightId = flight.Id,
                PassengerName = request.PassengerName.Trim(),
                PassengerEmail = request.PassengerEmail.Trim(),
                NumberOfPassengers = request.NumberOfPassengers,
                TotalPrice = totalPrice,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };

            db.Bookings.Add(booking);

            await db.SaveChangesAsync();

            var remainingSeats = await db.Flights
                .Where(f => f.Id == request.FlightId)
                .Select(f => f.AvailableSeats)
                .FirstAsync();

            await transaction.CommitAsync();

            return Results.Ok(new
            {
                message = "Booking created successfully.",
                booking.Id,
                booking.BookingReference,
                booking.FlightId,
                booking.PassengerName,
                booking.PassengerEmail,
                booking.NumberOfPassengers,
                booking.TotalPrice,
                booking.Status,
                booking.CreatedAt,
                flight.Airline,
                flight.DepartureCity,
                flight.ArrivalCity,
                AvailableSeats = remainingSeats
            });
        });

        // Get all bookings
        app.MapGet("/api/bookings", async (TravelDeskDbContext db) =>
        {
            var bookings = await db.Bookings
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new
                {
                    b.Id,
                    b.BookingReference,
                    b.PassengerName,
                    b.PassengerEmail,
                    b.NumberOfPassengers,
                    b.TotalPrice,
                    b.Status,
                    b.CreatedAt,

                    Flight = b.Flight == null ? null : new
                    {
                        b.Flight.Id,
                        b.Flight.Airline,
                        b.Flight.DepartureCity,
                        b.Flight.ArrivalCity,
                        b.Flight.DepartureTime,
                        b.Flight.ArrivalTime,
                        b.Flight.Currency
                    }
                })
                .ToListAsync();

            return Results.Ok(bookings);
        });

        // Get booking by ID
        app.MapGet("/api/bookings/{id:int}", async (
            int id,
            TravelDeskDbContext db) =>
        {
            var booking = await db.Bookings
                .Where(b => b.Id == id)
                .Select(b => new
                {
                    b.Id,
                    b.BookingReference,
                    b.PassengerName,
                    b.PassengerEmail,
                    b.NumberOfPassengers,
                    b.TotalPrice,
                    b.Status,
                    b.CreatedAt,

                    Flight = b.Flight == null ? null : new
                    {
                        b.Flight.Id,
                        b.Flight.Airline,
                        b.Flight.DepartureCity,
                        b.Flight.ArrivalCity,
                        b.Flight.DepartureTime,
                        b.Flight.ArrivalTime,
                        b.Flight.Currency
                    }
                })
                .FirstOrDefaultAsync();

            if (booking is null)
            {
                return Results.NotFound(new
                {
                    message = "Booking not found."
                });
            }

            return Results.Ok(booking);
        });

        // Cancel a booking safely
        app.MapPut("/api/bookings/{id:int}/cancel", async (
            int id,
            TravelDeskDbContext db) =>
        {
            await using var transaction =
                await db.Database.BeginTransactionAsync();

            // Change status only if the booking is not already cancelled.
            var bookingUpdated = await db.Bookings
                .Where(b => b.Id == id && b.Status != "Cancelled")
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(b => b.Status, "Cancelled"));

            if (bookingUpdated == 0)
            {
                await transaction.RollbackAsync();

                var existingBooking = await db.Bookings
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (existingBooking is null)
                {
                    return Results.NotFound(new
                    {
                        message = "Booking not found."
                    });
                }

                return Results.BadRequest(new
                {
                    message = "Booking is already cancelled."
                });
            }

            var booking = await db.Bookings
                .AsNoTracking()
                .FirstAsync(b => b.Id == id);

            // Restore seats after successfully cancelling the booking.
            var flightUpdated = await db.Flights
                .Where(f => f.Id == booking.FlightId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(
                        f => f.AvailableSeats,
                        f => f.AvailableSeats + booking.NumberOfPassengers));

            if (flightUpdated == 0)
            {
                await transaction.RollbackAsync();

                return Results.NotFound(new
                {
                    message = "Associated flight not found."
                });
            }

            var availableSeats = await db.Flights
                .Where(f => f.Id == booking.FlightId)
                .Select(f => f.AvailableSeats)
                .FirstAsync();

            await transaction.CommitAsync();

            return Results.Ok(new
            {
                message = "Booking cancelled successfully.",
                booking.Id,
                booking.BookingReference,
                Status = "Cancelled",
                AvailableSeats = availableSeats
            });
        });
    }
}
