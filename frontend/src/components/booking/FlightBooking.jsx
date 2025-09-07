import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBookedFlightSeats,
  searchFlights,
  getFlightsForUsers
} from '../../services/bookingServices';
import FlightSeatSelection from './FlightSeatSelection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import flight_logo from '../../assets/flight.svg';
import back_icon from '../../assets/back_icon.svg';
import { FlightStations } from '../../base/cities';

const airports = FlightStations;

function FlightBooking() {
  const [formData, setFormData] = useState({
    fromAirport: '',
    toAirport: '',
    travelDate: '',
    flightType: '',
  });

  const [results, setResults] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const flights = await getFlightsForUsers();
        setAllFlights(flights);
      } catch (error) {
        toast.error("Failed to load flights.");
      }
    };
    fetchFlights();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNavigate = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fromAirport === formData.toAirport) {
      toast.warning("Departure and arrival airports cannot be the same.");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const res = await searchFlights(formData);
      setResults(res);
      if (res.length === 0) {
        toast.info("No flights found for the selected route and date.");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (flight) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return toast.error('Please log in to book a flight.');
    }

    try {
      const booked = await getBookedFlightSeats(flight.flightId);
      setSelectedFlight(flight);
      setBookedSeats(booked);
      setShowSeatSelection(true);
    } catch (error) {
      toast.error(error.message || 'Error fetching booked seats. Try again.');
    }
  };

  const handleSeatSelectionConfirm = (seats) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.warning("Please log in to continue.");
      return;
    }

    navigate('/flight-passenger-details', {
      state: {
        userId,
        flight: selectedFlight,
        seats,
        flightId: selectedFlight.flightId,
        journyStartDate: selectedFlight.departureTime,
      },
    });
  };

  const handleSeatSelectionClose = () => {
    setSelectedFlight(null);
    setShowSeatSelection(false);
    setBookedSeats([]);
  };

  const clearFilter = () => {
    setFormData({
      fromAirport: '',
      toAirport: '',
      travelDate: '',
      flightType: '',
    });
    setResults([]);
  };

  const renderFlightCards = (flights) => (
    <div className="row">
      {flights.map((flight, idx) => (
        <div key={idx} className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <img
              src={flight_logo}
              className="card-img-top"
              alt="Flight Logo"
              style={{ height: "100px", objectFit: "contain", padding: "10px" }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{flight.flightName}</h5>
              <p className="card-text mb-1"><strong>Type:</strong> {flight.flightType}</p>
              <p className="card-text mb-1"><strong>From:</strong> {flight.source}</p>
              <p className="card-text mb-1"><strong>To:</strong> {flight.destination}</p>
              <p className="card-text mb-1">
                <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: true
                })}
              </p>
              <p className="card-text mb-3">
                <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: true
                })}
              </p>
              <div className="mt-auto">
                <h5 className="text-success">₹{flight.price.toFixed(2)}</h5>
                <button className="btn btn-success w-100" onClick={() => handleBookNow(flight)}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex align-items-center gap-2 mb-4">
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
        <h2 className="text-primary">Arise - Your Sky Journey Begins Here | Book Flights</h2>
      </div>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            list="airportOptions"
            className="form-control"
            placeholder="From Airport"
            name="fromAirport"
            value={formData.fromAirport}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            list="airportOptions"
            className="form-control"
            placeholder="To Airport"
            name="toAirport"
            value={formData.toAirport}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="date"
            className="form-control"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            name="flightType"
            value={formData.flightType}
            onChange={handleChange}
            required
          >
            <option value="">Select Flight Type</option>
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first-class">First Class</option>
          </select>
        </div>

        <div className="col-12 d-flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>

          {results.length > 0 && (
            <button type="button" className="btn btn-secondary flex-fill" onClick={clearFilter}>
              Clear Filter
            </button>
          )}
        </div>
      </form>

      <datalist id="airportOptions">
        {airports.map((airport, idx) => (
          <option key={idx} value={airport} />
        ))}
      </datalist>

      <div className="mt-5">
        {results.length > 0 ? (
          <>
            <h4>Search Results:</h4>
            {renderFlightCards(results)}
          </>
        ) : (
          <>
            <h4>Available Flights:</h4>
            {renderFlightCards(allFlights)}
          </>
        )}
      </div>

      {showSeatSelection && selectedFlight && (
        <FlightSeatSelection
          flight={selectedFlight}
          bookedSeats={bookedSeats}
          onClose={handleSeatSelectionClose}
          onConfirm={handleSeatSelectionConfirm}
        />
      )}
    </div>
  );
}

export default FlightBooking;