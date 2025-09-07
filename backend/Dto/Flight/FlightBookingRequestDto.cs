namespace backend.dto
{
    public class FlightBookingRequestDto
    {
        public int FlightId { get; set; }

        public string UserId { get; set; }
            public DateTime JourneyStartTime { get; set; }

        public List<int> SeatNumbers { get; set; } = new();

        public List<FlightPassengerDto> Passengers { get; set; } = new();
    }
}
