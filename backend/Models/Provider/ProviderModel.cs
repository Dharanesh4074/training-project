using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class ProviderModel
    {
        [Key]
        public int ProviderId { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string ProviderName { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 11)]
        [EmailAddress]
        public string ProviderEmail { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 7)]
        public string ProviderOrganization { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string ProviderType { get; set; }
        [Required]
        public string ApprovelStatus { get; set; } = "Pending";
        [JsonIgnore]
        public ICollection<TrainModel> Trains { get; set; }
        [JsonIgnore]
        public ICollection<BusModel> Buses { get; set; }
        [JsonIgnore]
        public ICollection<FlightModel> Flights { get; set; }
    }
}