using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class BusSearchDto
    {
        [Required]
        public int BusId { get; set; }
        [Required]
        [StringLength(100)]
        public string DepartureCity { get; set; }
        [Required]
        [StringLength(100)]
        public string ArrivalCity { get; set; }
        public DateTime TravelDate { get; set; }
        [Required]
        [StringLength(100)]
        public string BusType { get; set; }
    }
}
