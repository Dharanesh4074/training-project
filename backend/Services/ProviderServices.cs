using backend.Context;
using backend.dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProviderServices : IProviderInterface
    {
        private readonly AppDbContext _context;
        public ProviderServices(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult addProviderDetails(ProviderDto _providerDetails)
        {
            try
            {
                var provider_details = _context.providerModel.FirstOrDefault(x => x.ProviderEmail == _providerDetails.ProviderEmail);
                if (provider_details != null)
                {
                    return new NotFoundObjectResult(new { message = "Provider is already available." });
                }
                var provider = new ProviderModel
                {
                    ProviderEmail = _providerDetails.ProviderEmail,
                    ProviderName = _providerDetails.ProviderName,
                    ProviderOrganization = _providerDetails.ProviderOrganization,
                    ProviderType = _providerDetails.ProviderType,
                };
                _context.providerModel.Add(provider);
                _context.SaveChanges();
                return new OkObjectResult(new { message = "Sent for Admin Approvel" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during Adding Role: {ex.Message}");

                return new ObjectResult(new { message = "Internal server error", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }
        public IActionResult AddTrain(TrainDto trainDto)
        {
            var provider = _context.providerModel.FirstOrDefault(p => p.ProviderId == trainDto.ProviderId);

            if (provider == null)
                return new NotFoundObjectResult("Provider not found.");

            if (!provider.ProviderType.Equals("train", StringComparison.OrdinalIgnoreCase))
                return new BadRequestObjectResult("Provider type is not authorized to add Train details.");

            if (!provider.ApprovelStatus.Equals("accepted", StringComparison.OrdinalIgnoreCase))
                return new BadRequestObjectResult("Provider is not approved.");

            var train = new TrainModel
            {
                TrainName = trainDto.TrainName,
                TrainType = trainDto.TrainType,
                Source = trainDto.Source,
                Destination = trainDto.Destination,
                DepartureTime = trainDto.DepartureTime,
                ArrivalTime = trainDto.ArrivalTime,
                Price = trainDto.Price,
                ProviderId = trainDto.ProviderId
            };

            _context.trainModel.Add(train);
            _context.SaveChanges();

            return new OkObjectResult(new
            {
                message = "Train added successfully.",
            });
        }
        public IActionResult AddBus(BusDto busDto)
        {
            var provider = _context.providerModel.FirstOrDefault(p => p.ProviderId == busDto.ProviderId);

            if (provider == null)
                return new NotFoundObjectResult("Provider not found.");

            if (!provider.ProviderType.Equals("bus", StringComparison.OrdinalIgnoreCase))
                return new BadRequestObjectResult("Provider type is not authorized to add Bus details.");

            if (!provider.ApprovelStatus.Equals("accepted", StringComparison.OrdinalIgnoreCase))
                return new BadRequestObjectResult("Provider is not approved.");

            var bus = new BusModel
            {
                BusName = busDto.BusName,
                BusType = busDto.BusType,
                Source = busDto.Source,
                Destination = busDto.Destination,
                DepartureTime = busDto.DepartureTime,
                ArrivalTime = busDto.ArrivalTime,
                Price = busDto.Price,
                ProviderId = busDto.ProviderId
            };

            _context.busModel.Add(bus);
            _context.SaveChanges();

            return new OkObjectResult(new
            {
                message = "Bus added successfully.",
            });
        }
        public IActionResult AddFlight(FlightDto flightDto)
        {
            var provider = _context.providerModel.FirstOrDefault(p => p.ProviderId == flightDto.ProviderId);

            if (provider == null)
                return new NotFoundObjectResult("Provider not found.");

            if (!provider.ProviderType.Equals("flight", StringComparison.OrdinalIgnoreCase))
                return new BadRequestObjectResult("Provider type is not authorized to add Flight details.");

            if (!provider.ApprovelStatus.Equals("accepted", StringComparison.OrdinalIgnoreCase))
                return new BadRequestObjectResult("Provider is not approved.");

            var flight = new FlightModel
            {
                FlightName = flightDto.FlightName,
                FlightType = flightDto.FlightType,
                Source = flightDto.Source,
                Destination = flightDto.Destination,
                DepartureTime = flightDto.DepartureTime,
                ArrivalTime = flightDto.ArrivalTime,
                Price = flightDto.Price,
                ProviderId = flightDto.ProviderId
            };

            _context.flightModel.Add(flight);
            _context.SaveChanges();

            return new OkObjectResult("Flight added successfully.");
        }
        public IEnumerable<FlightModel> GetFlightsByProvider(int providerId)
        {
            return _context.flightModel
                .Include(b => b.Provider)
                .Where(f => f.ProviderId == providerId)
                .ToList();
        }
        public IEnumerable<BusModel> GetBusesByProvider(int providerId)
        {
            return _context.busModel
                .Include(b => b.Provider)
                .Where(b => b.ProviderId == providerId)
                .ToList();
        }
        public IEnumerable<TrainModel> GetTrainsByProvider(int providerId)
        {
            return _context.trainModel
                .Include(b => b.Provider)
                .Where(t => t.ProviderId == providerId)
                .ToList();
        }
        public async Task<BookingSummaryDto> GetBookingSummaryAsync(int transportId, string transportType)
        {
            BookingSummaryDto summary = new()
            {
                TransportId = transportId,
                TransportType = transportType
            };

            if (transportType.ToLower() == "bus")
            {
                var bus = await _context.busModel.FindAsync(transportId);
                if (bus == null) throw new Exception("Bus not found");

                var bookings = await _context.busBookings
                    .Where(b => b.BusId == transportId)
                    .Include(b => b.BusPassengers)
                    .ToListAsync();

                summary.TotalCapacity = 36;
                summary.BookedCount = bookings.Sum(b => b.SeatNumbers.Count);

                foreach (var booking in bookings)
                {
                    for (int i = 0; i < booking.BusPassengers.Count; i++)
                    {
                        var p = booking.BusPassengers[i];
                        summary.Bookings.Add(new SeatBookingDetailDto
                        {
                            SeatNumber = booking.SeatNumbers[i].ToString(),
                            PassengerName = p.Name,
                            Age = p.Age,
                            Gender = p.Gender,
                            Email = p.Email
                        });
                    }
                }
            }
            else if (transportType.ToLower() == "train")
            {
                var train = await _context.trainModel.FindAsync(transportId);
                if (train == null) throw new Exception("Bus not found");

                var bookings = await _context.trainBookings
                    .Where(b => b.TrainId == transportId)
                    .Include(b => b.TrainPassengers)
                    .ToListAsync();

                summary.TotalCapacity = 125;
                summary.BookedCount = bookings.Sum(b => b.SeatNumbers.Count);

                foreach (var booking in bookings)
                {
                    for (int i = 0; i < booking.TrainPassengers.Count; i++)
                    {
                        var p = booking.TrainPassengers[i];
                        summary.Bookings.Add(new SeatBookingDetailDto
                        {
                            SeatNumber = booking.SeatNumbers[i],
                            PassengerName = p.Name,
                            Age = p.Age,
                            Gender = p.Gender,
                            Email = p.Email
                        });
                    }
                }
            }
            else if (transportType.ToLower() == "flight")
            {
                var flight = await _context.flightModel.FindAsync(transportId);
                if (flight == null) throw new Exception("Bus not found");

                var bookings = await _context.flightBookings
                    .Where(b => b.FlightId == transportId)
                    .Include(b => b.FlightPassengers)
                    .ToListAsync();

                summary.TotalCapacity = 100;
                summary.BookedCount = bookings.Sum(b => b.SeatNumbers.Count);

                foreach (var booking in bookings)
                {
                    for (int i = 0; i < booking.FlightPassengers.Count; i++)
                    {
                        var p = booking.FlightPassengers[i];
                        summary.Bookings.Add(new SeatBookingDetailDto
                        {
                            SeatNumber = booking.SeatNumbers[i].ToString(),
                            PassengerName = p.Name,
                            Age = p.Age,
                            Gender = p.Gender,
                            Email = p.Email
                        });
                    }
                }
            }
            else
            {
                throw new Exception("Invalid transport type");
            }

            return summary;
        }

        public string UpdateFlight(FlightUpdateRequestDto updatedFlight)
        {
            var flight = _context.flightModel.Find(updatedFlight.FlightId);
            if (flight == null)
                return "Flight not found";

            flight.FlightType = updatedFlight.FlightType;
            flight.DepartureTime = updatedFlight.DepartureTime;
            flight.ArrivalTime = updatedFlight.ArrivalTime;
            flight.Price = updatedFlight.Price;

            _context.SaveChanges();
            return "Flight updated successfully";
        }
        public string UpdateBus(BusUpdateRequestDto updatedBus)
        {
            var bus = _context.busModel.Find(updatedBus.BusId);
            if (bus == null)
                return "Flight not found";

            bus.BusType = updatedBus.BusType;
            bus.DepartureTime = updatedBus.DepartureTime;
            bus.ArrivalTime = updatedBus.ArrivalTime;
            bus.Price = updatedBus.Price;

            _context.SaveChanges();
            return "Flight updated successfully";
        }
        public string UpdateTrain(TrainUpdateRequestDto updatedTrain)
        {
            var train = _context.trainModel.Find(updatedTrain.TrainId);
            if (train == null)
                return "Flight not found";

            train.TrainType = updatedTrain.TrainType;
            train.DepartureTime = updatedTrain.DepartureTime;
            train.ArrivalTime = updatedTrain.ArrivalTime;
            train.Price = updatedTrain.Price;

            _context.SaveChanges();
            return "Flight updated successfully";
        }

        public async Task<bool> DeleteBusAsync(int busId)
        {
            var bus = await _context.busModel.FindAsync(busId);
            if (bus == null)
                return false;

            _context.busModel.Remove(bus);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteFlightAsync(int flightId)
        {
            var flight = await _context.flightModel.FindAsync(flightId);
            if (flight == null)
                return false;

            _context.flightModel.Remove(flight);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteTrainAsync(int trainId)
        {
            var train = await _context.trainModel.FindAsync(trainId);
            if (train == null)
                return false;

            _context.trainModel.Remove(train);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}