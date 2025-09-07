import React, { useEffect, useState } from "react";
import { getFlightByProvider } from "../../services/bookingServices";
import { toast, ToastContainer } from "react-toastify";
import { updateFlightDetails, deleteFlight } from "../../services/providerServices";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import back_icon from '../../assets/back_icon.svg';

function GetFlight() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null);
  const [editingFlight, setEditingFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("providerId");
    if (!storedId) {
      toast.warning("Provider ID not found in localStorage.");
      setLoading(false);
      return;
    }
    const id = parseInt(storedId);
    setProviderId(id);
    fetchFlights(id);
  }, []);

  const fetchFlights = (id) => {
    getFlightByProvider(id)
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleEditClick = (flight) => {
    setEditingFlight({ ...flight });
    setShowModal(true);
  };

  const handleDeleteClick = (flight) => {
    setDeleteTarget(flight);
  };

  const confirmDelete = async () => {
    try {
      const message = await deleteFlight(deleteTarget.flightId);
      toast.success(message);
      setDeleteTarget(null);
      fetchFlights(providerId);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFlight((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateFlight = async () => {
    if (!editingFlight.flightType || !editingFlight.departureTime || !editingFlight.arrivalTime || !editingFlight.price) {
      toast.error("All fields are required!");
      return;
    }
    if (parseFloat(editingFlight.price) <= 0) {
      toast.error("Price must be greater than 0!");
      return;
    }

    const updateDto = {
      flightId: editingFlight.flightId,
      flightType: editingFlight.flightType,
      departureTime: editingFlight.departureTime,
      arrivalTime: editingFlight.arrivalTime,
      price: parseFloat(editingFlight.price),
    };

    try {
      const message = await updateFlightDetails(updateDto);
      toast.success(message);
      setShowModal(false);
      fetchFlights(providerId);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
  const handleNavigate = () => {
    navigate('/');
  };
  if (loading) return <div className="text-center mt-5">Loading flights...</div>;

  return (
    <div className="container-fluid p-3 bg-light text-primary">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, alignItems: "center" }} className='mb-4'>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
        <h2 className="text-center text-primary">

          Flights Added by You
        </h2>
      </div>
      <div className="bg-light p-3 rounded">
        {flights.length === 0 ? (
          <p>No flights found for provider ID {providerId}.</p>
        ) : (
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>Provider</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flightId}>
                  <td>{flight.flightName}</td>
                  <td>{flight.flightType.toUpperCase()}</td>
                  <td>{flight.source} → {flight.destination}</td>
                  <td>{new Date(flight.departureTime).toLocaleString()}</td>
                  <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                  <td>₹{flight.price}</td>
                  <td>{flight.provider?.providerName} ({flight.provider?.providerOrganization})</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(flight)}>Update</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(flight)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && editingFlight && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Flight</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>Flight Type</label>
                <select className="form-select mb-2" name="flightType" value={editingFlight.flightType} onChange={handleInputChange}>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first-class">First Class</option>
                </select>
                <label>Departure Time</label>
                <input className="form-control mb-2" type="datetime-local" name="departureTime"
                  value={new Date(editingFlight.departureTime).toISOString().slice(0, -1)}
                  onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
                <label>Arrival Time</label>
                <input className="form-control mb-2" type="datetime-local" name="arrivalTime"
                  value={new Date(editingFlight.arrivalTime).toISOString().slice(0, -1)}
                  onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
                <label>Price</label>
                <input className="form-control" type="number" name="price" value={editingFlight.price} onChange={handleInputChange} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleUpdateFlight}>Update</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{deleteTarget.flightName}</strong>?
              </div>
              <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GetFlight;
