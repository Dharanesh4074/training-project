using backend.dto;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Interfaces
{
    public interface IProviderInterface
    {
        IActionResult addProviderDetails(ProviderDto request);
        IActionResult AddTrain(TrainDto trainDto);
        IActionResult AddBus(BusDto busDto);
        IActionResult AddFlight(FlightDto flightDto);
        IEnumerable<FlightModel> GetFlightsByProvider(int providerId);
        IEnumerable<BusModel> GetBusesByProvider(int providerId);
        IEnumerable<TrainModel> GetTrainsByProvider(int providerId);
        Task<BookingSummaryDto> GetBookingSummaryAsync(int transportId, string transportType);
        string UpdateFlight(FlightUpdateRequestDto updatedFlight);
        string UpdateBus(BusUpdateRequestDto updatedBus);
        string UpdateTrain(TrainUpdateRequestDto updatedTrain);
        Task<bool> DeleteBusAsync(int busId);
        Task<bool> DeleteTrainAsync(int busId);
        Task<bool> DeleteFlightAsync(int busId);

    }
}