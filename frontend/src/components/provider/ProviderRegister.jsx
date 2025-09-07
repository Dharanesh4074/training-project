import React, { useState } from 'react';
import { addProviderDetails } from '../../services/authServices';
import { toast, ToastContainer } from 'react-toastify';
import login_bg from '../../assets/destination.png';
import { useNavigate } from 'react-router-dom';
import back_icon from '../../assets/back_icon.svg';

function ProviderRegister() {
  const [formData, setFormData] = useState({
    providerName: '',
    providerEmail: '',
    providerOrganization: '',
    providerType: 'Bus',
  });

  const providerTypes = ['Bus', 'Train', 'Flight'];
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addProviderDetails(formData);
      toast.success(res.message);
      setFormData({
        providerName: '',
        providerEmail: '',
        providerOrganization: '',
        providerType: 'Bus',
      });
      setTimeout(() => {
        navigate('/');

      }, 3000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="row w-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            style={{
              maxWidth: '450px',
              width: '100%',
              border: '1px solid #007bff',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >

            <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, alignItems: "center" }} className='mb-4'>
              <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
              <h2 className="text-center">Register for Provider</h2>
            </div>


            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Provider Name</label>
                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Provider Email</label>
                <input
                  type="email"
                  name="providerEmail"
                  value={formData.providerEmail}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Provider Organization</label>
                <input
                  type="text"
                  name="providerOrganization"
                  value={formData.providerOrganization}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Provider Type</label>
                <select
                  name="providerType"
                  value={formData.providerType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {providerTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Register Provider
              </button>

              <div className="text-center">
                <span>Want to register as user? <a href="/register">Click here</a></span>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src={login_bg}
            alt="Provider Visual"
            className="img-fluid"
            style={{ maxHeight: '70%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProviderRegister;
