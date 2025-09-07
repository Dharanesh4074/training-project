import React, { useEffect, useState } from 'react';
import {
    searchBuses,
    getBookedBusSeats,
    getBusesForUsers
} from '../../services/bookingServices';
import bus_logo from '../../assets/bus.svg';
import BusSeatSelection from './BusSeatSelection';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import back_icon from '../../assets/back_icon.svg';
import { BusStations } from '../../base/cities';

function BusBooking() {
    const cities = BusStations;

    const [formData, setFormData] = useState({
        departureCity: '',
        arrivalCity: '',
        travelDate: '',
        busType: '',
    });

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [showSeatSelection, setShowSeatSelection] = useState(false);
    const [allBuses, setAllBuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllBuses = async () => {
            try {
                const buses = await getBusesForUsers();
                setAllBuses(buses);
            } catch (error) {
                toast.error("Failed to load buses.");
            }
        };
        fetchAllBuses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNavigate = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.departureCity === formData.arrivalCity) {
            toast.warning("Departure and arrival cannot be the same.");
            return;
        }

        setLoading(true);
        setSearchResults([]);

        try {
            const results = await searchBuses(formData);
            setSearchResults(results);

            if (results.length === 0) {
                toast.info("No buses found for the selected route and date.");
            }
        } catch (err) {
            toast.error(err.message || 'Failed to search buses.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = async (bus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return toast.error('Please login before booking.');
            }

            const booked = await getBookedBusSeats(bus.busId);
            setSelectedBus(bus);
            setBookedSeats(booked);
            setShowSeatSelection(true);
        } catch (error) {
            toast.error("Failed to fetch booked seats.");
        }
    };

    const handleSeatSelectionClose = () => {
        setShowSeatSelection(false);
        setSelectedBus(null);
        setBookedSeats([]);
    };

    const handleSeatSelectionConfirm = (seats) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.warning("Please log in to book seats.");
            return;
        }

        navigate('/bus-passenger-details', {
            state: {
                userId,
                bus: selectedBus,
                seats,
                busId: selectedBus.busId,
                journyStartDate: selectedBus.departureTime
            },
        });
    };

    const renderBusCards = (buses) => (
        <div className="row mt-4">
            {buses.map((bus, idx) => (
                <div key={idx} className="col-md-3 mb-4">
                    <div className="card h-100 shadow-sm">
                        <img
                            src={bus_logo}
                            className="card-img-top"
                            alt={bus.busName}
                            style={{ height: "100px", objectFit: "contain", padding: "10px" }}
                        />
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{bus.busName}</h5>
                            <p className="card-text mb-1"><strong>Type:</strong> {bus.busType}</p>
                            <p className="card-text mb-1"><strong>From:</strong> {bus.source}</p>
                            <p className="card-text mb-1"><strong>To:</strong> {bus.destination}</p>
                            <p className="card-text mb-1">
                                <strong>Depart:</strong> {new Date(bus.departureTime).toLocaleString('en-IN')}
                            </p>
                            <p className="card-text mb-3">
                                <strong>Arrive:</strong> {new Date(bus.arrivalTime).toLocaleString('en-IN')}
                            </p>
                            <div className="mt-auto">
                                <h5 className="text-primary">₹{bus.price.toFixed(2)}</h5>
                                <button
                                    className="btn btn-sm btn-success w-100"
                                    onClick={() => handleBookNow(bus)}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container-fluid mt-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="d-flex align-items-center gap-2 mb-4">
                <img
                    src={back_icon}
                    alt="Back"
                    onClick={handleNavigate}
                    style={{ cursor: "pointer" }}
                    width={20}
                    height={20}
                />
                <h2 className="text-primary">
                    Arise - Your Sky Journey Begins Here | Book Buses
                </h2>
            </div>

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <input
                        type="text"
                        list="cityOptions"
                        className="form-control"
                        placeholder="Departure City"
                        name="departureCity"
                        value={formData.departureCity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        list="cityOptions"
                        className="form-control"
                        placeholder="Arrival City"
                        name="arrivalCity"
                        value={formData.arrivalCity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="date"
                        className="form-control"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select"
                        name="busType"
                        value={formData.busType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Bus Type</option>
                        <option value="ac">AC Semi-Sleeper/Seater</option>
                        <option value="non-ac">Non-AC Semi-Sleeper/Seater</option>
                    </select>
                </div>
                <div className="col-12 mt-3 d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-fill" disabled={loading}>
                        {loading ? 'Searching...' : 'Search Buses'}
                    </button>

                    {searchResults.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-secondary flex-fill"
                            onClick={() => {
                                setSearchResults([]);
                                setFormData({
                                    departureCity: '',
                                    arrivalCity: '',
                                    travelDate: '',
                                    busType: '',
                                });
                            }}
                        >
                            Cancel Filter
                        </button>
                    )}
                </div>

            </form>

            <datalist id="cityOptions">
                {cities.map((city, idx) => (
                    <option key={idx} value={city} />
                ))}
            </datalist>

            {searchResults.length > 0 ? (
                <>
                    <h4 className="mt-5">Search Results:</h4>
                    {renderBusCards(searchResults)}
                </>
            ) : (
                <>
                    <h4 className="mt-5">Available Buses:</h4>
                    {renderBusCards(allBuses)}
                </>
            )}

            {showSeatSelection && selectedBus && (
                <BusSeatSelection
                    bus={selectedBus}
                    bookedSeats={bookedSeats}
                    onClose={handleSeatSelectionClose}
                    onConfirm={handleSeatSelectionConfirm}
                />
            )}
        </div>
    );
}

export default BusBooking;