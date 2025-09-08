import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../../services/superAdminServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import back_icon from '../../assets/back_icon.svg';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmail, setFilterEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    if (role === 3) return 'Provider';
    if (role === 4) return 'User';
    return 'Unknown';
  };

  const handleViewBookings = (userId) => {
    navigate(`/view-bookings/${userId}`);
  };

  const handleNavigate = () => {
    navigate('/');
  };

  const clearFilter = () => {
    setFilterEmail('');
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(filterEmail.toLowerCase())
  );

  return (
    <div className="container-fluid mt-5">
      <div className="card shadow-sm border-primary">
        <div className="p-3 d-flex align-items-center gap-2">
          <img
            src={back_icon}
            alt="Back"
            onClick={handleNavigate}
            style={{ cursor: 'pointer' }}
            width={20}
            height={20}
          />
          <h2 className="text-center text-primary">Arise - All Users</h2>
        </div>

        <div className="card-body">
          <div className="row mb-3 px-2">
            <div className="col-md-4">
              <label htmlFor="emailFilter" className="form-label">Filter by Email</label>
              <input
                type="text"
                className="form-control"
                id="emailFilter"
                placeholder="Enter email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-secondary w-100" onClick={clearFilter}>
                Cancel Filter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary text-center align-middle">
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center align-middle">
                  {filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.email}</td>
                      <td>{user.phono}</td>
                      <td>{getRoleLabel(user.role)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewBookings(user.userId)}
                        >
                          View Bookings
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
    </div>
  );
}

export default GetAllUsers;