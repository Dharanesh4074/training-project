using NUnit.Framework;
using Moq;
using backend.Controllers;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.dto;

namespace backend_test.Controllers
{
    public class ProviderController_GetTests
    {
        private Mock<IProviderInterface> _mockProviderInterface;
        private ProviderController _controller;

        [SetUp]
        public void Setup()
        {
            _mockProviderInterface = new Mock<IProviderInterface>();
            _controller = new ProviderController(_mockProviderInterface.Object);
        }

        [Test]
        public void GetFlightsByProvider_ReturnsOkWithFlights()
        {
            // Arrange
            var providerId = 1;
            var flights = new List<FlightModel>
    {
        new FlightModel { FlightId = 1, FlightName = "Indigo" },
        new FlightModel { FlightId = 2, FlightName = "SpiceJet" }
    };

            _mockProviderInterface
                .Setup(p => p.GetFlightsByProvider(providerId))
                .Returns(flights);

            // Act
            var result = _controller.GetFlightsByProvider(providerId) as OkObjectResult;

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.StatusCode, Is.EqualTo(200));
            Assert.That(result.Value, Is.EqualTo(flights));
        }

        [Test]
        public void GetBusesByProvider_ReturnsOkWithBuses()
        {
            // Arrange
            var providerId = 2;
            var buses = new List<BusModel>
    {
        new BusModel { BusId = 1, BusName = "Bus1" },
        new BusModel { BusId = 2, BusName = "Bus2" }
    };

            _mockProviderInterface
                .Setup(p => p.GetBusesByProvider(providerId))
                .Returns(buses);

            // Act
            var result = _controller.GetBusesByProvider(providerId) as OkObjectResult;

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.StatusCode, Is.EqualTo(200));
            Assert.That(result.Value, Is.EqualTo(buses));
        }

        [Test]
        public void GetTrainsByProvider_ReturnsOkWithTrains()
        {
            // Arrange
            var providerId = 3;
            var trains = new List<TrainModel>
    {
        new TrainModel { TrainId = 1, TrainName = "Express1" },
        new TrainModel { TrainId = 2, TrainName = "Express2" }
    };

            _mockProviderInterface
                .Setup(p => p.GetTrainsByProvider(providerId))
                .Returns(trains);

            // Act
            var result = _controller.GetTrainsByProvider(providerId) as OkObjectResult;

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result!.StatusCode, Is.EqualTo(200));
            Assert.That(result.Value, Is.EqualTo(trains));
        }
    }
}
