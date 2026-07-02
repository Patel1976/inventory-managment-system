import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiSearch } from 'react-icons/fi';
import { useSettings } from '../../contexts/useSettings';
import { getSupplierReport } from '../../services/reportService';
import { getSuppliers } from '../../services/commonService';

interface Supplier { id: number; name: string; }
interface SupplierRow { id: number; name: string; email: string; phone: string; status: string; total_purchases: number; total_paid: number; total_due: number; total_orders: number; }
interface Summary { total_suppliers: number; total_purchases: number; total_paid: number; total_due: number; }

const SupplierReport = () => {
  const { currencySymbol } = useSettings();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [data, setData] = useState<SupplierRow[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_suppliers: 0, total_purchases: 0, total_paid: 0, total_due: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getSuppliers().then(r => setSuppliers(r.data.data)).catch(() => {});
    fetchReport();
  }, []);

  const fetchReport = (params?: object) => {
    getSupplierReport(params).then(r => {
      setData(r.data.data);
      setSummary(r.data.summary);
      setCurrentPage(1);
    }).catch(() => {});
  };

  const handleFilter = () => {
    const params: any = {};
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    if (supplierId) params.supplier_id = supplierId;
    if (search) params.search = search;
    fetchReport(params);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="supplier-report-page">
      <div className="page-header">
        <h4>Supplier Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Supplier Report</span></div>
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
              <label className="form-label">Supplier</label>
              <select className="form-select" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                <option value="">All Suppliers</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_suppliers}</h3><p>Total Suppliers</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{currencySymbol}{Number(summary.total_purchases).toFixed(2)}</h3><p>Total Purchases</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#16a34a' }}>{currencySymbol}{Number(summary.total_paid).toFixed(2)}</h3><p>Total Paid</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#dc2626' }}>{currencySymbol}{Number(summary.total_due).toFixed(2)}</h3><p>Total Due</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Supplier Details</h5>
          <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Supplier</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Purchases</th><th>Total Paid</th><th>Total Due</th><th>Status</th></tr></thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4 text-muted">No data found</td></tr>
                ) : paginatedData.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.email}</td>
                    <td>{s.phone || '-'}</td>
                    <td>{s.total_orders}</td>
                    <td><strong>{currencySymbol}{Number(s.total_purchases).toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}>{currencySymbol}{Number(s.total_paid).toFixed(2)}</td>
                    <td style={{ color: Number(s.total_due) > 0 ? '#dc2626' : 'inherit' }}>{currencySymbol}{Number(s.total_due).toFixed(2)}</td>
                    <td><span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
              {data.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#f8f9fa', fontWeight: 600 }}>
                    <td colSpan={4}>Total</td>
                    <td>{currencySymbol}{Number(summary.total_purchases).toFixed(2)}</td>
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

export default SupplierReport;
