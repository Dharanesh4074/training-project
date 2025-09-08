import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import back_icon from '../../assets/back_icon.svg';

function ViewBookingsForUser() {
    const { userId } = useParams();
    const [mode, setMode] = useState('train');
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        bookingDate: '',
        journeyStartDate: '',
        passengerName: '',
        passengerAge: '',
        passengerEmail: ''
    });

    const transportOptions = ['bus', 'train', 'flight'];
    const navigate = useNavigate();

    useEffect(() => {
        if (userId && mode) fetchBookings();
    }, [userId, mode]);

    useEffect(() => {
        applyFilters();
    }, [filters, bookings]);

    const handleNavigate = () => {
        navigate('/getallusers');
    };

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
            setFilters({
                bookingDate: '',
                journeyStartDate: '',
                passengerName: '',
                passengerAge: '',
                passengerEmail: ''
            });
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

    const applyFilters = () => {
        const filtered = bookings.flatMap((booking) => {
            return getPassengers(booking)
                .filter((p) => {
                    const bookingDateMatch = !filters.bookingDate || new Date(booking.bookingDate).toISOString().slice(0, 10) === filters.bookingDate;
                    const journeyDateMatch = !filters.journeyStartDate || new Date(booking.journeyStartTime).toISOString().slice(0, 10) === filters.journeyStartDate;
                    const nameMatch = p.name.toLowerCase().includes(filters.passengerName.toLowerCase());
                    const ageMatch = !filters.passengerAge || String(p.age) === filters.passengerAge;
                    const emailMatch = p.email.toLowerCase().includes(filters.passengerEmail.toLowerCase());

                    return bookingDateMatch && journeyDateMatch && nameMatch && ageMatch && emailMatch;
                })
                .map((passenger) => ({
                    bookingId: booking.id || booking.bookingId,
                    transportId: getTransportId(booking),
                    seatNumbers: booking.seatNumbers,
                    bookingDate: booking.bookingDate,
                    journeyStartTime: booking.journeyStartTime,
                    passenger
                }));
        });

        setFilteredBookings(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            bookingDate: '',
            journeyStartDate: '',
            passengerName: '',
            passengerAge: '',
            passengerEmail: ''
        });
    };

    return (
        <div className="container-fluid mt-1">
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", alignItems: "center" }} className='p-3'>
                <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
                <h2 className="text-primary">Arise - Bookings for User ID: {userId}</h2>
            </div>

            <div className="row mb-4 px-3 bg-light border rounded">
                <div className="col-md-2">
                    <label htmlFor="mode" className="form-label">Mode of Transport</label>
                    <select
                        id="mode"
                        className="form-select"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        {transportOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label">Booking Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="bookingDate"
                        value={filters.bookingDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Journey Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="journeyStartDate"
                        value={filters.journeyStartDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Passenger Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="passengerName"
                        value={filters.passengerName}
                        onChange={handleFilterChange}
                        placeholder="Enter name"
                    />
                </div>
                <div className="col-md-1">
                    <label className="form-label">Passenger Age</label>
                    <input
                        type="number"
                        className="form-control"
                        name="passengerAge"
                        value={filters.passengerAge}
                        onChange={handleFilterChange}
                        placeholder="Enter age"
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Passenger Email</label>
                    <input
                        type="text"
                        className="form-control"
                        name="passengerEmail"
                        value={filters.passengerEmail}
                        onChange={handleFilterChange}
                        placeholder="Enter email"
                    />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                    <button className="btn btn-secondary w-100" onClick={clearFilters}>Cancel Filters</button>
                </div>
            </div>

            {loading ? (
                <p className="ms-3">Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
                <p className="ms-3">No bookings found for the selected criteria.</p>
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
                                <th>Passenger Names</th>
                                <th>Ages</th>
                                <th>Genders</th>
                                <th>Emails</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => {
                                const passengers = getPassengers(booking);
                                return (
                                    <tr key={booking.bookingId}>
                                        <td>{booking.id || booking.bookingId}</td>
                                        <td>{getTransportId(booking)}</td>
                                        <td>{booking.seatNumbers?.join(', ')}</td>
                                        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                                        <td>{new Date(booking.journeyStartTime).toLocaleString()}</td>
                                        <td>
                                            {passengers.map((p, index) => (
                                                <div key={index}>{p.name}</div>
                                            ))}
                                        </td>
                                        <td>
                                            {passengers.map((p, index) => (
                                                <div key={index}>{p.age}</div>
                                            ))}
                                        </td>
                                        <td>
                                            {passengers.map((p, index) => (
                                                <div key={index}>{p.gender}</div>
                                            ))}
                                        </td>
                                        <td>
                                            {passengers.map((p, index) => (
                                                <div key={index}>{p.email}</div>
                                            ))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}

export default ViewBookingsForUser;