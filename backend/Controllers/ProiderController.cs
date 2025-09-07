using backend.dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProviderController : ControllerBase
    {
        private readonly IProviderInterface _providerInterface;

        public ProviderController(IProviderInterface providerInterface)
        {
            _providerInterface = providerInterface;
        }
        [Authorize(Roles = "Provider")]
        [HttpPost("addProviderDetails")]
        public IActionResult addProvider(ProviderDto _providerDetails)
        {
            var res = _providerInterface.addProviderDetails(_providerDetails);
            return res;
        }
        [Authorize(Roles = "Provider")]
        [HttpPost("addTrain")]
        public IActionResult AddTrain(TrainDto _trainDetails)
        {
            var res = _providerInterface.AddTrain(_trainDetails);
            if (res is ObjectResult objectResult)
            {
                return Ok(new { message = objectResult.Value });
            }
            return res;
        }
        [Authorize(Roles = "Provider")]
        [HttpPost("addBus")]
        public IActionResult AddBus(BusDto _busDetails)
        {
            var res = _providerInterface.AddBus(_busDetails);
            if (res is ObjectResult objectResult)
            {
                return Ok(new { message = objectResult.Value });
            }
            return res;
        }
        [Authorize(Roles = "Provider")]
        [HttpPost("addFlight")]
        public IActionResult AddFlight(FlightDto _flightDetails)
        {
            var res = _providerInterface.AddFlight(_flightDetails);
            if (res is ObjectResult objectResult)
            {
                return Ok(new { message = objectResult.Value });
            }

            return res;
        }
        [Authorize(Roles = "Provider")]
        [HttpGet("getFlightsByProvider")]
        public IActionResult GetFlightsByProvider(int providerId)
        {
            var flights = _providerInterface.GetFlightsByProvider(providerId);
            return Ok(flights);
        }
        [Authorize(Roles = "Provider")]
        [HttpGet("getBusesByProvider")]
        public IActionResult GetBusesByProvider(int providerId)
        {
            var buses = _providerInterface.GetBusesByProvider(providerId);
            return Ok(buses);
        }
        [Authorize(Roles = "Provider")]
        [HttpGet("getTrainsByProvider")]
        public IActionResult GetTrainsByProvider(int providerId)
        {
            var trains = _providerInterface.GetTrainsByProvider(providerId);
            return Ok(trains);
        }
        [Authorize(Roles = "Provider,SuperAdmin")]
        [HttpGet("GetBookingSummaryForProvider")]
        public async Task<IActionResult> GetBookingSummary([FromQuery] int transportId, [FromQuery] string transportType)
        {
            try
            {
                var result = await _providerInterface.GetBookingSummaryAsync(transportId, transportType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Provider")]
        [HttpPut("UpdateFlightDetails")]
        public IActionResult UpdateFlight([FromBody] FlightUpdateRequestDto updatedFlight)
        {
            var result = _providerInterface.UpdateFlight(updatedFlight);

            if (result == "Flight not found")
                return NotFound(result);

            return Ok(new { message = result });
        }
        [Authorize(Roles = "Provider")]
        [HttpPut("UpdateBusDetails")]
        public IActionResult UpdateFlight([FromBody] BusUpdateRequestDto updatedBus)
        {
            var result = _providerInterface.UpdateBus(updatedBus);

            if (result == "Bus not found")
                return NotFound(result);

            return Ok(new { message = result });
        }
        [Authorize(Roles = "Provider")]
        [HttpPut("UpdateTrainDetails")]
        public IActionResult UpdateFlight([FromBody] TrainUpdateRequestDto updatedTrain)
        {
            var result = _providerInterface.UpdateTrain(updatedTrain);

            if (result == "Train not found")
                return NotFound(result);
            return Ok(new { message = result });
        }
        [Authorize(Roles = "Provider")]
        [HttpDelete("DeleteBusById/{id}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            var success = await _providerInterface.DeleteBusAsync(id);
            if (!success) return NotFound(new { message = "Bus not found." });
            return Ok(new { message = "Bus deleted successfully." });
        }
        [Authorize(Roles = "Provider")]
        [HttpDelete("DeleteTrainById/{id}")]
        public async Task<IActionResult> DeleteTrain(int id)
        {
            var success = await _providerInterface.DeleteTrainAsync(id);
            if (!success) return NotFound(new { message = "Bus not found." });
            return Ok(new { message = "Bus deleted successfully." });
        }
        [Authorize(Roles = "Provider")]
        [HttpDelete("DeleteFlightById/{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var success = await _providerInterface.DeleteFlightAsync(id);
            if (!success) return NotFound(new { message = "Bus not found." });
            return Ok(new { message = "Bus deleted successfully." });
        }

    }
}