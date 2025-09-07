using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class FlightBookingModel
    {
        [Key]
        public int BookingId { get; set; }

        [Required]
        public int FlightId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public List<int> SeatNumbers { get; set; }
            public DateTime JourneyStartTime { get; set; }

        public DateTime BookingDate { get; set; }

        public List<FlightPassengerModel> FlightPassengers { get; set; }
    }
}
