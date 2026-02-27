import { Link } from 'react-router-dom';
import { FiDownload, FiFilter } from 'react-icons/fi';

const SalesReport = () => {
  const salesData = [
    { date: '2024-01-15', invoice: 'INV-001', customer: 'John Doe', products: 3, total: 1250.00, profit: 312.50 },
    { date: '2024-01-14', invoice: 'INV-002', customer: 'Jane Smith', products: 2, total: 850.00, profit: 212.50 },
    { date: '2024-01-14', invoice: 'INV-003', customer: 'Bob Wilson', products: 5, total: 2100.00, profit: 525.00 },
    { date: '2024-01-13', invoice: 'INV-004', customer: 'Alice Brown', products: 1, total: 450.00, profit: 112.50 },
    { date: '2024-01-13', invoice: 'INV-005', customer: 'Charlie Davis', products: 4, total: 1800.00, profit: 450.00 },
  ];

  return (
    <div className="sales-report-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Sales Report</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/reports/sales">Reports</Link>
          <span>/</span>
          <span>Sales Report</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">To Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Customer</label>
              <select className="form-select">
                <option value="">All Customers</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-end gap-2 justify-content-end">
              <button className="btn btn-primary-custom d-flex align-items-center"><FiFilter className="me-1" /> Filter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>$6,450.00</h3>
              <p>Total Sales</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>$1,612.50</h3>
              <p>Total Profit</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>15</h3>
              <p>Products Sold</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>5</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Sales Details</h5>
          <div className="col-12 col-md-3 d-flex align-items-end gap-2 justify-content-end">
            <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
          </div>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.date}</td>
                    <td><strong>{sale.invoice}</strong></td>
                    <td>{sale.customer}</td>
                    <td>{sale.products}</td>
                    <td><strong>${sale.total.toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}><strong>${sale.profit.toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8f9fa', fontWeight: '600' }}>
                  <td colSpan={3}>Total</td>
                  <td>15</td>
                  <td>$6,450.00</td>
                  <td style={{ color: '#16a34a' }}>$1,612.50</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
