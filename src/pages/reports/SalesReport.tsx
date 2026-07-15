import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { useSettings } from '../../contexts/useSettings';
import { getSalesReport } from '../../services/reportService';
import ExportDropdown from '../../components/common/ExportDropdown';
import { getCustomers } from '../../services/commonService';

interface Customer { id: number; name: string; }
interface SaleItem { quantity: number; unit_price: number; product: { purchase_price: number }; }
interface Sale { id: number; date: string; reference: string; customer?: { name: string }; grand_total: number; items: SaleItem[]; }
interface Summary { total_sales: number; total_profit: number; total_products: number; total_orders: number; }

const SalesReport = () => {
  const { currencySymbol } = useSettings();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_sales: 0, total_profit: 0, total_products: 0, total_orders: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getCustomers().then(r => setCustomers(r.data.data)).catch(() => {});
    fetchReport();
  }, []);

  const fetchReport = (params?: object) => {
    getSalesReport(params).then(r => {
      setSales(r.data.data);
      setSummary(r.data.summary);
      setCurrentPage(1);
    }).catch(() => {});
  };

  const handleFilter = () => {
    const params: any = {};
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    if (customerId) params.customer_id = customerId;
    fetchReport(params);
  };

  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sales.slice(startIndex, startIndex + itemsPerPage);

  const calcProfit = (sale: Sale) =>
    sale.items?.reduce((s, i) => s + (i.unit_price - (i.product?.purchase_price ?? 0)) * i.quantity, 0) ?? 0;

  return (
    <div className="sales-report-page">
      <div className="page-header">
        <h4>Sales Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Sales Report</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="col-12 col-md-3">
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
            <div className="col-12 col-md-3 d-flex align-items-end">
              <button className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center" onClick={handleFilter}>
                <FiFilter className="me-1" /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{currencySymbol}{Number(summary.total_sales).toFixed(2)}</h3><p>Total Sales</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{currencySymbol}{Number(summary.total_profit).toFixed(2)}</h3><p>Total Profit</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_products}</h3><p>Products Sold</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_orders}</h3><p>Total Orders</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Sales Details</h5>
          <ExportDropdown filename="sales-report" rows={sales.map(s => ({ Date: s.date, Invoice: s.reference, Customer: s.customer?.name || '-', Items: s.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0, Total: Number(s.grand_total).toFixed(2), Profit: calcProfit(s).toFixed(2) }))} />
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Invoice</th><th>Customer</th><th>Items</th><th>Total</th><th>Profit</th></tr></thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted">No data found</td></tr>
                ) : paginatedData.map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.date}</td>
                    <td><strong>{sale.reference}</strong></td>
                    <td>{sale.customer?.name || '-'}</td>
                    <td>{sale.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}</td>
                    <td><strong>{currencySymbol}{Number(sale.grand_total).toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}><strong>{currencySymbol}{calcProfit(sale).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
              {sales.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#f8f9fa', fontWeight: 600 }}>
                    <td colSpan={4}>Total</td>
                    <td>{currencySymbol}{Number(summary.total_sales).toFixed(2)}</td>
                    <td style={{ color: '#16a34a' }}>{currencySymbol}{Number(summary.total_profit).toFixed(2)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {sales.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, sales.length)} of {sales.length} entries</div>
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

export default SalesReport;
