using NUnit.Framework;
using backend.Context;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace backend_test.Services
{
    public class ProviderServices_GetTests
    {
        private AppDbContext _context;
        private ProviderServices _providerService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // fresh DB per test
                .Options;

            _context = new AppDbContext(options);
            _providerService = new ProviderServices(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public void GetFlightsByProvider_ReturnsMatchingFlights()
        {
            // Arrange
            var provider = new ProviderModel
            {
                ProviderId = 1,
                ProviderName = "AirIndia",
                ProviderEmail = "airindia@example.com",
                ProviderOrganization = "AirIndiaOrg",
                ProviderType = "Flight"
            };

            _context.providerModel.Add(provider);

            var flights = new List<FlightModel>
    {
        new FlightModel
        {
            FlightId = 1,
            FlightName = "Indigo",
            FlightType = "Economy",
            Source = "Chennai",
            Destination = "Delhi",
            DepartureTime = DateTime.Now,
            ArrivalTime = DateTime.Now.AddHours(2),
            Price = 2500,
            ProviderId = 1
        },
        new FlightModel
        {
            FlightId = 2,
            FlightName = "SpiceJet",
            FlightType = "Business",
            Source = "Mumbai",
            Destination = "Bangalore",
            DepartureTime = DateTime.Now,
            ArrivalTime = DateTime.Now.AddHours(3),
            Price = 3000,
            ProviderId = 1
        }
    };

            _context.flightModel.AddRange(flights);
            _context.SaveChanges();

            // Act
            var result = _providerService.GetFlightsByProvider(1);

            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
        }

        [Test]
        public void GetBusesByProvider_ReturnsMatchingBuses()
        {
            // Arrange
            var provider = new ProviderModel
            {
                ProviderId = 2,
                ProviderName = "BusProvider",
                ProviderEmail = "bus@example.com",
                ProviderOrganization = "BusCorp",
                ProviderType = "Bus"
            };

            _context.providerModel.Add(provider);

            var buses = new List<BusModel>
    {
        new BusModel
        {
            BusId = 1,
            BusName = "BusOne",
            BusType = "AC",
            Source = "Coimbatore",
            Destination = "Madurai",
            DepartureTime = DateTime.Now,
            ArrivalTime = DateTime.Now.AddHours(4),
            Price = 800,
            ProviderId = 2
        },
        new BusModel
        {
            BusId = 2,
            BusName = "BusTwo",
            BusType = "Sleeper",
            Source = "Trichy",
            Destination = "Chennai",
            DepartureTime = DateTime.Now,
            ArrivalTime = DateTime.Now.AddHours(6),
            Price = 1000,
            ProviderId = 2
        }
    };

            _context.busModel.AddRange(buses);
            _context.SaveChanges();

            // Act
            var result = _providerService.GetBusesByProvider(2);

            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
        }

        [Test]
        public void GetTrainsByProvider_ReturnsMatchingTrains()
        {
            // Arrange
            var provider = new ProviderModel
            {
                ProviderId = 3,
                ProviderName = "TrainProvider",
                ProviderEmail = "train@example.com",
                ProviderOrganization = "TrainOrg",
                ProviderType = "Train"
            };

            _context.providerModel.Add(provider);

            var trains = new List<TrainModel>
    {
        new TrainModel
        {
            TrainId = 1,
            TrainName = "ExpressOne",
            TrainType = "Sleeper",
            Source = "Delhi",
            Destination = "Jaipur",
            DepartureTime = DateTime.Now,
            ArrivalTime = DateTime.Now.AddHours(5),
            Price = 1200,
            ProviderId = 3
        },
        new TrainModel
        {
            TrainId = 2,
            TrainName = "ExpressTwo",
            TrainType = "AC",
            Source = "Hyderabad",
            Destination = "Pune",
            DepartureTime = DateTime.Now,
            ArrivalTime = DateTime.Now.AddHours(7),
            Price = 1500,
            ProviderId = 3
        }
    };

            _context.trainModel.AddRange(trains);
            _context.SaveChanges();

            // Act
            var result = _providerService.GetTrainsByProvider(3);

            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
        }

    }
}
