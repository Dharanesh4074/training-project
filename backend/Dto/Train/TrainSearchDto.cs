using System.ComponentModel.DataAnnotations;
namespace backend.dto
{
    public class TrainSearchDto
    {
        public string Source { get; set; }
        public string Destination { get; set; }
        public DateTime TravelDate { get; set; }
        public string TrainType { get; set; }
    }
}
