using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class TrainPassengerModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }
    public string Email { get; set; }

    [ForeignKey("TrainBooking")]
    public int TrainBookingId { get; set; }
    [JsonIgnore]
    public TrainBookingModel TrainBooking { get; set; }
}

}