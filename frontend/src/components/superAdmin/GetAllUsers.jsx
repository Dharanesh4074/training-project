import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../../services/superAdminServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import back_icon from '../../assets/back_icon.svg';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }

  return (
    <div className="container-fluid">
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", alignItems: "center" }} className='p-3'>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
        <h2 className="text-center text-primary">

          Arise - All Users
        </h2>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.email}</td>
                <td>{user.phono}</td>
                <td>{getRoleLabel(user.role)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewBookings(user.userId)}
                  >
                    View Bookings
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GetAllUsers;
