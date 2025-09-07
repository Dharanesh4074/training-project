using backend.Models;
namespace backend.Models
{
    public class BusBookingModel
{
    public int Id { get; set; }
    public int BusId { get; set; }
    public string UserId { get; set; } = null!;
    public List<int> SeatNumbers { get; set; } = new();
    public string PaymentMethod { get; set; } = null!;
    public bool Paid { get; set; } = true;
    public DateTime JourneyStartTime { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<BusPassenger> BusPassengers { get; set; } = new();
}

}

