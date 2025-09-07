import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authServices';
import login_bg from '../../assets/destination.png';
import { toast } from 'react-toastify';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phono, setPhono] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const newUser = {
      email,
      password,
      phono,
      role: 4
    };

    try {
      const result = await registerUser(newUser);
      // console.log('Registration success:', result);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Register failed: ' + error.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center w-99">
          <div
            style={{
              maxWidth: '400px',
              width: '100%',
              border: '1px solid #28a745',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}
          >
            <h1 className="text-center mb-4" style={{ color: '#28a745', fontWeight: '500' }}>
              Arise Your Journey
            </h1>
            <h2 className="mb-4 text-center">Register</h2>
            <form onSubmit={handleRegister}>
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

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  required
                  minLength="10"
                  maxLength="10"
                  className="form-control"
                  value={phono}
                  onChange={(e) => setPhono(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success w-100 mb-3">
                Register
              </button>

              <div className="text-center">
                <span>Already have an account? <a href="/login">Login</a></span>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src={login_bg}
            alt="Register Visual"
            className="img-fluid"
            style={{ maxHeight: '70%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
