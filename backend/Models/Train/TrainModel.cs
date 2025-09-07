using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class TrainModel
    {
        [Key]
        public int TrainId { get; set; }
        [Required]
        [StringLength(100)]
        public string TrainName { get; set; }
        [StringLength(100)]
        [Required]
        public string TrainType { get; set; }
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
        public decimal Price { get; set; }
        [ForeignKey("Provider")]
        public int ProviderId { get; set; }
        // [JsonIgnore]
        public ProviderModel Provider { get; set; }
    }
}
