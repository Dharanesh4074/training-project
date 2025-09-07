using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class BookingRequestDto
    {
        public string UserId { get; set; } = null!;
        public int BusId { get; set; }
        public DateTime JourneyStartTime { get; set; }

        public List<int> SeatNumbers { get; set; } = new List<int>();
        public List<BusPassengerDto> Passengers { get; set; } = new List<BusPassengerDto>();
        public string PaymentMethod { get; set; } = null!;
    }
}