using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class BusUpdateRequestDto
    {
                [Required]
        public int BusId { get; set; }
        [Required]
        [StringLength(100)]
        public string BusType { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
