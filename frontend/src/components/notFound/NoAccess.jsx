import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NoAccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center border p-5 rounded shadow bg-white">
        <h2 className="text-danger mb-3">Access Denied</h2>
        <p className="text-muted">You don’t have permission to view this page.</p>
        <p className="text-secondary">Redirecting to home...</p>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoAccess;
