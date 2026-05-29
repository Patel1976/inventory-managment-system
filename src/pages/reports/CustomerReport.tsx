import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiSearch } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';
import { getCustomerReport } from '../../services/reportService';
import { getCustomers } from '../../services/commonService';

interface Customer { id: number; name: string; }
interface CustomerRow { id: number; name: string; email: string; phone: string; status: string; total_sales: number; total_paid: number; total_due: number; total_orders: number; }
interface Summary { total_customers: number; total_sales: number; total_paid: number; total_due: number; }

const CustomerReport = () => {
  const { currencySymbol } = useSettings();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [data, setData] = useState<CustomerRow[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_customers: 0, total_sales: 0, total_paid: 0, total_due: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getCustomers().then(r => setCustomers(r.data.data)).catch(() => {});
    fetchReport();
  }, []);

  const fetchReport = (params?: object) => {
    getCustomerReport(params).then(r => {
      setData(r.data.data);
      setSummary(r.data.summary);
      setCurrentPage(1);
    }).catch(() => {});
  };

  const handleFilter = () => {
    const params: any = {};
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    if (customerId) params.customer_id = customerId;
    if (search) params.search = search;
    fetchReport(params);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="customer-report-page">
      <div className="page-header">
        <h4>Customer Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Customer Report</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-2">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">To Date</label>
              <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Customer</label>
              <select className="form-select" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">All Customers</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text"><FiSearch /></span>
                <input type="text" className="form-control" placeholder="Name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-end">
              <button className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center" onClick={handleFilter}>
                <FiFilter className="me-1" /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_customers}</h3><p>Total Customers</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{currencySymbol}{Number(summary.total_sales).toFixed(2)}</h3><p>Total Sales</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#16a34a' }}>{currencySymbol}{Number(summary.total_paid).toFixed(2)}</h3><p>Total Paid</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#dc2626' }}>{currencySymbol}{Number(summary.total_due).toFixed(2)}</h3><p>Total Due</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Customer Details</h5>
          <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Sales</th><th>Total Paid</th><th>Total Due</th><th>Status</th></tr></thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4 text-muted">No data found</td></tr>
                ) : paginatedData.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone || '-'}</td>
                    <td>{c.total_orders}</td>
                    <td><strong>{currencySymbol}{Number(c.total_sales).toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}>{currencySymbol}{Number(c.total_paid).toFixed(2)}</td>
                    <td style={{ color: Number(c.total_due) > 0 ? '#dc2626' : 'inherit' }}>{currencySymbol}{Number(c.total_due).toFixed(2)}</td>
                    <td><span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
              {data.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#f8f9fa', fontWeight: 600 }}>
                    <td colSpan={4}>Total</td>
                    <td>{currencySymbol}{Number(summary.total_sales).toFixed(2)}</td>
                    <td style={{ color: '#16a34a' }}>{currencySymbol}{Number(summary.total_paid).toFixed(2)}</td>
                    <td style={{ color: '#dc2626' }}>{currencySymbol}{Number(summary.total_due).toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {data.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length} entries</div>
            <nav><ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button></li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button></li>;
              })}
              <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button></li>
            </ul></nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport;
