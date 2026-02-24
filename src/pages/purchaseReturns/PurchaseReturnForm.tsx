import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { mockPurchaseReturns } from './PurchaseReturnList';
import { useToast } from '../../components/common/Toast';

const PurchaseReturnForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    purchaseRef: '',
    product: '',
    quantity: 1,
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (isEdit && id) {
      const existing = mockPurchaseReturns.find(r => r.id === id);
      if (existing) {
        setFormData({
          purchaseRef: existing.purchaseRef,
          product: existing.product,
          quantity: existing.quantity,
          returnDate: existing.date,
          reason: existing.reason,
          status: existing.status
        });
      }
    }
  }, [id, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast({ type: 'success', title: 'Success', message: isEdit ? 'Purchase return updated successfully!' : 'Purchase return added successfully!' });
      navigate('/purchases/returns');
    }, 500);
  };

  return (
    <div className="add-purchase-return-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Purchase Return' : 'Add Purchase Return'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/purchases/returns">Purchase Returns</Link><span>/</span><span>{isEdit ? 'Edit' : 'Add'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="form-card">
              <h5 className="mb-4">Return Information</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Purchase Reference *</label>
                    <select className="form-select" value={formData.purchaseRef} onChange={(e) => setFormData({...formData, purchaseRef: e.target.value})} required>
                      <option value="">Select Purchase</option>
                      <option value="PO-001">PO-001 - Tech Suppliers Inc</option>
                      <option value="PO-002">PO-002 - Global Electronics</option>
                      <option value="PO-003">PO-003 - Premium Parts Ltd</option>
                      <option value="PO-004">PO-004 - Digital World</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Product *</label>
                    <select className="form-select" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} required>
                      <option value="">Select Product</option>
                      <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                      <option value="Samsung Galaxy S23">Samsung Galaxy S23</option>
                      <option value="MacBook Pro M2">MacBook Pro M2</option>
                      <option value="Sony Headphones">Sony Headphones</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Quantity *</label>
                    <input type="number" className="form-control" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} required />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Return Date *</label>
                    <input type="date" className="form-control" value={formData.returnDate} onChange={(e) => setFormData({...formData, returnDate: e.target.value})} required />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Reason *</label>
                    <textarea className="form-control" rows={3} value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="Enter return reason..." required />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Status</label>
                    <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="form-card">
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary-custom" disabled={isLoading}>
                  <FiSave className="me-2" /> {isLoading ? 'Saving...' : (isEdit ? 'Update Return' : 'Save Return')}
                </button>
                <Link to="/purchases/returns" className="btn btn-secondary-custom">
                  <FiX className="me-2" /> Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PurchaseReturnForm;
