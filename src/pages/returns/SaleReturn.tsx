import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload, FiX, FiSave } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface SaleReturnItem {
  id: string;
  date: string;
  saleRef: string;
  customer: string;
  product: string;
  quantity: number;
  returnAmount: number;
  status: string;
}

const SaleReturn = () => {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  // Mock data
  const saleReturns: SaleReturnItem[] = [
    { id: 'SR-001', date: '2024-01-15', saleRef: 'INV-001', customer: 'John Doe', product: 'iPhone 14 Pro', quantity: 1, returnAmount: 999.00, status: 'Completed' },
    { id: 'SR-002', date: '2024-01-14', saleRef: 'INV-002', customer: 'Jane Smith', product: 'Samsung Galaxy S23', quantity: 1, returnAmount: 899.00, status: 'Pending' },
    { id: 'SR-003', date: '2024-01-13', saleRef: 'INV-003', customer: 'Bob Wilson', product: 'Sony Headphones', quantity: 2, returnAmount: 698.00, status: 'Completed' },
    { id: 'SR-004', date: '2024-01-12', saleRef: 'INV-001', customer: 'John Doe', product: 'MacBook Pro M2', quantity: 1, returnAmount: 1999.00, status: 'Processing' },
    { id: 'SR-005', date: '2024-01-11', saleRef: 'INV-004', customer: 'Alice Brown', product: 'Dell Monitor 27"', quantity: 1, returnAmount: 299.00, status: 'Completed' },
  ];

  const [formData, setFormData] = useState({
    saleRef: '',
    product: '',
    quantity: 1,
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending'
  });

  const filteredReturns = saleReturns.filter(item => {
    const matchesSearch = item.saleRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesCustomer = !customerFilter || item.customer === customerFilter;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    alert('Sale return added successfully!');
    setShowModal(false);
    setFormData({
      saleRef: '',
      product: '',
      quantity: 1,
      returnDate: new Date().toISOString().split('T')[0],
      reason: '',
      status: 'Pending'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="sale-return-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Sale Returns</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Sale Returns</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select 
                className="form-select"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              >
                <option value="">All Customers</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Bob Wilson">Bob Wilson</option>
                <option value="Alice Brown">Alice Brown</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2"><FiDownload className="me-1" /> Export</button>
              <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
                <FiPlus className="me-1" /> Add Return
              </button>
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
                  <th>Date</th>
                  <th>Sale Ref</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Return Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td><strong>{item.saleRef}</strong></td>
                    <td>{item.customer}</td>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>${item.returnAmount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action view me-1"><FiEye /></button>
                      {isAdmin && (
                        <>
                          <button className="btn-action edit me-1"><FiEdit /></button>
                          <button className="btn-action delete"><FiTrash2 /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-muted">Showing 1 to {filteredReturns.length} of {filteredReturns.length} entries</span>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item disabled"><a className="page-link" href="#">Next</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Add Return Modal */}
      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div className="modal-header p-4 border-bottom">
              <h5 className="mb-0">Add Sale Return</h5>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Sale Reference *</label>
                    <select 
                      className="form-select"
                      value={formData.saleRef}
                      onChange={(e) => setFormData({...formData, saleRef: e.target.value})}
                      required
                    >
                      <option value="">Select Sale</option>
                      <option value="INV-001">INV-001 - John Doe</option>
                      <option value="INV-002">INV-002 - Jane Smith</option>
                      <option value="INV-003">INV-003 - Bob Wilson</option>
                      <option value="INV-004">INV-004 - Alice Brown</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Product *</label>
                    <select 
                      className="form-select"
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      required
                    >
                      <option value="">Select Product</option>
                      <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                      <option value="Samsung Galaxy S23">Samsung Galaxy S23</option>
                      <option value="MacBook Pro M2">MacBook Pro M2</option>
                      <option value="Sony Headphones">Sony Headphones</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Quantity *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Return Date *</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Reason *</label>
                    <textarea 
                      className="form-control" 
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Enter return reason..."
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer p-4 border-top">
                <button type="button" className="btn btn-secondary-custom me-2" onClick={() => setShowModal(false)}>
                  <FiX className="me-1" /> Cancel
                </button>
                <button type="submit" className="btn btn-primary-custom">
                  <FiSave className="me-1" /> Save Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleReturn;
