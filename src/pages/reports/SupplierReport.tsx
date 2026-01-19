import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiSearch, FiFileText } from 'react-icons/fi';

const SupplierReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const supplierData = [
    { name: 'Tech Supplies Inc', email: 'contact@techsupplies.com', phone: '+1 555-100-1001', totalPurchases: 45000.00, totalPaid: 45000.00, totalDue: 0, status: 'Active' },
    { name: 'Global Electronics', email: 'sales@globalelectronics.com', phone: '+1 555-100-1002', totalPurchases: 32500.00, totalPaid: 25000.00, totalDue: 7500.00, status: 'Active' },
    { name: 'Prime Distributors', email: 'info@primedist.com', phone: '+1 555-100-1003', totalPurchases: 28700.00, totalPaid: 28700.00, totalDue: 0, status: 'Active' },
    { name: 'Metro Wholesale', email: 'orders@metrowholesale.com', phone: '+1 555-100-1004', totalPurchases: 19800.00, totalPaid: 15000.00, totalDue: 4800.00, status: 'Active' },
    { name: 'Quality Imports', email: 'supply@qualityimports.com', phone: '+1 555-100-1005', totalPurchases: 15600.00, totalPaid: 15600.00, totalDue: 0, status: 'Inactive' },
    { name: 'Alpha Trading Co', email: 'alpha@tradingco.com', phone: '+1 555-100-1006', totalPurchases: 22300.00, totalPaid: 18000.00, totalDue: 4300.00, status: 'Active' },
    { name: 'Beta Supplies', email: 'orders@betasupplies.com', phone: '+1 555-100-1007', totalPurchases: 8900.00, totalPaid: 8900.00, totalDue: 0, status: 'Active' },
    { name: 'Omega Distribution', email: 'contact@omegadist.com', phone: '+1 555-100-1008', totalPurchases: 36400.00, totalPaid: 30000.00, totalDue: 6400.00, status: 'Active' },
  ];

  const suppliers = [...new Set(supplierData.map(s => s.name))];

  const filteredData = supplierData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.phone.includes(searchTerm);
    const matchesSupplier = !supplierFilter || item.name === supplierFilter;
    return matchesSearch && matchesSupplier;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totals = {
    purchases: filteredData.reduce((sum, item) => sum + item.totalPurchases, 0),
    paid: filteredData.reduce((sum, item) => sum + item.totalPaid, 0),
    due: filteredData.reduce((sum, item) => sum + item.totalDue, 0),
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? 'badge-success' : 'badge-secondary';
  };

  return (
    <div className="supplier-report-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Supplier Report</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/reports/supplier">Reports</Link>
          <span>/</span>
          <span>Supplier Report</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-2">
              <label className="form-label">From Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">To Date</label>
              <input 
                type="date" 
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Supplier</label>
              <select 
                className="form-select"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier, idx) => (
                  <option key={idx} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text"><FiSearch /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-end gap-2">
              <button className="btn btn-primary-custom"><FiFilter className="me-1" /> Filter</button>
              <button className="btn btn-outline-secondary"><FiDownload className="me-1" /> Excel</button>
              <button className="btn btn-outline-secondary"><FiFileText className="me-1" /> PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>{filteredData.length}</h3>
              <p>Total Suppliers</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>${totals.purchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              <p>Total Purchases</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3 style={{ color: '#16a34a' }}>${totals.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              <p>Total Paid</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3 style={{ color: '#dc2626' }}>${totals.due.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
              <p>Total Due</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-header">
          <h5>Supplier Details</h5>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Purchases</th>
                  <th>Total Paid</th>
                  <th>Total Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((supplier, index) => (
                  <tr key={index}>
                    <td><strong>{supplier.name}</strong></td>
                    <td>{supplier.email}</td>
                    <td>{supplier.phone}</td>
                    <td><strong>${supplier.totalPurchases.toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}>${supplier.totalPaid.toFixed(2)}</td>
                    <td style={{ color: supplier.totalDue > 0 ? '#dc2626' : 'inherit' }}>${supplier.totalDue.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8f9fa', fontWeight: '600' }}>
                  <td colSpan={3}>Total</td>
                  <td>${totals.purchases.toFixed(2)}</td>
                  <td style={{ color: '#16a34a' }}>${totals.paid.toFixed(2)}</td>
                  <td style={{ color: '#dc2626' }}>${totals.due.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierReport;
