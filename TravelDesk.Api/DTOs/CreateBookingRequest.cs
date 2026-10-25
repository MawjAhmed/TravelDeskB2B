
namespace TravelDesk.Api.DTOs;

public class CreateBookingRequest
{
    public int FlightId { get; set; }

    public string PassengerName { get; set; } = string.Empty;

    public string PassengerEmail { get; set; } = string.Empty;

    public int NumberOfPassengers { get; set; }
}
