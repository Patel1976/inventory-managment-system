import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';

const SalesList = () => {
  const sales = [
    { id: 'INV-001', date: '2024-01-15', customer: 'John Doe', store: 'Main Store', total: 1250.00, paid: 1250.00, due: 0, status: 'Completed', paymentStatus: 'Paid' },
    { id: 'INV-002', date: '2024-01-14', customer: 'Jane Smith', store: 'Branch 1', total: 850.00, paid: 500.00, due: 350.00, status: 'Pending', paymentStatus: 'Partial' },
    { id: 'INV-003', date: '2024-01-14', customer: 'Bob Wilson', store: 'Main Store', total: 2100.00, paid: 2100.00, due: 0, status: 'Completed', paymentStatus: 'Paid' },
    { id: 'INV-004', date: '2024-01-13', customer: 'Alice Brown', store: 'Branch 2', total: 450.00, paid: 0, due: 450.00, status: 'Pending', paymentStatus: 'Unpaid' },
    { id: 'INV-005', date: '2024-01-13', customer: 'Charlie Davis', store: 'Main Store', total: 1800.00, paid: 1800.00, due: 0, status: 'Completed', paymentStatus: 'Paid' },
    { id: 'INV-006', date: '2024-01-12', customer: 'Eva Martinez', store: 'Branch 1', total: 975.00, paid: 975.00, due: 0, status: 'Completed', paymentStatus: 'Paid' },
  ];

  return (
    <div className="sales-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Sales List</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Sales List</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch />
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2">
                <FiDownload className="me-1" /> Export
              </button>
              <Link to="/sales/add" className="btn btn-primary-custom">
                <FiPlus className="me-1" /> Add Sale
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Store</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td><strong>{sale.id}</strong></td>
                    <td>{sale.date}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.store}</td>
                    <td>${sale.total.toFixed(2)}</td>
                    <td>${sale.paid.toFixed(2)}</td>
                    <td>${sale.due.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${sale.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        sale.paymentStatus === 'Paid' ? 'badge-success' : 
                        sale.paymentStatus === 'Partial' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action view me-1"><FiEye /></button>
                      <button className="btn-action edit me-1"><FiEdit /></button>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing 1 to 6 of 156 entries</div>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled"><span className="page-link">Previous</span></li>
                <li className="page-item active"><span className="page-link">1</span></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#">Next</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesList;
