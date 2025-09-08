using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using backend.Context;
using backend.dto;
using backend.Interfaces;
using backend.Models;
using backend.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserServices : IUserInterface
    {
        private readonly AppDbContext _context;
        // Inject JWT options if needed; here kept as local variable in login
        // Microsoft.Extensions.Options.IOptions<JwtOptions> jwtOptions;

        public UserServices(AppDbContext context)
        {
            _context = context;
        }

        private string GetPassword(string _password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(_password);
                byte[] hashBytes = sha256.ComputeHash(bytes);

                StringBuilder builder = new StringBuilder();
                foreach (var b in hashBytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public async Task<IActionResult> register(registerDto _regDetails)
        {
            try
            {
                var newUser = new UserModel
                {
                    Email = _regDetails.Email,
                    Password = GetPassword(_regDetails.Password),
                    Phono = _regDetails.Phono,
                };

                var existing_user = await _context.usersModel.FirstOrDefaultAsync(x => x.Email == newUser.Email);
                if (existing_user != null)
                {
                    return new OkObjectResult(new { message = "Email is already taken." });
                }

                await _context.usersModel.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new { message = "User Registered Successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during registration: {ex.Message}");
                return new ObjectResult(new { message = "Internal server error", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }

        public async Task<IActionResult> login(loginDto _loginDetails)
        {
            try
            {
                var hashedPassword = GetPassword(_loginDetails.Password);

                var matched_user = await _context.usersModel
                    .FirstOrDefaultAsync(x => x.Email == _loginDetails.Email && x.Password == hashedPassword);

                if (matched_user == null)
                {
                    return new OkObjectResult(new { message = "User not found or invalid credentials." });
                }

                string roleString = matched_user.Role switch
                {
                    1 => "SuperAdmin",
                    2 => "Admin",
                    3 => "Provider",
                    4 => "User",
                    _ => "User"
                };

                var jwtOptions = new JwtOptions
                {
                    Key = "tfgusjhabdfy-yuawzsdfji-iowjhekcf-fgyuhjkhgvtfgyuhb-5678fghj",
                    Issuer = "https://www.payoda.com/",
                    Audience = "ticket-booking",
                    ExpirationMinutes = 60
                };

                var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, matched_user.Email),
            new Claim(ClaimTypes.NameIdentifier, matched_user.UserId.ToString()),
            new Claim(ClaimTypes.Role, roleString)
        };

                var token = JwtService.CreateJWTToken(jwtOptions, claims);

                // 👉 Try to fetch ProviderId if the user is a provider
                int? providerId = null;
                if (matched_user.Role == 3) // Role 3 = Provider
                {
                    var provider = await _context.providerModel
                        .FirstOrDefaultAsync(p => p.ProviderEmail == matched_user.Email);

                    providerId = provider?.ProviderId;
                }

                return new OkObjectResult(new
                {
                    message = "User Logged in Successfully.",
                    role = matched_user.Role,
                    token = token,
                    providerId = providerId,
                    userId = matched_user.UserId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during login: {ex.Message}");
                return new ObjectResult(new { message = "Internal server error", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }
        public async Task<IActionResult> SearchBus(BusSearchDto searchDto)
        {
            var matchedBuses = await _context.busModel
                .Where(b =>
        b.Source.ToLower() == searchDto.DepartureCity.ToLower()
        && b.Destination.ToLower() == searchDto.ArrivalCity.ToLower()
        && b.DepartureTime.Date == searchDto.TravelDate.Date
        && b.BusType.ToLower() == searchDto.BusType.ToLower()
    )
                .ToListAsync();

            if (!matchedBuses.Any())
            {
                return new NotFoundObjectResult(new { message = "No buses found matching the criteria." });
            }

            var busDtos = matchedBuses.Select(b => new BusDto
            {
                BusId = b.BusId,
                ProviderId = b.ProviderId,
                BusName = b.BusName,
                BusType = b.BusType,
                Source = b.Source,
                Destination = b.Destination,
                DepartureTime = b.DepartureTime,
                ArrivalTime = b.ArrivalTime,
                Price = b.Price
            }).ToList();

            return new OkObjectResult(busDtos);
        }
        public async Task<IActionResult> SearchFlight(FlightSearchDto searchDto)
        {
            var matchedFlights = await _context.flightModel
                .Where(f =>
                    f.Source.ToLower() == searchDto.FromAirport.ToLower() &&
                    f.Destination.ToLower() == searchDto.ToAirport.ToLower() &&
                    f.DepartureTime.Date == searchDto.TravelDate.Date &&
                    f.FlightType.ToLower() == searchDto.FlightType.ToLower()
                ).ToListAsync();

            if (!matchedFlights.Any())
            {
                return new NotFoundObjectResult(new { message = "No flights found matching the criteria." });
            }

            var flightDtos = matchedFlights.Select(f => new FlightDto
            {
                FlightId = f.FlightId,
                FlightName = f.FlightName,
                FlightType = f.FlightType,
                Source = f.Source,
                Destination = f.Destination,
                DepartureTime = f.DepartureTime,
                ArrivalTime = f.ArrivalTime,
                Price = f.Price
            }).ToList();

            return new OkObjectResult(flightDtos);
        }

        public async Task<(bool Success, string? Message)> BookSeatsAsync(BookingRequestDto request)
        {
            // Step 1: Fetch all bookings for the bus from DB
            var existingBookings = await _context.busBookings
                .Where(b => b.BusId == request.BusId)
                .ToListAsync();  // ✅ this can be translated to SQL

            // Step 2: Filter in-memory for overlapping seat numbers
            var conflicting = existingBookings
                .Where(b => b.SeatNumbers.Any(seat => request.SeatNumbers.Contains(seat)))
                .ToList();

            var alreadyBooked = conflicting
                .SelectMany(b => b.SeatNumbers)
                .Distinct()
                .Where(seat => request.SeatNumbers.Contains(seat))
                .ToList();

            if (alreadyBooked.Any())
            {
                return (false, $"Oops! Seat(s) {string.Join(", ", alreadyBooked)} already booked.");
            }

            // Step 3: Proceed with booking
            var booking = new BusBookingModel
            {
                BusId = request.BusId,
                UserId = request.UserId,
                JourneyStartTime = request.JourneyStartTime,
                SeatNumbers = request.SeatNumbers,
                PaymentMethod = request.PaymentMethod,
                Paid = true,
                CreatedAt = DateTime.UtcNow,
                BusPassengers = request.Passengers.Select(p => new BusPassenger
                {
                    Name = p.Name,
                    Age = p.Age,
                    Gender = p.Gender,
                    Email = p.Email
                }).ToList()
            };

            _context.busBookings.Add(booking);
            await _context.SaveChangesAsync();

            return (true, null);
        }
        public async Task<List<SeatBookingInfo>> GetBookedBusSeatsAsync(int busId)
        {
            var bookings = await _context.busBookings
                .Where(b => b.BusId == busId)
                .Include(b => b.BusPassengers)
                .ToListAsync();

            var result = new List<SeatBookingInfo>();

            foreach (var booking in bookings)
            {
                if (booking.SeatNumbers.Count == booking.BusPassengers.Count)
                {
                    for (int i = 0; i < booking.SeatNumbers.Count; i++)
                    {
                        result.Add(new SeatBookingInfo
                        {
                            SeatNumber = booking.SeatNumbers[i].ToString(),
                            Gender = booking.BusPassengers[i].Gender
                        });
                    }
                }
                else
                {
                    Console.WriteLine($"Mismatch in seat and passenger count for booking ID: {booking.Id}");
                }
            }

            return result;
        }

        public async Task<List<SeatBookingInfo>> GetBookedFlightSeatsAsync(int flightId)
        {
            var bookings = await _context.flightBookings
                .Where(b => b.FlightId == flightId)
                .Include(b => b.FlightPassengers)
                .ToListAsync();

            var result = new List<SeatBookingInfo>();

            foreach (var booking in bookings)
            {
                if (booking.SeatNumbers.Count == booking.FlightPassengers.Count)
                {
                    for (int i = 0; i < booking.SeatNumbers.Count; i++)
                    {
                        result.Add(new SeatBookingInfo
                        {
                            SeatNumber = booking.SeatNumbers[i].ToString(),
                            Gender = booking.FlightPassengers[i].Gender
                        });
                    }
                }
                else
                {
                    // Handle mismatch if needed (log, skip, etc.)
                    Console.WriteLine($"Mismatch in seat/passenger count in flight booking ID: {booking.BookingId}");
                }
            }

            return result;
        }


        public async Task<List<SeatBookingInfo>> GetBookedTrainSeatsAsync(int trainId)
        {
            var bookings = await _context.trainBookings
                .Where(b => b.TrainId == trainId)
                .Include(b => b.TrainPassengers) // Adjust to your actual nav property
                .ToListAsync();

            var result = new List<SeatBookingInfo>();

            foreach (var booking in bookings)
            {
                if (booking.SeatNumbers.Count == booking.TrainPassengers.Count)
                {
                    for (int i = 0; i < booking.SeatNumbers.Count; i++)
                    {
                        result.Add(new SeatBookingInfo
                        {
                            SeatNumber = booking.SeatNumbers[i], // string already
                            Gender = booking.TrainPassengers[i].Gender
                        });
                    }
                }
                else
                {
                    Console.WriteLine($"Mismatch in seat/passenger count in train booking ID: {booking.BookingId}");
                }
            }

            return result;
        }

        public async Task<IActionResult> SearchTrain(TrainSearchDto searchDto)
        {
            var matchedTrains = await _context.trainModel
                .Where(t =>
                    t.Source.ToLower() == searchDto.Source.ToLower() &&
                    t.Destination.ToLower() == searchDto.Destination.ToLower() &&
                    t.DepartureTime.Date == searchDto.TravelDate.Date &&
                    t.TrainType.ToLower() == searchDto.TrainType.ToLower()
                )
                .ToListAsync();

            if (!matchedTrains.Any())
            {
                return new NotFoundObjectResult(new { message = "No trains found matching the criteria." });
            }

            var trainDtos = matchedTrains.Select(t => new TrainDto
            {
                TrainId = t.TrainId,
                ProviderId = t.ProviderId,
                TrainName = t.TrainName,
                TrainType = t.TrainType,
                Source = t.Source,
                Destination = t.Destination,
                DepartureTime = t.DepartureTime,
                ArrivalTime = t.ArrivalTime,
                Price = t.Price
            }).ToList();

            return new OkObjectResult(trainDtos);
        }
        public async Task<(bool Success, string? Message)> BookTrainSeatsAsync(TrainBookingRequestDto request)
        {
            // Step 1: Fetch existing bookings for the same train
            var existingBookings = await _context.trainBookings
                .Where(b => b.TrainId == request.TrainId)
                .ToListAsync();

            // Step 2: Check for seat conflicts
            var conflicting = existingBookings
                .Where(b => b.SeatNumbers.Any(seat => request.SeatNumbers.Contains(seat)))
                .ToList();

            var alreadyBooked = conflicting
                .SelectMany(b => b.SeatNumbers)
                .Distinct()
                .Where(seat => request.SeatNumbers.Contains(seat))
                .ToList();

            if (alreadyBooked.Any())
            {
                return (false, $"Seat(s) already booked: {string.Join(", ", alreadyBooked)}");
            }

            // Step 3: Save booking
            var booking = new TrainBookingModel
            {
                TrainId = request.TrainId,
                UserId = request.UserId,
                JourneyStartTime = request.JourneyStartTime,
                SeatNumbers = request.SeatNumbers,
                BookingDate = DateTime.UtcNow,
                TrainPassengers = request.Passengers.Select(p => new TrainPassengerModel
                {
                    Name = p.Name,
                    Age = p.Age,
                    Gender = p.Gender,
                    Email = p.Email
                }).ToList()
            };

            _context.trainBookings.Add(booking);
            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<(bool Success, string? Message)> BookFlightSeatsAsync(FlightBookingRequestDto request)
        {
            // Check for existing bookings
            var existingBookings = await _context.flightBookings
                .Where(b => b.FlightId == request.FlightId)
                .ToListAsync();

            var conflicting = existingBookings
                .Where(b => b.SeatNumbers.Any(seat => request.SeatNumbers.Contains(seat)))
                .ToList();

            var alreadyBooked = conflicting
                .SelectMany(b => b.SeatNumbers)
                .Distinct()
                .Where(seat => request.SeatNumbers.Contains(seat))
                .ToList();

            if (alreadyBooked.Any())
            {
                return (false, $"Seat(s) already booked: {string.Join(", ", alreadyBooked)}");
            }

            // Save booking
            var booking = new FlightBookingModel
            {
                FlightId = request.FlightId,
                UserId = request.UserId,
                JourneyStartTime = request.JourneyStartTime,
                SeatNumbers = request.SeatNumbers,
                BookingDate = DateTime.UtcNow,
                FlightPassengers = request.Passengers.Select(p => new FlightPassengerModel
                {
                    Name = p.Name,
                    Age = p.Age,
                    Gender = p.Gender,
                    Email = p.Email
                }).ToList()
            };

            _context.flightBookings.Add(booking);
            await _context.SaveChangesAsync();

            return (true, null);
        }
        public async Task<List<FlightBookingModel>> GetFlightBookingsAsync(string userId)
        {
            return await _context.flightBookings
                .Where(b => b.UserId == userId)
                .Include(b => b.FlightPassengers)
                .ToListAsync();
        }

        public async Task<List<TrainBookingModel>> GetTrainBookingsAsync(string userId)
        {
            return await _context.trainBookings
                .Where(b => b.UserId == userId)
                .Include(b => b.TrainPassengers)
                .ToListAsync();
        }

        public async Task<List<BusBookingModel>> GetBusBookingsAsync(string userId)
        {
            return await _context.busBookings
                .Where(b => b.UserId == userId)
                .Include(b => b.BusPassengers)
                .ToListAsync();
        }

        public async Task<string> UpdatePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _context.usersModel.FindAsync(userId);

            if (user == null)
                return "User not found.";

            var hashedOldPassword = GetPassword(oldPassword);

            if (user.Password != hashedOldPassword)
                return "Old password is incorrect.";

            user.Password = GetPassword(newPassword);

            _context.usersModel.Update(user);
            await _context.SaveChangesAsync();

            return "Password updated successfully.";
        }
        public async Task<(bool Success, string? Message)> CancelBusBookingAsync(int bookingId)
        {
            var booking = await _context.busBookings.FindAsync(bookingId);
            if (booking == null)
                return (false, "Booking not found.");

            _context.busBookings.Remove(booking);
            await _context.SaveChangesAsync();
            return (true, "Bus booking cancelled successfully.");
        }

        public async Task<(bool Success, string? Message)> CancelTrainBookingAsync(int bookingId)
        {
            var booking = await _context.trainBookings.FindAsync(bookingId);
            if (booking == null)
                return (false, "Booking not found.");

            _context.trainBookings.Remove(booking);
            await _context.SaveChangesAsync();
            return (true, "Train booking cancelled successfully.");
        }

        public async Task<(bool Success, string? Message)> CancelFlightBookingAsync(int bookingId)
        {
            var booking = await _context.flightBookings.FindAsync(bookingId);
            if (booking == null)
                return (false, "Booking not found.");

            _context.flightBookings.Remove(booking);
            await _context.SaveChangesAsync();
            return (true, "Flight booking cancelled successfully.");
        }

        public IEnumerable<FlightModel> GetFlightsForUsers()
        {
            var today = DateTime.Today;
            return _context.flightModel
            .Where(b => b.DepartureTime >= today)
            .ToList();
        }
        public IEnumerable<BusModel> GetBusesForUsers()
        {
            var today = DateTime.Today;
            return _context.busModel
                .Where(b => b.DepartureTime >= today)
                .ToList();
        }

        public IEnumerable<TrainModel> GetTrainsForUsers()
        {
            var today = DateTime.Today;
            return _context.trainModel
                .Where(b => b.DepartureTime >= today)
                .ToList();
        }

    }
}
