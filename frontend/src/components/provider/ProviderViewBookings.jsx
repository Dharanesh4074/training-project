import React, { useEffect, useState } from 'react';
import {
  getBusesByProvider,
  getTrainsByProvider,
  getFlightByProvider,
} from '../../services/bookingServices';
import { getBookingSummary } from '../../services/providerServices';
import { downloadProviderPDFReport } from '../../utils/ProviderReport';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import back_icon from '../../assets/back_icon.svg';

function ProviderViewBookings() {
  const [transportType, setTransportType] = useState('bus');
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [error, setError] = useState(null);
  const [filterDeparture, setFilterDeparture] = useState('');
  const [filterArrival, setFilterArrival] = useState('');

  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('providerId');
    if (storedId) {
      setProviderId(parseInt(storedId));
    } else {
      toast.warning('Provider ID not found in localStorage.');
    }
  }, []);

  useEffect(() => {
    if (providerId) {
      fetchBookings();
    }
  }, [transportType, providerId]);

  useEffect(() => {
    applyFilters();
  }, [bookings, filterFrom, filterTo]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (transportType === 'bus') {
        data = await getBusesByProvider(providerId);
      } else if (transportType === 'train') {
        data = await getTrainsByProvider(providerId);
      } else if (transportType === 'flight') {
        data = await getFlightByProvider(providerId);
      }
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = bookings.filter((item) => {
      const fromMatch = item.source.toLowerCase().includes(filterFrom.toLowerCase());
      const toMatch = item.destination.toLowerCase().includes(filterTo.toLowerCase());
      return fromMatch && toMatch;
    });
    setFilteredBookings(filtered);
  };

  const clearFilters = () => {
    setFilterFrom('');
    setFilterTo('');
  };

  const handleViewBookings = async (transportId) => {
    try {
      const data = await getBookingSummary(transportId, transportType);
      setSelectedBookingDetails(data);
      setShowModal(true);
    } catch (err) {
      toast.error('Failed to load booking summary.');
    }
  };

  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, alignItems: 'center' }} className="mb-4">
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: 'pointer' }} width={20} height={20} />
        <h2 className="text-center text-primary">
          Provider Booking Dashboard | View and manage your transport bookings
        </h2>
      </div>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-3">
          <label className="form-label fw-bold">Transport Type:</label>
          <select
            className="form-select"
            value={transportType}
            onChange={(e) => setTransportType(e.target.value)}
          >
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="flight">Flight</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">From (Source):</label>
          <input
            type="text"
            className="form-control"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            placeholder="Enter source"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">To (Destination):</label>
          <input
            type="text"
            className="form-control"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            placeholder="Enter destination"
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="" className="invisible">cancel</label>
          <button className="btn btn-secondary w-100" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <div className="text-center mt-4">Loading bookings...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredBookings.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>Provider</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((item) => {
                const selected =
                  selectedBookingDetails?.transportId === item[`${transportType}Id`];
                const revenue =
                  selectedBookingDetails && selected
                    ? selectedBookingDetails.bookedCount * item.price
                    : '-';

                return (
                  <tr key={item[`${transportType}Id`]}>
                    <td>{item[`${transportType}Id`]}</td>
                    <td>{item[`${transportType}Name`]}</td>
                    <td>{item.source}</td>
                    <td>{item.destination}</td>
                    <td>{formatDateTime(item.departureTime)}</td>
                    <td>{formatDateTime(item.arrivalTime)}</td>
                    <td>₹{item.price}</td>
                    <td>
                      {item.provider?.providerName} (
                      {item.provider?.providerOrganization})
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={async () => {
                          const transportId = item[`${transportType}Id`];
                          const transportName = item[`${transportType}Name`];

                          if (
                            selectedBookingDetails &&
                            selectedBookingDetails.transportId === transportId
                          ) {
                            downloadProviderPDFReport(
                              transportId,
                              transportType,
                              transportName,
                              item.source,
                              item.destination,
                              selectedBookingDetails.bookings,
                              item.price
                            );
                          } else {
                            try {
                              const data = await getBookingSummary(transportId, transportType);
                              setSelectedBookingDetails(data);

                              downloadProviderPDFReport(
                                transportId,
                                transportType,
                                transportName,
                                item.source,
                                item.destination,
                                data.bookings,
                                item.price
                              );
                            } catch (err) {
                              toast.error('Failed to load booking summary for report.');
                            }
                          }
                        }}
                      >
                        Download Report
                      </button>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleViewBookings(item[`${transportType}Id`])}
                      >
                        View Bookings
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredBookings.length === 0 && (
        <div className="alert alert-info">
          No matching {transportType} bookings found for provider ID {providerId}.
        </div>
      )}

      {selectedBookingDetails && showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {selectedBookingDetails.transportType.toUpperCase()} Booking Summary
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {(() => {
                  const matched = bookings.find(
                    (b) => b[`${transportType}Id`] === selectedBookingDetails.transportId
                  );
                  const revenue =
                    matched && selectedBookingDetails
                      ? selectedBookingDetails.bookedCount * matched.price
                      : 0;

                  return (
                    <div className="mb-3 border p-3 bg-light rounded">
                      <p>
                        <strong>Transport Name:</strong> {matched?.[`${transportType}Name`]} <br />
                        <strong>Route:</strong> {matched?.source} → {matched?.destination} <br />
                        <strong>Total Revenue:</strong> ₹{revenue}
                      </p>
                    </div>
                  );
                })()}

                <p>
                  <strong>Transport ID:</strong> {selectedBookingDetails.transportId} <br />
                  <strong>Total Capacity:</strong> {selectedBookingDetails.totalCapacity} <br />
                  <strong>Booked Seats:</strong> {selectedBookingDetails.bookedCount} <br />
                  <strong>Male Passengers:</strong>{' '}
                  {selectedBookingDetails.bookings.filter(b => b.gender.toLowerCase() === 'male').length} <br />
                  <strong>Female Passengers:</strong>{' '}
                  {selectedBookingDetails.bookings.filter(b => b.gender.toLowerCase() === 'female').length}
                </p>

                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-primary">
                      <tr>
                        <th>Seat Number</th>
                        <th>Passenger Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBookingDetails.bookings.map((b, idx) => (
                        <tr key={idx}>
                          <td>{b.seatNumber}</td>
                          <td>{b.passengerName}</td>
                          <td>{b.age}</td>
                          <td>{b.gender}</td>
                          <td>{b.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderViewBookings;