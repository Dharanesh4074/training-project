import React, { useState, useEffect } from 'react';
import {
  searchTrains,
  getBookedTrainSeats,
  getTrainsForUsers,
} from '../../services/bookingServices';
import train_logo from '../../assets/train.svg';
import TrainSeatSelection from './TrainSeatSelection';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import back_icon from '../../assets/back_icon.svg';
import { trainStations } from '../../base/cities';

function TrainBooking() {
  const stations = trainStations;

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    travelDate: '',
    trainType: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [allTrains, setAllTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const trains = await getTrainsForUsers();
        setAllTrains(trains);
      } catch (err) {
        toast.error("Failed to load trains.");
      }
    };
    fetchTrains();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNavigate = () => navigate('/');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.source === formData.destination) {
      toast.warning("Source and destination cannot be the same.");
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      const results = await searchTrains(formData);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info("No trains found for the selected route, type and date.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch trains.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (train) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return toast.error('Please login before booking.');
      }

      const booked = await getBookedTrainSeats(train.trainId);
      setSelectedTrain(train);
      setBookedSeats(booked);
      setShowSeatSelection(true);
    } catch (error) {
      toast.error("Failed to fetch booked seats. Please try again.");
    }
  };

  const handleSeatSelectionClose = () => {
    setShowSeatSelection(false);
    setSelectedTrain(null);
    setBookedSeats([]);
  };

  const handleSeatSelectionConfirm = (selectedSeats) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.warning("Please log in to book seats.");
      return;
    }

    navigate('/train-passenger-details', {
      state: {
        userId,
        train: selectedTrain,
        seats: selectedSeats,
        trainId: selectedTrain.trainId,
        journyStartDate: selectedTrain.departureTime,
      },
    });
  };

  const clearFilter = () => {
    setFormData({
      source: '',
      destination: '',
      travelDate: '',
      trainType: '',
    });
    setSearchResults([]);
  };

  const renderTrainCards = (trains) => (
    <div className="row mt-4">
      {trains.map((train, idx) => (
        <div key={idx} className="col-md-3 mb-4">
          <div className="card h-100 shadow-sm">
            <img
              src={train_logo}
              className="card-img-top"
              alt={train.trainName}
              style={{ height: "100px", objectFit: "contain", padding: "10px" }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{train.trainName}</h5>
              <p className="card-text mb-1"><strong>From:</strong> {train.source}</p>
              <p className="card-text mb-1"><strong>To:</strong> {train.destination}</p>
              <p className="card-text mb-1"><strong>Depart:</strong> {new Date(train.departureTime).toLocaleString('en-IN')}</p>
              <p className="card-text mb-3"><strong>Arrive:</strong> {new Date(train.arrivalTime).toLocaleString('en-IN')}</p>
              <div className="mt-auto">
                <h5 className="text-primary">₹{train.price.toFixed(2)}</h5>
                <button
                  className="btn btn-sm btn-success w-100"
                  onClick={() => handleBookNow(train)}
                >
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
        <img
          src={back_icon}
          alt="Back"
          onClick={handleNavigate}
          style={{ cursor: "pointer" }}
          width={20}
          height={20}
        />
        <h2 className="text-primary">
          Arise - Your Rail Journey Begins Here | Book Trains
        </h2>
      </div>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            list="cityOptions"
            className="form-control"
            placeholder="From Station"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            list="cityOptions"
            className="form-control"
            placeholder="To Station"
            name="destination"
            value={formData.destination}
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
            name="trainType"
            value={formData.trainType}
            onChange={handleChange}
            required
          >
            <option value="">Select Train Type</option>
            <option value="express">Express</option>
            <option value="superfast">Superfast</option>
            <option value="local">Local</option>
          </select>
        </div>
        <div className="col-12 d-flex gap-2 mt-2">
          <button
            className="btn btn-primary flex-fill"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Trains'}
          </button>

          {searchResults.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary flex-fill"
              onClick={clearFilter}
            >
              Clear Filter
            </button>
          )}
        </div>
      </form>

      <datalist id="cityOptions">
        {stations.map((station, idx) => (
          <option key={idx} value={station} />
        ))}
      </datalist>

      {searchResults.length > 0 ? (
        <>
          <h4 className="mt-5">Search Results:</h4>
          {renderTrainCards(searchResults)}
        </>
      ) : (
        <>
          <h4 className="mt-5">Available Trains:</h4>
          {renderTrainCards(allTrains)}
        </>
      )}

      {showSeatSelection && selectedTrain && (
        <TrainSeatSelection
          train={selectedTrain}
          bookedSeats={bookedSeats}
          onClose={handleSeatSelectionClose}
          onConfirm={handleSeatSelectionConfirm}
        />
      )}
    </div>
  );
}

export default TrainBooking;