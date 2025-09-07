import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ isLoggedIn, role, allowedRoles, children }) => {
    if (!isLoggedIn) {
        toast.error("You must be logged in to access this page");
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        toast.error("You have no access to this page");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
