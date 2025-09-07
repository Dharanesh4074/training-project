import React, { useState } from 'react';
import { updateUserPassword } from '../../services/bookingServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function PasswordUpdate() {
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId"),
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.userId) {
      toast.error('User ID is required.');
      return;
    }

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error('Please fill all password fields.');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      const msg = await updateUserPassword({
        userId: formData.userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setMessage(msg);
      setFormData({
        ...formData,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNavigate = () => {
    navigate('/');
  }
  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="border p-4 rounded shadow-sm bg-light">
        <h4 className="mb-4 text-center">Update Password</h4>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="oldPassword" className="form-label">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              className="form-control"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-control"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className="form-control"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-4"
            onClick={handleNavigate}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordUpdate;
