import React from 'react';
import { Navigate } from 'react-router-dom';
import NoAccess from './components/notFound/NoAccess';

const PrivateRoute = ({ isLoggedIn, userRole, allowedRoles, children }) => {
  // console.log(isLoggedIn, userRole, allowedRoles, children);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <NoAccess />;
  }

  return children;
};

export default PrivateRoute;
