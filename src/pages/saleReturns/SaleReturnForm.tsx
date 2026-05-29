import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { useToast } from '../../components/common/Toast';
import * as saleReturnService from '../../services/saleReturnService';
import * as saleService from '../../services/saleService';
import { getProducts } from '../../services/productService';

interface Sale { id: number; reference: string; customer: { name: string }; }
interface SaleItem { id: number; product: { name: string; id: number }; quantity: number; unit_price: number; }
interface Product { id: number; name: string; }

const SaleReturnForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const editData = state?.saleReturn;

  const [sales, setSales] = useState<(Sale & { items: SaleItem[] })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale & { items: SaleItem[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    sale_id: '',
    product_id: '',
    return_date: new Date().toISOString().split('T')[0],
    quantity: 1,
    return_amount: 0,
    reason: '',
    status: 'Pending'
  });

  useEffect(() => {
    saleService.getSales().then(r => setSales(r.data.data)).catch(() => {});
    getProducts().then(r => setProducts(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        sale_id: String(editData.sale_id || ''),
        product_id: String(editData.product_id || ''),
        return_date: editData.date || new Date().toISOString().split('T')[0],
        quantity: editData.quantity || 1,
        return_amount: editData.return_amount || 0,
        reason: editData.reason || '',
        status: editData.status || 'Pending'
      });
    }
  }, [isEdit, editData]);

  const handleSaleChange = (saleId: string) => {
    setFormData({ ...formData, sale_id: saleId });
    const sale = sales.find(s => s.id === Number(saleId));
    setSelectedSale(sale || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const payload = {
      sale_id: Number(formData.sale_id),
      product_id: Number(formData.product_id),
      return_date: formData.return_date,
      quantity: Number(formData.quantity),
      return_amount: Number(formData.return_amount),
      reason: formData.reason,
      status: formData.status
    };

    try {
      if (isEdit) {
        await saleReturnService.updateSaleReturn(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Sale return updated successfully!' });
      } else {
        await saleReturnService.createSaleReturn(payload);
        showToast({ type: 'success', title: 'Success', message: 'Sale return created successfully!' });
      }
      navigate('/sales/returns');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-sale-return-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Sale Return' : 'Add Sale Return'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/sales/returns">Sale Returns</Link>
          <span>/</span>
          <span>{isEdit ? 'Edit' : 'Add'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Return Information</h5>
            <span className="badge bg-light text-dark">
              {isEdit ? "Edit Mode" : "New Return"}
            </span>
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Sale Reference *</label>
              <select className="form-select" value={formData.sale_id} onChange={(e) => handleSaleChange(e.target.value)} required>
                <option value="">Select Sale</option>
                {sales.map(s => <option key={s.id} value={s.id}>{s.reference} - {s.customer?.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Product *</label>
              <select className="form-select" value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Quantity *</label>
              <input type="number" className="form-control" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} required />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Return Amount *</label>
              <input type="number" className="form-control" min="0" step="0.01" value={formData.return_amount} onChange={(e) => setFormData({ ...formData, return_amount: parseFloat(e.target.value) })} required />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Return Date *</label>
              <input type="date" className="form-control" value={formData.return_date} onChange={(e) => setFormData({ ...formData, return_date: e.target.value })} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Reason *</label>
              <textarea className="form-control" rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Enter return reason..." required />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Link to="/sales/returns" className="btn btn-secondary-custom d-flex align-items-center">
              <FiX className="me-1" /> Cancel
            </Link>
            <button type="submit" className="btn btn-primary-custom d-flex align-items-center" disabled={isLoading}>
              <FiSave className="me-1" /> {isLoading ? 'Saving...' : (isEdit ? 'Update Return' : 'Save Return')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SaleReturnForm;
