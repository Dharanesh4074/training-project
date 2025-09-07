using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TrainBookingModel
    {
        [Key]
        public int BookingId { get; set; }
        public int TrainId { get; set; }
        public List<string> SeatNumbers { get; set; }
        public DateTime BookingDate { get; set; }
        public string UserId { get; set; }
            public DateTime JourneyStartTime { get; set; }

        public List<TrainPassengerModel> TrainPassengers { get; set; }
    }
}