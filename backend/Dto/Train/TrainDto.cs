using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class TrainDto
{
    public int TrainId { get; set; }
    public int ProviderId { get; set; }
    public string TrainName { get; set; }
    public string TrainType { get; set; }
    public string Source { get; set; }
    public string Destination { get; set; }
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public decimal Price { get; set; }
}
}
