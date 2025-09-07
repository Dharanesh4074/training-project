using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class FlightUpdateRequestDto
    {
        [Required]
        public int FlightId { get; set; }
        [Required]
        [StringLength(100)]
        public string FlightType { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
