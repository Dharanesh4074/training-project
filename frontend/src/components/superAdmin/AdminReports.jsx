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

  const [filterName, setFilterName] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterDepartureDate, setFilterDepartureDate] = useState('');
  const [filterArrivalDate, setFilterArrivalDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTransportData();
  }, [transportType]);

  const fetchTransportData = async () => {
    setLoading(true);
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
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(response.data);
    } catch (err) {
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const getBookingSummary = async (transportId, type) => {
    const url = `http://localhost:5267/Provider/GetBookingSummaryForProvider?transportId=${transportId}&transportType=${type}`;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch {
      throw new Error('Failed to fetch booking summary');
    }
  };

  const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const filteredData = data.filter((item) => {
    const name = item[`${transportType}Name`]?.toLowerCase() || '';
    const source = item.source?.toLowerCase() || '';
    const destination = item.destination?.toLowerCase() || '';

    const departure = new Date(item.departureTime);
    const arrival = new Date(item.arrivalTime);

    const matchesName = !filterName || name.includes(filterName.toLowerCase());
    const matchesFrom = !filterFrom || source.includes(filterFrom.toLowerCase());
    const matchesTo = !filterTo || destination.includes(filterTo.toLowerCase());

    const matchesDepartureDate = !filterDepartureDate || departure.toDateString() === new Date(filterDepartureDate).toDateString();
    const matchesArrivalDate = !filterArrivalDate || arrival.toDateString() === new Date(filterArrivalDate).toDateString();

    return matchesName && matchesFrom && matchesTo && matchesDepartureDate && matchesArrivalDate;
  });

  const isFilterApplied = () => {
    return (
      filterName || filterFrom || filterTo || filterDepartureDate || filterArrivalDate
    );
  };

  const handleDownloadOverallReport = async () => {
    const sourceData = isFilterApplied() ? filteredData : data;

    const groupedReports = [];

    for (const item of sourceData) {
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
      } catch {
        toast.error(`Failed to get booking summary for ${transportName}`);
      }
    }

    if (groupedReports.length > 0) {
      downloadAdminPDFReport(groupedReports, transportType);
    } else {
      toast.info("No booking data available for the report.");
    }
  };

  const clearFilters = () => {
    setFilterName('');
    setFilterFrom('');
    setFilterTo('');
    setFilterDepartureDate('');
    setFilterArrivalDate('');
  };

  const handleNavigate = () => navigate('/');

  return (
    <div className="container-fluid mt-2">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className='p-3 d-flex align-items-center gap-2'>
        <img src={back_icon} alt="Back" onClick={handleNavigate} style={{ cursor: "pointer" }} width={20} height={20} />
        <h2 className="text-primary">Arise - Admin Transport Reports</h2>
      </div>

     <div className="card shadow-sm p-3 border border-primary mb-4">
        <div className="row g-3">
          <div className="col-md-1">
            <label className="form-label">Transport Type</label>
            <select className="form-select" value={transportType} onChange={(e) => setTransportType(e.target.value)}>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          </div>

          <div className="col-md-2">
            <label className="form-label">From</label>
            <input type="text" className="form-control" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
          </div>

          <div className="col-md-2">
            <label className="form-label">To</label>
            <input type="text" className="form-control" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
          </div>

          <div className="col-md-2">
            <label className="form-label">Departure Date</label>
            <input type="date" className="form-control" value={filterDepartureDate} onChange={(e) => setFilterDepartureDate(e.target.value)} />
          </div>

          <div className="col-md-2">
            <label className="form-label">Arrival Date</label>
            <input type="date" className="form-control" value={filterArrivalDate} onChange={(e) => setFilterArrivalDate(e.target.value)} />
          </div>

          <div className="col-md-1">
            <label className="form-label d-block invisible">Clear</label>
            <button className="btn btn-secondary w-100" onClick={clearFilters}>Clear Filters</button>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100" onClick={handleDownloadOverallReport} disabled={data.length === 0}>
              Download {isFilterApplied() ? 'Filtered' : 'All'} Report
            </button>
          </div>
        </div>
      </div>

     {loading && <p>Loading data...</p>}

      {!loading && filteredData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
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
              {filteredData.map((item) => {
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
                              item.price
                            );
                          } catch {
                            toast.error('Failed to load booking summary.');
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

      {!loading && filteredData.length === 0 && (
        <div className="alert alert-info">No {transportType} data found with current filters.</div>
      )}
    </div>
  );
}

export default AdminReports;