import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiSearch } from 'react-icons/fi';
import { useSettings } from '../../contexts/useSettings';
import { getPurchaseReport } from '../../services/reportService';
import { getSuppliers } from '../../services/commonService';

interface Supplier { id: number; name: string; }
interface Purchase { id: number; date: string; reference: string; supplier?: { name: string }; grand_total: number; paid: number; due: number; payment_status: string; }
interface Summary { total_purchases: number; total_paid: number; total_due: number; total_orders: number; }

const PurchaseReport = () => {
  const { currencySymbol } = useSettings();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_purchases: 0, total_paid: 0, total_due: 0, total_orders: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getSuppliers().then(r => setSuppliers(r.data.data)).catch(() => {});
    fetchReport();
  }, []);

  const fetchReport = (params?: object) => {
    getPurchaseReport(params).then(r => {
      setPurchases(r.data.data);
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

  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = purchases.slice(startIndex, startIndex + itemsPerPage);

  const paymentBadge = (s: string) => s === 'paid' ? 'badge-success' : s === 'partial' ? 'badge-warning' : 'badge-danger';

  return (
    <div className="purchase-report-page">
      <div className="page-header">
        <h4>Purchase Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Purchase Report</span></div>
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
                <input type="text" className="form-control" placeholder="Reference or supplier..." value={search} onChange={e => setSearch(e.target.value)} />
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
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{currencySymbol}{Number(summary.total_purchases).toFixed(2)}</h3><p>Total Purchases</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#16a34a' }}>{currencySymbol}{Number(summary.total_paid).toFixed(2)}</h3><p>Total Paid</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#dc2626' }}>{currencySymbol}{Number(summary.total_due).toFixed(2)}</h3><p>Total Due</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_orders}</h3><p>Total Orders</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Purchase Details</h5>
          <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Reference</th><th>Supplier</th><th>Total</th><th>Paid</th><th>Due</th><th>Payment</th></tr></thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">No data found</td></tr>
                ) : paginatedData.map(p => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td><strong>{p.reference}</strong></td>
                    <td>{p.supplier?.name || '-'}</td>
                    <td><strong>{currencySymbol}{Number(p.grand_total).toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}>{currencySymbol}{Number(p.paid).toFixed(2)}</td>
                    <td style={{ color: Number(p.due) > 0 ? '#dc2626' : 'inherit' }}>{currencySymbol}{Number(p.due).toFixed(2)}</td>
                    <td><span className={`badge ${paymentBadge(p.payment_status)}`}>{p.payment_status}</span></td>
                  </tr>
                ))}
              </tbody>
              {purchases.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#f8f9fa', fontWeight: 600 }}>
                    <td colSpan={3}>Total</td>
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
            <div className="text-muted">Showing {purchases.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, purchases.length)} of {purchases.length} entries</div>
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

export default PurchaseReport;
