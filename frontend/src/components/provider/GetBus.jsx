import React, { useEffect, useState } from "react";
import { getBusesByProvider } from "../../services/bookingServices";
import { toast, ToastContainer } from "react-toastify";
import { updateBusDetails, deleteBus } from "../../services/providerServices";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import back_icon from '../../assets/back_icon.svg';

function GetBus() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null);
  const [editingBus, setEditingBus] = useState(null);
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
    fetchBuses(id);
  }, []);

  const fetchBuses = (id) => {
    getBusesByProvider(id)
      .then((data) => {
        setBuses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleEditClick = (bus) => {
    setEditingBus({ ...bus });
    setShowModal(true);
  };

  const handleDeleteClick = (bus) => {
    setDeleteTarget(bus);
  };

  const confirmDelete = async () => {
    try {
      const message = await deleteBus(deleteTarget.busId);
      toast.success(message || "Bus deleted successfully");
      setDeleteTarget(null);
      fetchBuses(providerId);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBus = async () => {
    if (!editingBus.busType || !editingBus.departureTime || !editingBus.arrivalTime || !editingBus.price) {
      toast.error("All fields are required!");
      return;
    }
    if (parseFloat(editingBus.price) <= 0) {
      toast.error("Price must be greater than 0!");
      return;
    }

    const updateDto = {
      busId: editingBus.busId,
      busType: editingBus.busType,
      departureTime: editingBus.departureTime,
      arrivalTime: editingBus.arrivalTime,
      price: parseFloat(editingBus.price),
    };

    try {
      const message = await updateBusDetails(updateDto);
      toast.success(message || "Bus updated successfully");
      setShowModal(false);
      fetchBuses(providerId);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
  const handleNavigate = () => {
    navigate('/');
  };

  if (loading) return <div className="text-center mt-5">Loading buses...</div>;

  return (
    <div className="container-fluid p-3 bg-light text-primary">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, alignItems: "center" }} className='mb-4'>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
        <h2 className="text-center text-primary">

          Busses Added by You
        </h2>
      </div>
      <div className="bg-light p-3 rounded">
        {buses.length === 0 ? (
          <p>No buses found for provider ID {providerId}.</p>
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
              {buses.map((bus) => (
                <tr key={bus.busId}>
                  <td>{bus.busName}</td>
                  <td>{bus.busType.toUpperCase()}</td>
                  <td>{bus.source} → {bus.destination}</td>
                  <td>{new Date(bus.departureTime).toLocaleString()}</td>
                  <td>{new Date(bus.arrivalTime).toLocaleString()}</td>
                  <td>₹{bus.price}</td>
                  <td>{bus.provider?.providerName} ({bus.provider?.providerOrganization})</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(bus)}>Update</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(bus)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && editingBus && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Bus</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>Bus Type</label>
                <select className="form-select mb-2" name="busType" value={editingBus.busType} onChange={handleInputChange}>
                  <option value="ac">AC</option>
                  <option value="non-ac">Non-AC</option>
                  <option value="sleeper">Sleeper</option>
                </select>
                <label>Departure Time</label>
                <input className="form-control mb-2" type="datetime-local" name="departureTime"
                  value={new Date(editingBus.departureTime).toISOString().slice(0, -1)}
                  onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
                <label>Arrival Time</label>
                <input className="form-control mb-2" type="datetime-local" name="arrivalTime"
                  value={new Date(editingBus.arrivalTime).toISOString().slice(0, -1)}
                  onChange={handleInputChange} min={new Date().toISOString().slice(0, 16)} />
                <label>Price</label>
                <input className="form-control" type="number" name="price" value={editingBus.price} onChange={handleInputChange} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleUpdateBus}>Update</button>
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
                Are you sure you want to delete <strong>{deleteTarget.busName}</strong>?
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

export default GetBus;