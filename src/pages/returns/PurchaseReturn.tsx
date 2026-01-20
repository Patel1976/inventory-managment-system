import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload, FiX, FiSave } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface PurchaseReturnItem {
  id: string;
  date: string;
  purchaseRef: string;
  supplier: string;
  product: string;
  quantity: number;
  returnAmount: number;
  status: string;
}

const PurchaseReturn = () => {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  // Mock data
  const purchaseReturns: PurchaseReturnItem[] = [
    { id: 'PR-001', date: '2024-01-15', purchaseRef: 'PO-001', supplier: 'Tech Suppliers Inc', product: 'iPhone 14 Pro', quantity: 2, returnAmount: 1998.00, status: 'Completed' },
    { id: 'PR-002', date: '2024-01-14', purchaseRef: 'PO-002', supplier: 'Global Electronics', product: 'Samsung Galaxy S23', quantity: 1, returnAmount: 899.00, status: 'Pending' },
    { id: 'PR-003', date: '2024-01-13', purchaseRef: 'PO-003', supplier: 'Premium Parts Ltd', product: 'MacBook Pro M2', quantity: 1, returnAmount: 1999.00, status: 'Completed' },
    { id: 'PR-004', date: '2024-01-12', purchaseRef: 'PO-001', supplier: 'Tech Suppliers Inc', product: 'Sony Headphones', quantity: 3, returnAmount: 1047.00, status: 'Processing' },
    { id: 'PR-005', date: '2024-01-11', purchaseRef: 'PO-004', supplier: 'Digital World', product: 'Dell Monitor 27"', quantity: 2, returnAmount: 598.00, status: 'Completed' },
  ];

  const [formData, setFormData] = useState({
    purchaseRef: '',
    product: '',
    quantity: 1,
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending'
  });

  const filteredReturns = purchaseReturns.filter(item => {
    const matchesSearch = item.purchaseRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesSupplier = !supplierFilter || item.supplier === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    alert('Purchase return added successfully!');
    setShowModal(false);
    setFormData({
      purchaseRef: '',
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
    <div className="purchase-return-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Purchase Returns</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Purchase Returns</span>
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
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="">All Suppliers</option>
                <option value="Tech Suppliers Inc">Tech Suppliers Inc</option>
                <option value="Global Electronics">Global Electronics</option>
                <option value="Premium Parts Ltd">Premium Parts Ltd</option>
                <option value="Digital World">Digital World</option>
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
                  <th>Purchase Ref</th>
                  <th>Supplier</th>
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
                    <td><strong>{item.purchaseRef}</strong></td>
                    <td>{item.supplier}</td>
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
              <h5 className="mb-0">Add Purchase Return</h5>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Purchase Reference *</label>
                    <select 
                      className="form-select"
                      value={formData.purchaseRef}
                      onChange={(e) => setFormData({...formData, purchaseRef: e.target.value})}
                      required
                    >
                      <option value="">Select Purchase</option>
                      <option value="PO-001">PO-001 - Tech Suppliers Inc</option>
                      <option value="PO-002">PO-002 - Global Electronics</option>
                      <option value="PO-003">PO-003 - Premium Parts Ltd</option>
                      <option value="PO-004">PO-004 - Digital World</option>
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

export default PurchaseReturn;
