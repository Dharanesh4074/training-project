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
    const navigate = useNavigate();
    const statusOptions = ['Accepted', 'Rejected'];

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

    return (
        <div className="container-fluid mt-5">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="card shadow-sm border-primary">
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", alignItems: "center" }} className='p-3'>
                    <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
                    <h2 className="text-center text-primary">

                        Arise - All Providers
                    </h2>
                </div>
                <div className="card-header bg-primary text-white">
                </div>

                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-2">Loading...</p>
                        </div>
                    ) : providers.length === 0 ? (
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
                                    {providers.map((provider) => (
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
                        top: 0, left: 0,
                        width: '100%', height: '100%',
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