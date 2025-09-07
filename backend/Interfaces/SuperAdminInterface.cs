using backend.dto;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Interfaces
{
    public interface ISuperAdminInterface
    {
        IActionResult addRole(MasterRoleDto request);
        IEnumerable<ProviderModel> getAllProvider();
        IActionResult updateProviderStatus(UpdateProviderStatus request);
        IActionResult deleteProvider(DeleteProvider request);
        IEnumerable<GetUserDto> GetAllUsers();
        IEnumerable<FlightModel> GetFlightsByAdmin();
        IEnumerable<BusModel> GetBusesByAdmin();
        IEnumerable<TrainModel> GetTrainsByAdmin();
    }
}