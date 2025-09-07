using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class FlightPassengerModel
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }

        [ForeignKey("FlightBooking")]
        public int FlightBookingId { get; set; }
            [JsonIgnore]

        public FlightBookingModel FlightBooking { get; set; }
    }
}
