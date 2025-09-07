import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import back_icon from '../../assets/back_icon.svg';

function ViewBookingsForUser() {
    const { userId } = useParams();
    const [mode, setMode] = useState('train');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const transportOptions = ['bus', 'train', 'flight'];

    useEffect(() => {
        if (userId && mode) {
            fetchBookings();
        }
    }, [userId, mode]);

    const getApiUrl = () => {
        switch (mode) {
            case 'bus':
                return '/SuperAdmin/GetBusBookingsForUser';
            case 'train':
                return '/SuperAdmin/GetTrainBookingsForUser';
            case 'flight':
                return '/SuperAdmin/GetFlightBookingsForUser';
            default:
                return '';
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            const url = `http://localhost:5267${getApiUrl()}`;

            const response = await axios.get(url, {
                params: { userId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookings(response.data.reverse());
        } catch (error) {
            toast.error('Failed to fetch bookings');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getPassengers = (booking) => {
        if (mode === 'train') return booking.trainPassengers || [];
        if (mode === 'bus') return booking.busPassengers || [];
        if (mode === 'flight') return booking.flightPassengers || [];
        return [];
    };

    const getTransportId = (booking) => {
        if (mode === 'train') return booking.trainId;
        if (mode === 'bus') return booking.busId;
        if (mode === 'flight') return booking.flightId;
        return '-';
    };
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/getallusers');
    }

    return (
        <div className="container-fluid mt-1">
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", alignItems: "center" }} className='p-3'>
                <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
                <h2 className="text-center text-primary">

                    Arise - Bookings for User ID: {userId}
                </h2>
            </div>
            <h2 className="mb-4 text-primary"></h2>

            <div className="mb-4">
                <label htmlFor="mode" className="form-label">
                    Select Mode of Transport:
                </label>
                <select
                    id="mode"
                    className="form-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    {transportOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <p>No bookings found for this mode.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th>Booking ID</th>
                                <th>Transport ID</th>
                                <th>Seat Numbers</th>
                                <th>Booking Date</th>
                                <th>Journey Start Time</th>
                                <th>Passengers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.id ? booking.id : booking.bookingId}</td>
                                    <td>{getTransportId(booking)}</td>
                                    <td>{booking.seatNumbers.join(', ')}</td>
                                    <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                                    <td>{new Date(booking.journeyStartTime).toLocaleString()}</td>
                                    <td>
                                        <ul className="list-unstyled mb-0">
                                            {getPassengers(booking).map((p) => (
                                                <li key={p.id}>
                                                    {p.name} ({p.age}, {p.gender}) - {p.email}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ViewBookingsForUser;
