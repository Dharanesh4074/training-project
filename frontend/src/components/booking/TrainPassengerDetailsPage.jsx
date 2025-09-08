import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookTrainSeats } from '../../services/bookingServices';
import back_icon from '../../assets/back_icon.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TrainPassengerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, train, seats, trainId, journyStartDate } = location.state || {};

  if (!userId || !train || !seats || !trainId) {
    return <div className="container mt-4"><p>Invalid booking data.</p></div>;
  }

  const [passengers, setPassengers] = useState(
    seats.map(seat => ({
      seatNumber: seat,
      name: '',
      age: '',
      gender: '',
      email: ''
    }))
  );

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validatePassengers = () => {
    return passengers.every(p => p.name && p.age > 0 && p.age < 100 && p.gender && p.email);
  };

  const handleNavigate = () => {
    navigate('/trains');
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!validatePassengers()) {
      toast.error('Please fill all passenger details correctly.');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
      return toast.warn("Enter UPI ID.");
    }

    if (paymentMethod === 'card') {
      const { cardNumber, cardName, expiryDate, cvv } = paymentDetails;

      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        return toast.warn("Please fill all card details.");
      }

      const cardNumberClean = cardNumber.replace(/\s+/g, '');
      if (!/^\d{13,19}$/.test(cardNumberClean)) {
        return toast.warn("Please enter a valid card number.");
      }

      if (!/^[a-zA-Z\s]+$/.test(cardName)) {
        return toast.warn("Please enter a valid cardholder name.");
      }

      const expiryMatch = expiryDate.match(/^(\d{2})\/(\d{2})$/);
      if (!expiryMatch) {
        return toast.warn("Please enter a valid expiry date (MM/YY).");
      } else {
        const [_, month, year] = expiryMatch;
        const currentDate = new Date();
        const currentYear = parseInt(currentDate.getFullYear().toString().slice(-2));
        const currentMonth = currentDate.getMonth() + 1;
        const inputMonth = parseInt(month);
        const inputYear = parseInt(year);

        if (inputMonth < 1 || inputMonth > 12) {
          return toast.warn("Invalid expiry month.");
        }

        if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
          return toast.warn("Card has expired.");
        }
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        return toast.warn("Please enter a valid CVV.");
      }
    }

    const payload = {
      userId,
      trainId,
      JourneyStartTime: journyStartDate ? new Date(journyStartDate).toISOString() : null,
      seatNumbers: passengers.map(p => p.seatNumber),
      passengers: passengers.map(p => ({
        name: p.name,
        age: parseInt(p.age),
        gender: p.gender,
        email: p.email
      })),
      paymentMethod
    };

    try {
      await bookTrainSeats(payload);
      toast.success('Booking & Payment successful!');
      settime
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);
    } catch (err) {
      console.error("err", err);
      if (err.response?.status === 409) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err);
      }
    }
  };

  const totalAmount = train.price * seats.length;

  return (
    <div className="container-fluid mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar className="custom-toast" />

      <div style={{ display: "flex", justifyContent: "flex-start", gap: 20 }}>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} />
        <h2>Passenger Details for {train.trainName}</h2>
      </div>

      <form onSubmit={handleConfirm}>
        {passengers.map((p, index) => (
          <div key={index} className="card p-3 mb-3">
            <h5 className="mb-3">Seat: {p.seatNumber}</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={p.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) => handleChange(index, 'age', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={p.gender}
                  onChange={(e) => handleChange(index, 'gender', e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={p.email}
                  onChange={(e) => handleChange(index, 'email', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-success w-100">Confirm Booking</button>
      </form>

      {showPayment && (
        <div className="payment-modal">
          <div className="payment-content">
            <h4 className="mb-3">Choose Payment Method</h4>
            <div className="mb-3">
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>

            {paymentMethod === 'upi' && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter UPI ID"
                  value={paymentDetails.upiId}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, upiId: e.target.value })
                  }
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Card Number"
                    value={paymentDetails.cardNumber}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cardholder Name"
                    value={paymentDetails.cardName}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cardName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Expiry Date (MM/YY)"
                    value={paymentDetails.expiryDate}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="CVV"
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <button className="btn btn-primary w-100" onClick={handlePayment}>
              Pay ₹{totalAmount.toFixed(2)}
            </button>
            <button className="btn btn-outline-secondary mt-2 w-100" onClick={() => setShowPayment(false)}>Cancel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .payment-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .payment-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 400px;
          max-width: 90%;
        }
      `}</style>
    </div>
  );
}

export default TrainPassengerDetailsPage;
