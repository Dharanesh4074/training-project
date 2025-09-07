using backend.dto;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IUserInterface
    {
        Task<IActionResult> login(loginDto request);
        Task<IActionResult> register(registerDto request);
        Task<IActionResult> SearchBus(BusSearchDto searchDto);
        Task<IActionResult> SearchTrain(TrainSearchDto searchDto);
        Task<IActionResult> SearchFlight(FlightSearchDto searchDto);

        Task<(bool Success, string? Message)> BookSeatsAsync(BookingRequestDto request);
        Task<List<SeatBookingInfo>> GetBookedBusSeatsAsync(int busId);
        Task<List<SeatBookingInfo>> GetBookedTrainSeatsAsync(int trainId);
        Task<List<SeatBookingInfo>> GetBookedFlightSeatsAsync(int flightId);
        Task<(bool Success, string? Message)> BookTrainSeatsAsync(TrainBookingRequestDto request);
        Task<(bool Success, string? Message)> BookFlightSeatsAsync(FlightBookingRequestDto request);
        Task<List<FlightBookingModel>> GetFlightBookingsAsync(string userId);
        Task<List<TrainBookingModel>> GetTrainBookingsAsync(string userId);
        Task<List<BusBookingModel>> GetBusBookingsAsync(string userId);
        Task<string> UpdatePasswordAsync(int userId, string oldPassword, string newPassword);
        Task<(bool Success, string? Message)> CancelBusBookingAsync(int bookingId);
        Task<(bool Success, string? Message)> CancelTrainBookingAsync(int bookingId);
        Task<(bool Success, string? Message)> CancelFlightBookingAsync(int bookingId);
        IEnumerable<FlightModel> GetFlightsForUsers();
        IEnumerable<BusModel> GetBusesForUsers();
        IEnumerable<TrainModel> GetTrainsForUsers();
    }
}
