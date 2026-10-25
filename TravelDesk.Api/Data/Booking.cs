
namespace TravelDesk.Api.Data;

public class Booking
{
    public int Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;

    public int FlightId { get; set; }

    public string PassengerName { get; set; } = string.Empty;

    public string PassengerEmail { get; set; } = string.Empty;

    public int NumberOfPassengers { get; set; }

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; }

    public Flight? Flight { get; set; }
}
