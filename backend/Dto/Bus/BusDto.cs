using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class BusDto
    {
        public int BusId { get; set; }
        [Required]
        public int ProviderId { get; set; }
        [Required]
        [StringLength(100)]
        public string BusName { get; set; }

        [Required]
        [StringLength(100)]
        public string BusType { get; set; }

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
