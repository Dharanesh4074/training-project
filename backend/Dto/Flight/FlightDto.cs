using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class FlightDto
    {
        [Required]
        public int ProviderId { get; set; }
        [Required]
        public int FlightId { get; set; }
        [Required]
        [StringLength(100)]
        public string FlightName { get; set; }

        [Required]
        [StringLength(100)]
        public string FlightType { get; set; }

        [Required]
        [StringLength(100)]
        public string Source { get; set; }

        [Required]
        [StringLength(100)]
        public string Destination { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
