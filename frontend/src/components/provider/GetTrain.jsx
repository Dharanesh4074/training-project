import React, { useEffect, useState } from "react";
import { getTrainsByProvider } from "../../services/bookingServices";
import { toast, ToastContainer } from "react-toastify";
import { updateTrainDetails, deleteTrain } from "../../services/providerServices";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import back_icon from '../../assets/back_icon.svg';

function GetTrain() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerId, setProviderId] = useState(null);
  const [editingTrain, setEditingTrain] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [filterDepartureDate, setFilterDepartureDate] = useState("");
  const [filterArrivalDate, setFilterArrivalDate] = useState("");

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
    fetchTrains(id);
  }, []);

  const fetchTrains = (id) => {
    getTrainsByProvider(id)
      .then((data) => {
        setTrains(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleEditClick = (train) => {
    setEditingTrain({ ...train });
    setShowModal(true);
  };

  const handleDeleteClick = (train) => {
    setDeleteTarget(train);
  };

  const confirmDelete = async () => {
    try {
      const message = await deleteTrain(deleteTarget.trainId);
      toast.success(message);
      setDeleteTarget(null);
      fetchTrains(providerId);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTrain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTrain = async () => {
    if (!editingTrain.trainType || !editingTrain.departureTime || !editingTrain.arrivalTime || !editingTrain.price) {
      toast.error("All fields are required!");
      return;
    }
    if (parseFloat(editingTrain.price) <= 0) {
      toast.error("Price must be greater than 0!");
      return;
    }

    const updateDto = {
      trainId: editingTrain.trainId,
      trainType: editingTrain.trainType,
      departureTime: editingTrain.departureTime,
      arrivalTime: editingTrain.arrivalTime,
      price: parseFloat(editingTrain.price),
    };

    try {
      const message = await updateTrainDetails(updateDto);
      toast.success(message);
      setShowModal(false);
      fetchTrains(providerId);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleNavigate = () => {
    navigate('/');
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterSource("");
    setFilterDestination("");
    setFilterDepartureDate("");
    setFilterArrivalDate("");
  };

  const filteredTrains = trains.filter((train) => {
    const departureDateStr = new Date(train.departureTime).toISOString().slice(0, 10);
    const arrivalDateStr = new Date(train.arrivalTime).toISOString().slice(0, 10);

    return (
      (!filterName || train.trainName.toLowerCase().includes(filterName.toLowerCase())) &&
      (!filterSource || train.source.toLowerCase().includes(filterSource.toLowerCase())) &&
      (!filterDestination || train.destination.toLowerCase().includes(filterDestination.toLowerCase())) &&
      (!filterDepartureDate || departureDateStr === filterDepartureDate) &&
      (!filterArrivalDate || arrivalDateStr === filterArrivalDate)
    );
  });

  if (loading) return <div className="text-center mt-5">Loading trains...</div>;

  return (
    <div className="container-fluid p-3 bg-light text-primary">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div
        style={{ display: "flex", justifyContent: "flex-start", gap: 10, alignItems: "center" }}
        className="mb-4"
      >
        <img
          src={back_icon}
          alt="Back"
          onClick={handleNavigate}
          style={{ cursor: "pointer" }}
          width={20}
          height={20}
        />
        <h2 className="text-center text-primary">Trains Added by You</h2>
      </div>

      <div className="bg-white p-3 rounded mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label htmlFor="filterName" className="form-label">Train Name</label>
            <input
              id="filterName"
              type="text"
              className="form-control"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter train name"
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="filterSource" className="form-label">Source</label>
            <input
              id="filterSource"
              type="text"
              className="form-control"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              placeholder="Enter source"
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="filterDestination" className="form-label">Destination</label>
            <input
              id="filterDestination"
              type="text"
              className="form-control"
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
              placeholder="Enter destination"
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="filterDepartureDate" className="form-label">Departure Date</label>
            <input
              id="filterDepartureDate"
              type="date"
              className="form-control"
              value={filterDepartureDate}
              onChange={(e) => setFilterDepartureDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="filterArrivalDate" className="form-label">Arrival Date</label>
            <input
              id="filterArrivalDate"
              type="date"
              className="form-control"
              value={filterArrivalDate}
              onChange={(e) => setFilterArrivalDate(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex justify-content-start">
            <label htmlFor="" className="invisible">cancel</label>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Cancel Filters
            </button>
          </div>
        </div>
      </div>

     <div className="bg-light p-3 rounded">
        {filteredTrains.length === 0 ? (
          <p>No trains found matching your criteria.</p>
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
              {filteredTrains.map((train) => (
                <tr key={train.trainId}>
                  <td>{train.trainName}</td>
                  <td>{train.trainType.toUpperCase()}</td>
                  <td>{train.source} → {train.destination}</td>
                  <td>{new Date(train.departureTime).toLocaleString()}</td>
                  <td>{new Date(train.arrivalTime).toLocaleString()}</td>
                  <td>₹{train.price}</td>
                  <td>
                    {train.provider?.providerName} (
                    {train.provider?.providerOrganization})
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditClick(train)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(train)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

     {showModal && editingTrain && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Train</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label>Train Type</label>
                <select
                  className="form-select mb-2"
                  name="trainType"
                  value={editingTrain.trainType}
                  onChange={handleInputChange}
                >
                  <option value="express">Express</option>
                  <option value="superfast">Superfast</option>
                  <option value="local">Local</option>
                </select>
                <label>Departure Time</label>
                <input
                  className="form-control mb-2"
                  type="datetime-local"
                  name="departureTime"
                  value={new Date(editingTrain.departureTime).toISOString().slice(0, -1)}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <label>Arrival Time</label>
                <input
                  className="form-control mb-2"
                  type="datetime-local"
                  name="arrivalTime"
                  value={new Date(editingTrain.arrivalTime).toISOString().slice(0, -1)}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <label>Price</label>
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  value={editingTrain.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleUpdateTrain}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
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
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteTarget(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.trainName}</strong>?
              </div>
              <div
                className="modal-footer"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Yes, Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetTrain;