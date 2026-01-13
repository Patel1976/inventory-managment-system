import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';

const PurchaseList = () => {
  const purchases = [
    { id: 'PO-001', date: '2024-01-15', supplier: 'Tech Suppliers Inc', store: 'Main Store', total: 5250.00, paid: 5250.00, due: 0, status: 'Received' },
    { id: 'PO-002', date: '2024-01-14', supplier: 'Global Electronics', store: 'Branch 1', total: 3850.00, paid: 2000.00, due: 1850.00, status: 'Pending' },
    { id: 'PO-003', date: '2024-01-13', supplier: 'Premium Parts Ltd', store: 'Main Store', total: 2100.00, paid: 2100.00, due: 0, status: 'Received' },
    { id: 'PO-004', date: '2024-01-12', supplier: 'Tech Suppliers Inc', store: 'Branch 2', total: 1450.00, paid: 0, due: 1450.00, status: 'Ordered' },
    { id: 'PO-005', date: '2024-01-11', supplier: 'Digital World', store: 'Main Store', total: 4800.00, paid: 4800.00, due: 0, status: 'Received' },
  ];

  return (
    <div className="purchase-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Purchase List</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Purchase List</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Suppliers</option>
                <option value="1">Tech Suppliers Inc</option>
                <option value="2">Global Electronics</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Status</option>
                <option value="received">Received</option>
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2"><FiDownload className="me-1" /> Export</button>
              <Link to="/purchases/add" className="btn btn-primary-custom"><FiPlus className="me-1" /> Add Purchase</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Store</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td><strong>{purchase.id}</strong></td>
                    <td>{purchase.date}</td>
                    <td>{purchase.supplier}</td>
                    <td>{purchase.store}</td>
                    <td>${purchase.total.toFixed(2)}</td>
                    <td>${purchase.paid.toFixed(2)}</td>
                    <td>${purchase.due.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${
                        purchase.status === 'Received' ? 'badge-success' : 
                        purchase.status === 'Pending' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {purchase.status}
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
        </div>
      </div>
    </div>
  );
};

export default PurchaseList;
