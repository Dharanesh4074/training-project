using backend.Context;
using backend.dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SuperAdminController : ControllerBase
    {
        private readonly ISuperAdminInterface _superAdminInterface;
        private readonly AppDbContext _context;

        public SuperAdminController(ISuperAdminInterface superAdminInterface, AppDbContext context)
        {
            _superAdminInterface = superAdminInterface;
            _context = context;
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("addRole")]
        public IActionResult addRole(MasterRoleDto _masterRole)
        {
            var res = _superAdminInterface.addRole(_masterRole);
            return res;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("getAllProviders")]
        public IEnumerable<ProviderModel> getAllProvider()
        {
            var res = _superAdminInterface.getAllProvider();
            return res;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("updateProviderStatus")]
        public IActionResult UpdateProviderStatus(UpdateProviderStatus _updateProviderDetails)
        {
            var res = _superAdminInterface.updateProviderStatus(_updateProviderDetails);
            return res;
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("deleteProvider")]
        public IActionResult DeleteProvider(DeleteProvider _deleteProvider)
        {
            var res = _superAdminInterface.deleteProvider(_deleteProvider);
            return res;
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("getAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = _superAdminInterface.GetAllUsers();
            return Ok(users);
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("getFlightsByAdmin")]
        public IActionResult GetFlightsByAdmin()
        {
            var flights = _superAdminInterface.GetFlightsByAdmin();
            return Ok(flights);
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("getBusesByAdmin")]
        public IActionResult GetBusesByAdmin()
        {
            var buses = _superAdminInterface.GetBusesByAdmin();
            return Ok(buses);
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("getTrainsByAdmin")]
        public IActionResult GetTrainsByAdmin()
        {
            var trains = _superAdminInterface.GetTrainsByAdmin();
            return Ok(trains);
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("GetTrainBookingsForUser")]
        public async Task<IActionResult> GetTrainBookings([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("UserId is required.");

            var trainBookings = await _context.trainBookings
                .Include(t => t.TrainPassengers)
                .Where(t => t.UserId == userId)
                .ToListAsync();

            return Ok(trainBookings);
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("GetBusBookingsForUser")]
        public async Task<IActionResult> GetBusBookings([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("UserId is required.");

            var busBookings = await _context.busBookings
                .Include(b => b.BusPassengers)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return Ok(busBookings);
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("GetFlightBookingsForUser")]
        public async Task<IActionResult> GetFlightBookings([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest("UserId is required.");

            var flightBookings = await _context.flightBookings
                .Include(f => f.FlightPassengers)
                .Where(f => f.UserId == userId)
                .ToListAsync();

            return Ok(flightBookings);
        }
    }
}