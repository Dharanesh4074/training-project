using System;

namespace backend.dto
{
    public class FlightSearchDto
    {
        public string FromAirport { get; set; }
        public string ToAirport { get; set; }
        public DateTime TravelDate { get; set; }
        public string FlightType { get; set; } 
    }
}
