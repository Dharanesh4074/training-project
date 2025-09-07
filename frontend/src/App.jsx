import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/home/Home';
import FlightBooking from './components/booking/FlightBooking';
import TrainBooking from './components/booking/TrainBooking';
import BusBooking from './components/booking/BusBooking';
import NotFound from './components/notFound/NotFound';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import AddBus from './components/provider/AddBus';
import GetBus from './components/provider/GetBus';
import ProviderRegister from './components/provider/ProviderRegister';
import GetAllProviders from './components/superAdmin/GetAllProviders';
import GetAllUsers from './components/superAdmin/GetAllUsers';
import AddFlight from './components/provider/AddFlight';
import AddTrain from './components/provider/AddTrain';
import TrainSeatSelection from './components/booking/TrainSeatSelection';
import TrainPassengerDetailsPage from './components/booking/TrainPassengerDetailsPage';
import GetFlight from './components/provider/GetFlight';
import GetTrain from './components/provider/GetTrain';
import FlightSeatSelection from './components/booking/FlightSeatSelection';
import BusPassengerDetailsPage from './components/booking/BusPassengerDetailsPage';
import BusSeatSelection from './components/booking/BusSeatSelection';
import FlightPassengerDetailsPage from './components/booking/FlightPassengerDetailsPage';
import MyBookings from './components/booking/MyBookings';
import { jwtDecode } from 'jwt-decode';
import ProviderViewBookings from './components/provider/ProviderViewBookings';
import PasswordUpdate from './components/updatePassword/PasswordUpdate';
import AdminReports from './components/superAdmin/AdminReports';
import ViewBookingsForUser from './components/superAdmin/ViewBookingsForUser';
import PrivateRoute from './PrivateRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setIsLoggedIn(true);
        setRole(userRole);
      } catch (err) {
        console.error("Invalid token", err);
        setIsLoggedIn(false);
        setRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/provider-register" element={<ProviderRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flights" element={<FlightBooking />} />
        <Route path="/trains" element={<TrainBooking />} />
        <Route path="/buses" element={<BusBooking />} />
        <Route path="/update-password" element={<PasswordUpdate />} />
        {/* User routes */}
        <Route
          path="/train-seat-selection"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <TrainSeatSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/bus-seat-selection"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <BusSeatSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/flight-seat-selection"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <FlightSeatSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/train-passenger-details"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <TrainPassengerDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bus-passenger-details"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <BusPassengerDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/flight-passenger-details"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <FlightPassengerDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User']}>
              <MyBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['User', 'Provider', 'SuperAdmin']}>
              <PasswordUpdate />
            </PrivateRoute>
          }
        />

        {/* Provider routes */}
        <Route
          path="/add-bus"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <AddBus />
            </PrivateRoute>
          }
        />
        <Route
          path="/get-bus"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <GetBus />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-flight"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <AddFlight />
            </PrivateRoute>
          }
        />
        <Route
          path="/get-flight"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <GetFlight />
            </PrivateRoute>
          }
        />
        <Route
          path="/get-train"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <GetTrain />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-train"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <AddTrain />
            </PrivateRoute>
          }
        />
        <Route
          path="/Provider-view-bookings"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['Provider']}>
              <ProviderViewBookings />
            </PrivateRoute>
          }
        />

        {/* SuperAdmin routes */}
        <Route
          path="/getallproviders"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['SuperAdmin']}>
              <GetAllProviders />
            </PrivateRoute>
          }
        />
        <Route
          path="/getallusers"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['SuperAdmin']}>
              <GetAllUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['SuperAdmin']}>
              <AdminReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-bookings/:userId"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn} userRole={role} allowedRoles={['SuperAdmin']}>
              <ViewBookingsForUser />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;