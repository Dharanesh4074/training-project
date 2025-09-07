using backend.dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserInterface _userInterface;
        private static readonly JsonSerializerOptions jsonOptions = new()
        {
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            WriteIndented = true
        };
        public UserController(IUserInterface userInterface)
        {
            _userInterface = userInterface;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> login([FromBody] loginDto _loginDetails)
        {
            var res = await _userInterface.login(_loginDetails);
            return res;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> register([FromBody] registerDto _registerDetails)
        {
            var res = await _userInterface.register(_registerDetails);
            return res;
        }

        [HttpPost("SearchBus")]
        public async Task<IActionResult> SearchBus([FromBody] BusSearchDto searchDto)
        {
            var res = await _userInterface.SearchBus(searchDto);
            return res;
        }

        [HttpPost("SearchTrain")]
        public async Task<IActionResult> SearchTrain([FromBody] TrainSearchDto searchDto)
        {
            return await _userInterface.SearchTrain(searchDto);
        }

        [HttpPost("SearchFlight")]
        public async Task<IActionResult> SearchFlight([FromBody] FlightSearchDto searchDto)
        {
            return await _userInterface.SearchFlight(searchDto);
        }

        [Authorize(Roles = "User")]
        [HttpGet("GetBookedBusSeats")]
        public async Task<IActionResult> GetBookedBusSeats(int busId)
        {
            var bookedSeats = await _userInterface.GetBookedBusSeatsAsync(busId);
            return Ok(bookedSeats);
        }

        [Authorize(Roles = "User")]
        [HttpGet("GetBookedTrainSeats")]
        public async Task<IActionResult> GetBookedTrainSeats(int trainId)
        {
            var bookedSeats = await _userInterface.GetBookedTrainSeatsAsync(trainId);
            return Ok(bookedSeats);
        }

        [Authorize(Roles = "User")]
        [HttpGet("GetBookedFlightSeats")]
        public async Task<IActionResult> GetBookedFightSeats(int flightId)
        {
            var bookedSeats = await _userInterface.GetBookedFlightSeatsAsync(flightId);
            return Ok(bookedSeats);
        }

        [Authorize(Roles = "User")]
        [HttpPost("BookBusSeat")]
        public async Task<IActionResult> BookSeats([FromBody] BookingRequestDto request)
        {
            var (success, message) = await _userInterface.BookSeatsAsync(request);
            if (!success)
            {
                return Conflict(new { message });
            }

            return Ok(new { message = "Booking successful!" });
        }

        [Authorize(Roles = "User")]
        [HttpPost("BookTrainSeat")]
        public async Task<IActionResult> BookTrain([FromBody] TrainBookingRequestDto request)
        {
            var result = await _userInterface.BookTrainSeatsAsync(request);
            if (result.Success)
                return Ok(new { message = "Train booked successfully." });
            else
                return BadRequest(new { message = result.Message });
        }

        [Authorize(Roles = "User")]
        [HttpPost("BookFlightSeat")]
        public async Task<IActionResult> BookFlight([FromBody] FlightBookingRequestDto request)
        {
            var result = await _userInterface.BookFlightSeatsAsync(request);
            if (result.Success)
                return Ok(new { message = "Flight booked successfully." });
            else
                return BadRequest(new { message = result.Message });
        }

        // for my-bookings

        [Authorize(Roles = "User")]
        [HttpGet("GetFlightBookings")]
        public async Task<IActionResult> GetFlightBookings([FromQuery] string userId)
        {
            try
            {
                var bookings = await _userInterface.GetFlightBookingsAsync(userId);
                if (bookings == null || !bookings.Any())
                    return NotFound(new { message = "No flight bookings found for this user." });

                return new JsonResult(bookings, jsonOptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error.", error = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("GetTrainBookings")]
        public async Task<IActionResult> GetTrainBookings([FromQuery] string userId)
        {
            try
            {
                var bookings = await _userInterface.GetTrainBookingsAsync(userId);
                if (bookings == null || !bookings.Any())
                    return NotFound(new { message = "No train bookings found for this user." });

                return new JsonResult(bookings, jsonOptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error.", error = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("GetBusBookings")]
        public async Task<IActionResult> GetBusBookings([FromQuery] string userId)
        {
            try
            {
                var bookings = await _userInterface.GetBusBookingsAsync(userId);
                if (bookings == null || !bookings.Any())
                    return NotFound(new { message = "No bus bookings found for this user." });

                return new JsonResult(bookings, jsonOptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error.", error = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpDelete("cancel/bus/{id}")]
        public async Task<IActionResult> CancelBusBooking(int id)
        {
            var result = await _userInterface.CancelBusBookingAsync(id);
            if (result.Success)
                return Ok(new { message = result.Message });
            return NotFound(new { message = result.Message });
        }

        [Authorize(Roles = "User")]
        [HttpDelete("cancel/train/{id}")]
        public async Task<IActionResult> CancelTrainBooking(int id)
        {
            var result = await _userInterface.CancelTrainBookingAsync(id);
            if (result.Success)
                return Ok(new { message = result.Message });
            return NotFound(new { message = result.Message });
        }

        [Authorize(Roles = "User")]
        [HttpDelete("cancel/flight/{id}")]
        public async Task<IActionResult> CancelFlightBooking(int id)
        {
            var result = await _userInterface.CancelFlightBookingAsync(id);
            if (result.Success)
                return Ok(new { message = result.Message });
            return NotFound(new { message = result.Message });
        }

        [Authorize(Roles = "User,SuperAdmin,Provider")]
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] PasswordUpdateDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userInterface.UpdatePasswordAsync(model.UserId, model.OldPassword, model.NewPassword);

            if (result == null)
            {
                return BadRequest("Old password is incorrect or user not found.");
            }

            return Ok("Password updated successfully.");
        }

        [HttpGet("GetFlightsForUsers")]
        public IActionResult GetFlightsForUser()
        {
            var flights = _userInterface.GetFlightsForUsers();
            return Ok(flights);
        }
        [HttpGet("GetBusesForUsers")]
        public IActionResult GetBusesForUser()
        {
            var buses = _userInterface.GetBusesForUsers();
            return Ok(buses);
        }
        [HttpGet("GetTrainsForUsers")]
        public IActionResult GetTrainsByProvider()
        {
            var trains = _userInterface.GetTrainsForUsers();
            return Ok(trains);
        }


    }
}
