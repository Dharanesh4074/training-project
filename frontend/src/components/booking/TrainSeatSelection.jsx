import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const compartmentCount = 5;
const seatTypes = ['L', 'M', 'U', 'SL', 'SU'];
const seatsPerType = 5;

const generateCompartmentSeats = () => {
  const compartments = [];
  for (let c = 1; c <= compartmentCount; c++) {
    const compartment = `C${c}`;
    const seats = [];
    for (let i = 1; i <= seatsPerType; i++) {
      seatTypes.forEach(type => seats.push(`${compartment}${type}${i}`));
    }
    compartments.push({ name: compartment, seats });
  }
  return compartments;
};

const getBookedSeatColor = (gender) => {
  if (gender === 'Male') return '#78b9ffb4';
  if (gender === 'Female') return '#ff1f8fab';
  return '#6c757d';
};

function TrainSeatSelection({ train, bookedSeats = [], onClose, onConfirm }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const compartments = generateCompartmentSeats();

  const isBooked = (seatNumber) => {
    return bookedSeats.find(s => s.seatNumber === seatNumber);
  };

  const handleSelect = (seat) => {
    const booked = isBooked(seat);
    if (booked) return;
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return toast.warn("Please select at least one seat.");
    onConfirm(selectedSeats);
  };

  return (
    <div style={styles.overlay} className="bg-light">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div style={styles.modal} className="bg-white shadow rounded p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Train: {train.trainName}</h5>
          <div className="mt-4 mb-3 d-flex flex-wrap gap-3 align-items-center">
            <div className="d-flex align-items-center">
              <div style={{ backgroundColor: '#78b9ffb4', width: 20, height: 20, marginRight: 6, borderRadius: 60 }} /> <span>Booked (Male)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ backgroundColor: '#ff1f8fab', width: 20, height: 20, marginRight: 6, borderRadius: 60 }} /> <span>Booked (Female)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ backgroundColor: '#ccc', width: 20, height: 20, marginRight: 6, borderRadius: 60 }} /> <span>Available</span>
            </div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={onClose}>X</button>

        </div>

        <h6 className="mb-3">Select Your Seats</h6>

        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {compartments.map(comp => (
            <div key={comp.name} className="mb-3">
              <h6>{comp.name}</h6>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {comp.seats.map(seat => {
                  const booked = isBooked(seat);
                  const isSelected = selectedSeats.includes(seat);
                  const backgroundColor = booked
                    ? getBookedSeatColor(booked.gender)
                    : isSelected
                      ? '#28a745'
                      : '#f8f9fa';

                  const textColor = booked || isSelected ? '#fff' : '#000';

                  return (
                    <div
                      key={seat}
                      onClick={() => handleSelect(seat)}
                      style={{
                        padding: '8px',
                        backgroundColor,
                        border: '1px solid #ccc',
                        cursor: booked ? 'not-allowed' : 'pointer',
                        color: textColor,
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        userSelect: 'none',
                      }}
                      title={booked ? `Booked (${booked.gender})` : 'Available'}
                    >
                      {seat}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={handleConfirm}>
            Confirm ({selectedSeats.length})
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1050,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f8f9fa73',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
  }
};

export default TrainSeatSelection;
