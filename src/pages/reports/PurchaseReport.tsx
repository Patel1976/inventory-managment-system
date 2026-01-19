import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiSearch, FiFileText } from 'react-icons/fi';

const PurchaseReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const purchaseData = [
    { date: '2024-01-15', reference: 'PUR-001', supplier: 'Tech Supplies Inc', total: 5500.00, paid: 5500.00, due: 0, status: 'Paid' },
    { date: '2024-01-14', reference: 'PUR-002', supplier: 'Global Electronics', total: 3200.00, paid: 2000.00, due: 1200.00, status: 'Partial' },
    { date: '2024-01-13', reference: 'PUR-003', supplier: 'Prime Distributors', total: 8750.00, paid: 8750.00, due: 0, status: 'Paid' },
    { date: '2024-01-12', reference: 'PUR-004', supplier: 'Tech Supplies Inc', total: 2100.00, paid: 0, due: 2100.00, status: 'Unpaid' },
    { date: '2024-01-11', reference: 'PUR-005', supplier: 'Metro Wholesale', total: 4600.00, paid: 4600.00, due: 0, status: 'Paid' },
    { date: '2024-01-10', reference: 'PUR-006', supplier: 'Global Electronics', total: 6300.00, paid: 3000.00, due: 3300.00, status: 'Partial' },
    { date: '2024-01-09', reference: 'PUR-007', supplier: 'Prime Distributors', total: 1850.00, paid: 1850.00, due: 0, status: 'Paid' },
    { date: '2024-01-08', reference: 'PUR-008', supplier: 'Metro Wholesale', total: 9200.00, paid: 9200.00, due: 0, status: 'Paid' },
  ];

  const suppliers = [...new Set(purchaseData.map(p => p.supplier))];

  const filteredData = purchaseData.filter(item => {
    const matchesSearch = item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = !supplierFilter || item.supplier === supplierFilter;
    return matchesSearch && matchesSupplier;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totals = {
    total: filteredData.reduce((sum, item) => sum + item.total, 0),
    paid: filteredData.reduce((sum, item) => sum + item.paid, 0),
    due: filteredData.reduce((sum, item) => sum + item.due, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return 'badge-success';
      case 'Partial': return 'badge-warning';
      case 'Unpaid': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="purchase-report-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Purchase Report</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/reports/purchase">Reports</Link>
          <span>/</span>
          <span>Purchase Report</span>
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
                  placeholder="Search reference, supplier..."
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
              <h3>${totals.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
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
        <div className="col-12 col-md-3">
          <div className="stat-card">
            <div className="stat-content">
              <h3>{filteredData.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-header">
          <h5>Purchase Details</h5>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Supplier Name</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Due Amount</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((purchase, index) => (
                  <tr key={index}>
                    <td>{purchase.date}</td>
                    <td><strong>{purchase.reference}</strong></td>
                    <td>{purchase.supplier}</td>
                    <td><strong>${purchase.total.toFixed(2)}</strong></td>
                    <td style={{ color: '#16a34a' }}>${purchase.paid.toFixed(2)}</td>
                    <td style={{ color: purchase.due > 0 ? '#dc2626' : 'inherit' }}>${purchase.due.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8f9fa', fontWeight: '600' }}>
                  <td colSpan={3}>Total</td>
                  <td>${totals.total.toFixed(2)}</td>
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

export default PurchaseReport;
