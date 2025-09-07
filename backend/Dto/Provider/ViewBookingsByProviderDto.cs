namespace backend.dto
{
    public class BookingSummaryDto
    {
        public int TransportId { get; set; }
        public string TransportType { get; set; } = null!;
        public int TotalCapacity { get; set; }
        public int BookedCount { get; set; }
        public List<SeatBookingDetailDto> Bookings { get; set; } = new();
    }

    public class SeatBookingDetailDto
    {
        public string SeatNumber { get; set; } = null!;
        public string PassengerName { get; set; } = null!;
        public int Age { get; set; }
        public string Gender { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
    
}
