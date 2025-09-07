import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authServices';
import login_bg from '../../assets/destination.png';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('providerId');
    localStorage.removeItem('userId');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(email, password);
      localStorage.setItem('token', result.token);

      if (result.role === 3) {
        localStorage.setItem("providerId", result.providerId);
      }
      if (result.userId) {
        localStorage.setItem("userId", result.userId);
      }

      toast.success(result.message);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row w-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              border: '1px solid #007bff',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          >
            <h3 className="text-center mb-2 text-primary">Arise Your Journey</h3>
            <h2 className="mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>

              <div style={{ display: "grid", flexWrap: "wrap" }}>
                <span>New User? <a href="/register">Register</a></span><br />
                <span>Create Your Own Travel Agency <a href="/provider-register">Create Now</a></span>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src={login_bg}
            alt="Booking Visual"
            className="img-fluid"
            style={{ maxHeight: '70%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
