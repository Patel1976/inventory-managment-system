import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import * as purchaseReturnService from '../../services/purchaseReturnService';
import { getPurchases } from '../../services/purchaseService';
import { getProducts } from '../../services/productService';

interface Purchase { id: number; reference: string; }
interface Product { id: number; name: string; }

const PurchaseReturnForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const editData = state?.returnData;

  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    purchase_id: '',
    product_id: '',
    quantity: 1,
    return_amount: 0,
    return_date: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending',
  });

  useEffect(() => {
    getPurchases().then(r => setPurchases(r.data.data)).catch(() => {});
    getProducts().then(r => setProducts(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        purchase_id: String(editData.purchase?.id || ''),
        product_id: String(editData.product?.id || ''),
        quantity: editData.quantity || 1,
        return_amount: editData.return_amount || 0,
        return_date: editData.return_date || new Date().toISOString().split('T')[0],
        reason: editData.reason || '',
        status: editData.status || 'Pending',
      });
    }
  }, [isEdit, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      ...formData,
      purchase_id: Number(formData.purchase_id),
      product_id: Number(formData.product_id),
      quantity: Number(formData.quantity),
      return_amount: Number(formData.return_amount),
    };
    try {
      if (isEdit) {
        await purchaseReturnService.updatePurchaseReturn(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Purchase return updated successfully!' });
      } else {
        await purchaseReturnService.createPurchaseReturn(payload);
        showToast({ type: 'success', title: 'Success', message: 'Purchase return created successfully!' });
      }
      navigate('/purchases/returns');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-purchase-return-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Purchase Return' : 'Add Purchase Return'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/purchases/returns">Purchase Returns</Link><span>/</span>
          <span>{isEdit ? 'Edit' : 'Add'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Return Information</h5>
            <span className="badge bg-light text-dark">{isEdit ? 'Edit Mode' : 'New Return'}</span>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Purchase Reference *</label>
              <select className="form-select" value={formData.purchase_id} onChange={e => setFormData({ ...formData, purchase_id: e.target.value })} required>
                <option value="">Select Purchase</option>
                {purchases.map(p => <option key={p.id} value={p.id}>{p.reference}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Product *</label>
              <select className="form-select" value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })} required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Quantity *</label>
              <input type="number" className="form-control" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Return Amount *</label>
              <input type="number" className="form-control" min="0" step="0.01" value={formData.return_amount} onChange={e => setFormData({ ...formData, return_amount: Number(e.target.value) })} required />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Return Date *</label>
              <input type="date" className="form-control" value={formData.return_date} onChange={e => setFormData({ ...formData, return_date: e.target.value })} required />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Reason *</label>
              <textarea className="form-control" rows={3} value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} placeholder="Enter return reason..." required />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Link to="/purchases/returns" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
            <button type="submit" className="btn btn-primary-custom" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update Return' : 'Save Return'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PurchaseReturnForm;
