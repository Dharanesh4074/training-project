import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const MAX_SEATS = 6;
const TOTAL_SEATS = 100;

function FlightSeatSelection({ flight, bookedSeats = [], onClose, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    const isBooked = bookedSeats.find(s => parseInt(s.seatNumber) === seat);
    if (isBooked) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat));
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        toast.warning(`You can only select up to ${MAX_SEATS} seats.`);
      } else {
        setSelectedSeats(prev => [...prev, seat]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat.');
      return;
    }
    onConfirm(selectedSeats);
  };

  const renderSeat = (seat) => {
    const bookedSeat = bookedSeats.find(s => parseInt(s.seatNumber) === seat);
    const isBooked = !!bookedSeat;
    const isMale = bookedSeat?.gender === 'Male';
    const isSelected = selectedSeats.includes(seat);

    let bgColor = '#f0f0f0';
    let color = '#000';
    if (isBooked) {
      bgColor = isMale ? '#78b9ffb4' : '#ff1f8fb7';
      color = '#fff';
    } else if (isSelected) {
      bgColor = '#007bff';
      color = '#fff';
    }

    return (
      <button
        key={seat}
        className="seat-button"
        disabled={isBooked}
        onClick={() => toggleSeat(seat)}
        style={{
          width: '35px',
          height: '35px',
          margin: '3px',
          backgroundColor: bgColor,
          color: color,
          border: '1px solid #999',
          borderRadius: '4px',
          cursor: isBooked ? 'not-allowed' : 'pointer',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
        title={`Seat ${seat}${isBooked ? ` (${bookedSeat.gender})` : ''}`}
      >
        {seat}
      </button>
    );
  };

  const renderSeatRows = () => {
    const rows = 25;
    const colsPerSide = 2;

    const seats = Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1);
    const leftSeats = seats.slice(0, TOTAL_SEATS / 2);
    const rightSeats = seats.slice(TOTAL_SEATS / 2);

    const renderSide = (seatArray) => {
      const seatRows = [];
      for (let r = 0; r < rows; r++) {
        const row = seatArray.slice(r * colsPerSide, r * colsPerSide + colsPerSide);
        seatRows.push(
          <div key={r} style={{ display: 'flex', marginBottom: '6px' }}>
            {row.map(renderSeat)}
          </div>
        );
      }
      return seatRows;
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
        <div>{renderSide(leftSeats)}</div>
        <div style={{ width: '40px' }} />
        <div>{renderSide(rightSeats)}</div>
      </div>
    );
  };

  return (
    <div className="seat-selection-modal">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="modal-content">
        <h3>Select Seats for {flight.flightName}</h3>
        <p><strong>From:</strong> {flight.source} &nbsp;&nbsp; <strong>To:</strong> {flight.destination}</p>
        <p><strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
        <div className="mt-4 mb-3 d-flex flex-wrap gap-3 align-items-center">
          <div className="d-flex align-items-center">
            <div style={{ backgroundColor: '#78b9ffb4', width: 20, height: 20, marginRight: 6, borderRadius: 60 }} /> <span>Booked (Male)</span>
          </div>
          <div className="d-flex align-items-center">
            <div style={{ backgroundColor: '#ff1f8fb7', width: 20, height: 20, marginRight: 6, borderRadius: 60 }} /> <span>Booked (Female)</span>
          </div>
          <div className="d-flex align-items-center">
            <div style={{ backgroundColor: '#ccc', width: 20, height: 20, marginRight: 6, borderRadius: 60 }} /> <span>Available</span>
          </div>
        </div>
        {renderSeatRows()}

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <p><strong>Selected:</strong> {selectedSeats.join(', ') || 'None'}</p>
          <div>
            <button className="btn btn-success me-2" onClick={handleConfirm} disabled={!selectedSeats.length}>
              Confirm Seats
            </button>
            <button className="btn btn-outline-danger" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>


      <style jsx>{`
        .seat-selection-modal {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          max-height: 90vh;
          overflow-y: auto;
          width: 90%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}

export default FlightSeatSelection;
