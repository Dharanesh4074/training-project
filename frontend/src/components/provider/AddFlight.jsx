import React, { useState } from 'react';
import { addFlight } from '../../services/bookingServices';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import back_icon from '../../assets/back_icon.svg';
import { FlightStations } from '../../base/cities';

const cities = FlightStations;

function AddFlight() {
  const [formData, setFormData] = useState({
    flightName: '',
    flightType: 'economy',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
  });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider_id = parseInt(localStorage.getItem('providerId'));

    if (formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      toast.error('Source and destination cannot be the same.');
      return;
    }

    const departure = new Date(formData.departureTime);
    const arrival = new Date(formData.arrivalTime);

    if (departure.getTime() === arrival.getTime()) {
      toast.error('Departure and arrival times cannot be the same.');
      return;
    }

    if (arrival <= departure) {
      toast.error('Arrival time must be after departure time.');
      return;
    }

    const payload = {
      FlightName: formData.flightName,
      FlightType: formData.flightType,
      Source: formData.source,
      Destination: formData.destination,
      DepartureTime: new Date(formData.departureTime).toISOString(),
      ArrivalTime: new Date(formData.arrivalTime).toISOString(),
      Price: parseFloat(formData.price),
      ProviderId: provider_id,
    };

    try {
      const res = await addFlight(payload);
      if (res.message === 'Flight added successfully.') {
        toast.success(res.message);
        setTimeout(() => {
          navigate('/get-flight');
        }, 3000);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, alignItems: "center" }} className="mb-4">
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={25} height={25} />
        <h2 className="text-primary m-0">Add New Flight</h2>
      </div>

      <div className="card shadow-lg p-4 border-0">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Flight Name</label>
            <input type="text" name="flightName" value={formData.flightName} onChange={handleChange} required className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Flight Type</label>
            <select name="flightType" value={formData.flightType} onChange={handleChange} className="form-select">
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first-class">First Class</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Source</label>
              <select name="source" value={formData.source} onChange={handleChange} required className="form-select">
                <option value="">Select Source</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Destination</label>
              <select name="destination" value={formData.destination} onChange={handleChange} required className="form-select">
                <option value="">Select Destination</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Departure Time</label>
              <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required className="form-control" min={new Date().toISOString().slice(0, 16)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Arrival Time</label>
              <input type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required className="form-control" min={new Date().toISOString().slice(0, 16)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-control" min="0" step="0.01" />
          </div>

          <button type="submit" className="btn btn-primary w-100">Add Flight</button>
        </form>
      </div>
    </div>
  );
}

export default AddFlight;
