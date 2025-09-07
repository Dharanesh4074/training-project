import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { downloadAdminPDFReport } from '../../utils/AdminReport';
import { toast, ToastContainer } from 'react-toastify';
import { downloadProviderPDFReport } from '../../utils/ProviderReport';
import back_icon from '../../assets/back_icon.svg';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5267/SuperAdmin';

function AdminReports() {
  const [transportType, setTransportType] = useState('bus');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransportData();
  }, [transportType]);

  const fetchTransportData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '';
      switch (transportType) {
        case 'bus':
          url = `${API_BASE_URL}/getBusesByAdmin`;
          break;
        case 'train':
          url = `${API_BASE_URL}/getTrainsByAdmin`;
          break;
        case 'flight':
          url = `${API_BASE_URL}/getFlightsByAdmin`;
          break;
        default:
          return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found — user may not be authenticated.");
        return;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBookingSummary = async (transportId, type) => {
    const url = `http://localhost:5267/Provider/GetBookingSummaryForProvider?transportId=${transportId}&transportType=${type}`;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found — user may not be authenticated.");
        return;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (err) {
      throw new Error('Failed to fetch booking summary');
    }
  };

  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const handleDownloadOverallReport = async () => {
    const groupedReports = [];

    for (const item of data) {
      const transportId = item[`${transportType}Id`];
      const transportName = item[`${transportType}Name`];

      try {
        const bookingSummary = await getBookingSummary(transportId, transportType);

        groupedReports.push({
          id: transportId,
          name: transportName,
          source: item.source,
          destination: item.destination,
          price: item.price,
          bookings: bookingSummary.bookings,
        });
      } catch (err) {
        toast.error(`Failed to get booking summary for ${transportName}`);
      }
    }

    if (groupedReports.length > 0) {
      downloadAdminPDFReport(groupedReports, transportType);
    } else {
      toast.info("No booking data found to generate report.");
    }
  };
  const handleNavigate = () => {
    navigate('/');
  }

  return (
    <div className="container-fluid mt-2">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", alignItems: "center" }} className='p-3'>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
        <h2 className="text-center text-primary">

          Arise - Admin Transport Reports
        </h2>
      </div>

      <div className="d-flex align-items-center mb-3">
        <label className="form-label me-2">Select Transport Type:</label>
        <select
          className="form-select w-auto"
          value={transportType}
          onChange={(e) => setTransportType(e.target.value)}
        >
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="flight">Flight</option>
        </select>

        <button
          className="btn btn-success ms-3"
          onClick={handleDownloadOverallReport}
          disabled={data.length === 0}
        >
          Generate Overall Report
        </button>
      </div>

      {loading && <div>Loading data...</div>}

      {!loading && data.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>Provider</th>
                <th>Organization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const id = item[`${transportType}Id`];
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{item[`${transportType}Name`]}</td>
                    <td>{item.source}</td>
                    <td>{item.destination}</td>
                    <td>{formatDateTime(item.departureTime)}</td>
                    <td>{formatDateTime(item.arrivalTime)}</td>
                    <td>₹{item.price}</td>
                    <td>{item.provider?.providerName}</td>
                    <td>{item.provider?.providerOrganization}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={async () => {
                          try {
                            const bookingSummary = await getBookingSummary(id, transportType);
                            downloadProviderPDFReport(
                              id,
                              transportType,
                              `${transportType.toUpperCase()} Booking Report`,
                              item.source,
                              item.destination,
                              bookingSummary.bookings,
                              item.price,
                              false
                            );
                          } catch (err) {
                            toast.error('Failed to load booking summary for this transport.');
                          }
                        }}
                      >
                        Download Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="alert alert-info">
          No {transportType} data found for admin.
        </div>
      )}
    </div>
  );
}

export default AdminReports;