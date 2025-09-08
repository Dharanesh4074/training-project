import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 text-danger">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <p>Redirecting to the homepage in 3 seconds...</p>
    </div>
  );
}

export default NotFound;
