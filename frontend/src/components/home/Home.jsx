import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ProviderIndex from '../provider/ProviderIndex';
import { toast, ToastContainer } from 'react-toastify';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIsLoggedIn(true);
                setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
            } catch (err) {
                console.error("Invalid token", err);
                setIsLoggedIn(false);
                setRole(null);
            }
        }
    }, []);

    const confirmLogout = () => {
        toast.success("Logged Out Successfully!");
        localStorage.removeItem('token');
        localStorage.removeItem('providerId');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setRole(null);
        setShowLogoutConfirm(false);
        setTimeout(() => {
            navigate('/');
        }, 3000);

    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const renderSidebar = () => (
        <div className="list-group">
            <Link to="/" className="list-group-item list-group-item-action active">Dashboard</Link>

            {(!isLoggedIn || role === 'User') && (
                <>
                    {isLoggedIn && <Link to="/my-bookings" className="list-group-item list-group-item-action">My Bookings</Link>}

                    <Link to="/flights" className="list-group-item list-group-item-action">Search Flights</Link>
                    <Link to="/trains" className="list-group-item list-group-item-action">Search Trains</Link>
                    <Link to="/buses" className="list-group-item list-group-item-action">Search Buses</Link>
                    <Link to="/provider-register" className="list-group-item list-group-item-action">Register Your Own Travels</Link>
                </>
            )}
            {role === 'Provider' && (
                <>
                    <Link to="/provider-view-bookings" className="list-group-item list-group-item-action">View Bookings</Link>
                    <Link to="/provider-register" className="list-group-item list-group-item-action">Register Your Own Travels</Link>
                </>
            )}
            {role === 'SuperAdmin' && (
                <>
                    <Link to="/getallusers" className="list-group-item list-group-item-action">View Users</Link>
                    <Link to="/getallproviders" className="list-group-item list-group-item-action">Manage Providers</Link>
                    <Link to="/admin/reports" className="list-group-item list-group-item-action">Reports</Link>
                </>
            )}

            {!isLoggedIn ? (
                <button onClick={() => navigate('/login')} className="list-group-item list-group-item-action text-start">Login</button>
            ) : (
                <>
                    <Link to="/update-password" className="list-group-item list-group-item-action">Update Password</Link>
                    <button onClick={handleLogoutClick} className="list-group-item list-group-item-action text-start">Logout</button>
                </>
            )}
        </div>
    );

    return (
        <div className="container-fluid">
            <ToastContainer position="top-right" autoClose={3000} className="custom-toast" />
            <div className="bg-primary text-white p-4 mb-4">
                <h1 className="text-center">Arise Your Journey </h1>
            </div>

            <div className="row">
                <div className="col-md-3 mb-3">
                    {renderSidebar()}
                </div>

                <div className="col-md-9">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Welcome!</h5>
                            <p className="card-text">
                                {isLoggedIn
                                    ? `Logged in as ${role}. Explore your dashboard below.`
                                    : 'Please login to access features.'}
                            </p>
                        </div>
                    </div>

                    {(!isLoggedIn || role === 'User') && (
                        <>

                            <div className="card shadow mb-4 mt-4 ms-4 me-4">
                                <div className="card-header bg-primary text-white">
                                    <h4>Welcome to Arise Your Journey</h4>
                                </div>
                                <div className="card-body">
                                    <p>
                                        <strong>Arise Your Journey</strong> is your trusted partner in travel. We provide seamless, affordable, and reliable booking services for buses, trains, and flights across India. Whether you're planning a weekend getaway or a business trip, we've got you covered with real-time schedules, competitive pricing, and excellent customer support.
                                    </p>
                                    <p>
                                        Our mission is to make travel easy and accessible for everyone. With a wide network of travel providers and an easy-to-use platform, booking your journey is just a few clicks away.
                                    </p>
                                    <ul>
                                        <li>🚌 Book bus tickets from top operators across cities</li>
                                        <li>🚆 Explore train schedules and reserve your seat instantly</li>
                                        <li>✈️ Find and book affordable flights with flexible timings</li>
                                        <li>🎫 Secure payment options and instant e-ticket delivery</li>
                                        <li>🛡️ 24/7 customer support for a worry-free experience</li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}

                    {isLoggedIn && role === 'Provider' && (
                        <>
                            <ProviderIndex />
                        </>
                    )}

                    {showLogoutConfirm && (
                        <div style={modalStyles.overlay}>
                            <div style={modalStyles.modal}>
                                <h5>Confirm Logout</h5>
                                <p>Are you sure you want to logout?</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                    <button className="btn btn-secondary" onClick={cancelLogout}>Cancel</button>
                                    <button className="btn btn-danger" onClick={confirmLogout}>Logout</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        width: '320px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
};

export default Home;