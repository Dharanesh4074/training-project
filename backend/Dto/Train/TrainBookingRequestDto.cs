namespace backend.dto
{
    public class TrainBookingRequestDto
    {
        public int TrainId { get; set; }        
        public string UserId { get; set; }
        public DateTime JourneyStartTime { get; set; }
        public List<string> SeatNumbers { get; set; } = new(); 
        public List<TrainPassengerDto> Passengers { get; set; } = new();
    }

}
