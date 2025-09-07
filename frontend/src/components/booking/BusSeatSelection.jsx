import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function BusSeatSelection({ bus, bookedSeats = [], onConfirm, onClose }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const MAX_SEATS = 5;

  const toggleSeat = (seat) => {
    const isBooked = bookedSeats.find(s => parseInt(s.seatNumber) === seat);
    if (isBooked) return;
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : prev.length < MAX_SEATS
          ? [...prev, seat]
          : (toast.warning(`You can only select up to ${MAX_SEATS} seats.`), prev)
    );
  };

  const handleConfirm = () => {
    if (!selectedSeats.length) return toast.error('Please select at least one seat.');
    onConfirm(selectedSeats);
  };

  return (
    <div className="modal-backdrop">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="modal-content p-4">
        <h5>{bus.busName}</h5>
        <p><strong>From:</strong> {bus.source} → <strong>To:</strong> {bus.destination}</p>
        <p style={{ margin: '3px 0', fontSize: '0.85rem', color: '#666' }}>
          <strong>Departure:</strong> {bus.departureTime || 'N/A'} &nbsp;|&nbsp;
          <strong>Arrival:</strong> {bus.arrivalTime || 'N/A'}
        </p>
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

        <div className="scroll-container">
          <div className="seat-grid">
            {Array.from({ length: 12 }, (_, rowIndex) => {
              const baseSeat = rowIndex * 3;
              return (
                <React.Fragment key={rowIndex}>
                  {[1, 2].map(offset => {
                    const seatNumber = baseSeat + offset;
                    const bookedSeat = bookedSeats.find(s => parseInt(s.seatNumber) === seatNumber);
                    const isBooked = !!bookedSeat;
                    const isMale = bookedSeat?.gender === 'Male';
                    const isSelected = selectedSeats.includes(seatNumber);
                    let className = 'seat-btn ';

                    if (isBooked) {
                      className += isMale ? ' booked-male' : ' booked-female';
                    } else if (isSelected) {
                      className += ' selected';
                    }

                    return (
                      <button
                        key={seatNumber}
                        className={className}
                        onClick={() => toggleSeat(seatNumber)}
                        disabled={isBooked}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}

                  <div className="aisle" />

                  {(() => {
                    const seatNumber = baseSeat + 3;
                    const bookedSeat = bookedSeats.find(s => parseInt(s.seatNumber) === seatNumber);
                    const isBooked = !!bookedSeat;
                    const isMale = bookedSeat?.gender === 'Male';
                    const isSelected = selectedSeats.includes(seatNumber);
                    let className = 'seat-btn ';

                    if (isBooked) {
                      className += isMale ? ' booked-male' : ' booked-female';
                    } else if (isSelected) {
                      className += ' selected';
                    }

                    return (
                      <button
                        key={seatNumber}
                        className={className}
                        onClick={() => toggleSeat(seatNumber)}
                        disabled={isBooked}
                      >
                        {seatNumber}
                      </button>
                    );
                  })()}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <small>Select up to {MAX_SEATS} seats</small>
          <div>
            <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleConfirm} disabled={!selectedSeats.length}>
              Confirm ({selectedSeats.length})
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .scroll-container {
          max-height: 350px;
          overflow-y: auto;
          margin-top: 10px;
          padding-right: 6px;
        }
        .seat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .seat-btn {
          width: 45px; height: 45px;
          border: none; border-radius: 4px;
          cursor: pointer; font-weight: 600;
          transition: background-color 0.3s ease;
        }
        .seat-btn.booked-male {
          background: #78b9ffb4; /* blue */
          color: white;
          cursor: not-allowed;
        }
        .seat-btn.booked-female {
          background: #ff1f8fb7; /* pink */
          color: white;
          cursor: not-allowed;
        }
        .seat-btn.selected {
          background: #007bff; /* green */
          color: white;
        }
        .seat-btn:not(.booked-male):not(.booked-female):not(.selected) {
          background: #f5f5f5;
          color: #333;
        }
        .aisle {
          width: 100%;
          height: 100%;
        }
        /* Optional: Add custom scrollbar */
        .scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export default BusSeatSelection;