using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class FlightModel
    {
        [Key]
        public int FlightId { get; set; }
        [StringLength(100)]
        [Required]
        public string FlightName { get; set; }
        [StringLength(100)]
        [Required]
        public string FlightType { get; set; }
        [StringLength(100)]
        [Required]
        public string Source { get; set; }
        [StringLength(100)]
        [Required]
        public string Destination { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        public decimal Price { get; set; }

        [ForeignKey("Provider")]
        public int ProviderId { get; set; }
        // [JsonIgnore]
        public ProviderModel Provider { get; set; }
    }
}
