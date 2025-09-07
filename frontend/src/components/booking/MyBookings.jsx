import React, { useEffect, useState } from 'react';
import {
  getFlightBookings,
  getTrainBookings,
  getBusBookings,
  cancelBooking
} from '../../services/bookingServices';
import { generateBookingTicketPDF } from '../../utils/TicketDownload';
import { useNavigate } from 'react-router-dom';
import back_icon from '../../assets/back_icon.svg';
import { toast, ToastContainer } from 'react-toastify';

function MyBookings() {
  const [transportType, setTransportType] = useState('flight');
  const [flightBookings, setFlightBookings] = useState([]);
  const [trainBookings, setTrainBookings] = useState([]);
  const [busBookings, setBusBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        let response;
        if (transportType === 'flight') {
          response = await getFlightBookings(userId);
          setFlightBookings(response || []);
        } else if (transportType === 'train') {
          response = await getTrainBookings(userId);
          setTrainBookings(response || []);
        } else if (transportType === 'bus') {
          response = await getBusBookings(userId);
          setBusBookings(response || []);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        if (transportType === 'flight') setFlightBookings([]);
        else if (transportType === 'train') setTrainBookings([]);
        else setBusBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [transportType, userId, reload]);

  const currentBookings =
    (transportType === 'flight'
      ? flightBookings
      : transportType === 'train'
        ? trainBookings
        : busBookings)?.slice().reverse() || [];


  const handleDownload = (booking) => {
    generateBookingTicketPDF(booking, transportType);
  };

  const handleNavigate = () => {
    navigate('/');
  };

  const confirmCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const executeCancel = async () => {
    if (!selectedBookingId) return;

    const result = await cancelBooking(transportType, selectedBookingId);
    toast.success(result.message);

    if (result.success) {
      setReload(prev => !prev);
    }

    setShowModal(false);
    setSelectedBookingId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBookingId(null);
  };

  const canCancelBooking = (journeyDateStr) => {
    if (!journeyDateStr) return false;
    const journeyDate = new Date(journeyDateStr);
    const today = new Date();
    const diffTime = journeyDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 2;
  };

  return (
    <div className="container-fluid mt-3">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div style={{ display: "flex", justifyContent: "flex-start", gap: 20 }}>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} />
        <h2 className="text-primary">My Bookings</h2>
      </div>

      <div className="form-group mb-4">
        <label htmlFor="transportType" className="form-label fw-bold">
          Transport Type:
        </label>
        <select
          id="transportType"
          className="form-select"
          value={transportType}
          onChange={(e) => setTransportType(e.target.value)}
        >
          <option value="flight">Flight</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
        </select>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : currentBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th>Booking ID</th>
                <th>{transportType.charAt(0).toUpperCase() + transportType.slice(1)} ID</th>
                <th>Seat No</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Start Journey</th>
                <th>Cancel</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking, i) => {
                const passengers =
                  booking.FlightPassengers ||
                  booking.TrainPassengers ||
                  booking.BusPassengers ||
                  [];

                const journeyStart = booking.JourneyStartTime || booking.JourneyStartDate || booking.JourneyDate;

                const isCancelable = canCancelBooking(journeyStart);

                return passengers.map((passenger, j) => (
                  <tr key={`${i}-${j}`}>
                    {j === 0 && (
                      <>
                        <td rowSpan={passengers.length}>
                          {booking.BookingId || booking.Id}
                        </td>
                        <td rowSpan={passengers.length}>
                          {booking.FlightId || booking.TrainId || booking.BusId}
                        </td>
                      </>
                    )}
                    <td>
                      {passenger.SeatNumber ||
                        booking.SeatNumbers?.[j] ||
                        'N/A'}
                    </td>
                    <td>{passenger.Name}</td>
                    <td>{passenger.Age}</td>
                    <td>{passenger.Gender}</td>
                    {j === 0 && (
                      <>
                        <td rowSpan={passengers.length}>
                          {new Date(journeyStart).toLocaleDateString()}
                        </td>
                        <td rowSpan={passengers.length}>
                          <button
                            className={`btn btn-sm ${!isCancelable ? 'btn-danger' : 'btn-outline-danger'}`}
                            disabled={!isCancelable}
                            onClick={() => {
                              // confirmCancelBooking(booking.BookingId || booking.Id);
                              if (!isCancelable) {
                                toast.error("Cancellation not allowed within 2 days of journey.");
                              } else {
                                confirmCancelBooking(booking.BookingId || booking.Id);
                              }
                            }}
                          >
                            {!isCancelable ? "Cancel Date Expired or Ended" : "Cancel"}
                          </button>
                        </td>
                        <td rowSpan={passengers.length}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              handleDownload({
                                ...booking,
                                Passengers: passengers,
                              })
                            }
                          >
                            Download Ticket
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              maxWidth: 320,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <h5>Are you sure you want to cancel this booking?</h5>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-around' }}>
              <button className="btn btn-danger" onClick={executeCancel}>
                Yes
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
