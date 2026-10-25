
namespace TravelDesk.Api.Data;

public class Flight
{
    public int Id { get; set; }

    public string Airline { get; set; } = string.Empty;

    public string DepartureCity { get; set; } = string.Empty;

    public string ArrivalCity { get; set; } = string.Empty;

    public DateTime DepartureTime { get; set; }

    public DateTime ArrivalTime { get; set; }

    public decimal Price { get; set; }

    public string Currency { get; set; } = "USD";

    public int AvailableSeats { get; set; }
}
