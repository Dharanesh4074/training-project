using System.Text.Json.Serialization;
using backend.Models;
namespace backend.Models
{
    public class BusPassenger
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public int Age { get; set; }
    public string Gender { get; set; } = null!;
    public string Email { get; set; } = null!;

    public int BusBookingModelId { get; set; }
        [JsonIgnore]

    public BusBookingModel BusBookingModel { get; set; } = null!;
}

}