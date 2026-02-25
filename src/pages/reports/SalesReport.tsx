import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SalesReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const salesData = [
    { date: '2024-01-15', invoice: 'INV-001', customer: 'John Doe', products: 3, total: 1250.00, profit: 312.50 },
    { date: '2024-01-14', invoice: 'INV-002', customer: 'Jane Smith', products: 2, total: 850.00, profit: 212.50 },
    { date: '2024-01-14', invoice: 'INV-003', customer: 'Bob Wilson', products: 5, total: 2100.00, profit: 525.00 },
    { date: '2024-01-13', invoice: 'INV-004', customer: 'Alice Brown', products: 1, total: 450.00, profit: 112.50 },
    { date: '2024-01-13', invoice: 'INV-005', customer: 'Charlie Davis', products: 4, total: 1800.00, profit: 450.00 },
  ];

  const totalPages = Math.ceil(salesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = salesData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="sales-report-page">
      <div className="page-header">
        <h4>Sales Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><Link to="/reports/sales">Reports</Link><span>/</span><span>Sales Report</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3"><label className="form-label">From Date</label><input type="date" className="form-control" /></div>
            <div className="col-12 col-md-3"><label className="form-label">To Date</label><input type="date" className="form-control" /></div>
            <div className="col-12 col-md-3"><label className="form-label">Customer</label><select className="form-select"><option value="">All Customers</option><option value="1">John Doe</option><option value="2">Jane Smith</option></select></div>
            <div className="col-12 col-md-3 d-flex align-items-end gap-2"><button className="btn btn-primary-custom"><FiFilter className="me-1" /> Filter</button><button className="btn btn-outline-secondary"><FiDownload className="me-1" /> Export</button></div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>$6,450.00</h3><p>Total Sales</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>$1,612.50</h3><p>Total Profit</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>15</h3><p>Products Sold</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>5</h3><p>Total Orders</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header"><h5>Sales Details</h5></div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Invoice</th><th>Customer</th><th>Products</th><th>Total</th><th>Profit</th></tr></thead>
              <tbody>
                {paginatedData.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.date}</td><td><strong>{sale.invoice}</strong></td><td>{sale.customer}</td><td>{sale.products}</td>
                    <td><strong>${sale.total.toFixed(2)}</strong></td><td style={{ color: '#16a34a' }}><strong>${sale.profit.toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8f9fa', fontWeight: '600' }}>
                  <td colSpan={3}>Total</td><td>15</td><td>$6,450.00</td><td style={{ color: '#16a34a' }}>$1,612.50</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {salesData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, salesData.length)} of {salesData.length} entries</div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FiChevronLeft /></button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><FiChevronRight /></button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
