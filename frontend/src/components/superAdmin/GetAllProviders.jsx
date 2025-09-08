import React, { useEffect, useState } from 'react';
import {
  fetchAllProviders,
  updateProviderStatus,
  deleteProvider
} from '../../services/superAdminServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import back_icon from '../../assets/back_icon.svg';
import { useNavigate } from 'react-router-dom';

function GetAllProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [filters, setFilters] = useState({
    email: '',
    type: '',
    status: ''
  });
  const navigate = useNavigate();
  const statusOptions = ['Pending', 'Accepted', 'Rejected'];
  const typeOptions = ['Bus', 'Flight', 'Train'];

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProviders();
      setProviders(data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching providers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateProviderStatus(id, newStatus);
      toast.success('Status updated successfully');
      loadProviders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = (id) => {
    setProviderToDelete(id);
    setDeletePopupVisible(true);
  };

  const cancelDelete = () => {
    setProviderToDelete(null);
    setDeletePopupVisible(false);
  };

  const proceedDelete = async () => {
    if (!providerToDelete) return;
    try {
      await deleteProvider(providerToDelete);
      toast.success('Provider deleted successfully');
      setDeletePopupVisible(false);
      setProviderToDelete(null);
      loadProviders();
    } catch (error) {
      toast.error('Failed to delete provider');
    }
  };

  const handleNavigate = () => {
    navigate('/');
  };

  const clearFilters = () => {
    setFilters({ email: '', type: '', status: '' });
  };

  const filteredProviders = providers.filter((prv) => {
    const emailMatch = filters.email
      ? prv.providerEmail.toLowerCase().includes(filters.email.toLowerCase())
      : true;

    const typeMatch = filters.type
      ? prv.providerType.toLowerCase() === filters.type.toLowerCase()
      : true;

    const statusMatch = filters.status
      ? prv.approvelStatus.toLowerCase() === filters.status.toLowerCase()
      : true;

    return emailMatch && typeMatch && statusMatch;
  });

  return (
    <div className="container-fluid mt-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div
        className="card shadow-sm border-primary"
      >
        <div className="p-3 d-flex align-items-center gap-2">
          <img
            src={back_icon}
            alt="Back"
            onClick={handleNavigate}
            style={{ cursor: 'pointer' }}
            width={20}
            height={20}
          />
          <h2 className="text-center text-primary">Arise - All Providers</h2>
        </div>

        <div className="card-body">
          <div className="mb-3">
           <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="emailFilter" className="form-label">
                  Search Email
                </label>
                <input
                  type="text"
                  id="emailFilter"
                  className="form-control"
                  placeholder="Enter email"
                  value={filters.email}
                  onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="typeFilter" className="form-label">
                  Provider Type
                </label>
                <select
                  id="typeFilter"
                  className="form-select"
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">-- All Types --</option>
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label htmlFor="statusFilter" className="form-label">
                  Approval Status
                </label>
                <select
                  id="statusFilter"
                  className="form-select"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">-- All Status --</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-secondary w-100" onClick={clearFilters}>
                  Cancel Filters
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <p>No providers found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary text-center align-middle">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {filteredProviders.map((provider) => (
                    <tr key={provider.providerId}>
                      <td>{provider.providerId}</td>
                      <td>{provider.providerName}</td>
                      <td>{provider.providerEmail}</td>
                      <td>{provider.providerOrganization}</td>
                      <td>{provider.providerType}</td>
                      <td>
                        <select
                          className="form-select"
                          value={provider.approvelStatus.toLowerCase()}
                          onChange={(e) =>
                            handleStatusChange(provider.providerId, e.target.value)
                          }
                        >
                          {provider.approvelStatus.toLowerCase() === 'pending' && (
                            <option value="pending" disabled>
                              Pending
                            </option>
                          )}
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt.toLowerCase()}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => confirmDelete(provider.providerId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deletePopupVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}
          >
            <h5>Are you sure you want to delete this provider?</h5>
            <div className="mt-4 d-flex justify-content-around">
              <button className="btn btn-danger" onClick={proceedDelete}>
                Yes
              </button>
              <button className="btn btn-secondary" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetAllProviders;