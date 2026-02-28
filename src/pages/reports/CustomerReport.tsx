import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiSearch, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CustomerReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const customerData = [
    { name: 'John Doe', email: 'john.doe@email.com', phone: '+1 234-567-8901', totalSales: 12500.00, totalPaid: 12500.00, totalDue: 0, status: 'Active' },
    { name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+1 234-567-8902', totalSales: 8750.00, totalPaid: 6000.00, totalDue: 2750.00, status: 'Active' },
    { name: 'Bob Wilson', email: 'bob.wilson@email.com', phone: '+1 234-567-8903', totalSales: 15200.00, totalPaid: 15200.00, totalDue: 0, status: 'Active' },
    { name: 'Alice Brown', email: 'alice.brown@email.com', phone: '+1 234-567-8904', totalSales: 3400.00, totalPaid: 1000.00, totalDue: 2400.00, status: 'Active' },
    { name: 'Charlie Davis', email: 'charlie.davis@email.com', phone: '+1 234-567-8905', totalSales: 9800.00, totalPaid: 9800.00, totalDue: 0, status: 'Inactive' },
    { name: 'Diana Evans', email: 'diana.evans@email.com', phone: '+1 234-567-8906', totalSales: 6200.00, totalPaid: 4500.00, totalDue: 1700.00, status: 'Active' },
    { name: 'Edward Foster', email: 'edward.foster@email.com', phone: '+1 234-567-8907', totalSales: 11300.00, totalPaid: 11300.00, totalDue: 0, status: 'Active' },
    { name: 'Fiona Green', email: 'fiona.green@email.com', phone: '+1 234-567-8908', totalSales: 4800.00, totalPaid: 2400.00, totalDue: 2400.00, status: 'Inactive' },
  ];

  const customers = [...new Set(customerData.map(c => c.name))];

  const filteredData = customerData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);
    const matchesCustomer = !customerFilter || item.name === customerFilter;
    return matchesSearch && matchesCustomer;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, customerFilter]);

  const totals = {
    sales: filteredData.reduce((sum, item) => sum + item.totalSales, 0),
    paid: filteredData.reduce((sum, item) => sum + item.totalPaid, 0),
    due: filteredData.reduce((sum, item) => sum + item.totalDue, 0),
  };

  const getStatusBadge = (status: string) => status === 'Active' ? 'badge-success' : 'badge-secondary';

  return (
    <div className="customer-report-page">
      <div className="page-header">
        <h4>Customer Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><Link to="/reports/customer">Reports</Link><span>/</span><span>Customer Report</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-2"><label className="form-label">From Date</label><input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
            <div className="col-12 col-md-2"><label className="form-label">To Date</label><input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
            <div className="col-12 col-md-3"><label className="form-label">Customer</label><select className="form-select" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}><option value="">All Customers</option>{customers.map((customer, idx) => <option key={idx} value={customer}>{customer}</option>)}</select></div>
            <div className="col-12 col-md-3"><label className="form-label">Search</label><div className="input-group"><span className="input-group-text"><FiSearch /></span><input type="text" className="form-control" placeholder="Search name, email, phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
            <div className="col-12 col-md-2 d-flex align-items-end gap-2 justify-content-end">
              <button className="btn btn-primary-custom d-flex align-items-center"><FiFilter className="me-1" /> Filter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{filteredData.length}</h3><p>Total Customers</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>${totals.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3><p>Total Sales</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#16a34a' }}>${totals.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3><p>Total Paid</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#dc2626' }}>${totals.due.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3><p>Total Due</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header">
          <h5>Customer Details</h5>
          <div className="col-12 col-md-3 d-flex align-items-end gap-2 justify-content-end">
            <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Excel</button>
            <button className="btn btn-outline-secondary d-flex align-items-center"><FiFileText className="me-1" /> PDF</button>
          </div>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Customer Name</th><th>Email</th><th>Phone</th><th>Total Sales</th><th>Total Paid</th><th>Total Due</th><th>Status</th></tr></thead>
              <tbody>
                {paginatedData.map((customer, index) => (
                  <tr key={index}>
                    <td><strong>{customer.name}</strong></td><td>{customer.email}</td><td>{customer.phone}</td>
                    <td><strong>${customer.totalSales.toFixed(2)}</strong></td><td style={{ color: '#16a34a' }}>${customer.totalPaid.toFixed(2)}</td>
                    <td style={{ color: customer.totalDue > 0 ? '#dc2626' : 'inherit' }}>${customer.totalDue.toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadge(customer.status)}`}>{customer.status}</span></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f8f9fa', fontWeight: '600' }}>
                  <td colSpan={3}>Total</td><td>${totals.sales.toFixed(2)}</td><td style={{ color: '#16a34a' }}>${totals.paid.toFixed(2)}</td><td style={{ color: '#dc2626' }}>${totals.due.toFixed(2)}</td><td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted">Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
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

export default CustomerReport;
