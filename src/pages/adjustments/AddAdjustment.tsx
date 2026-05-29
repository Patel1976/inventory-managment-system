import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/components/common/Toast';
import { getStores } from '../../services/commonService';
import { getProducts } from '../../services/productService';
import { createAdjustment, updateAdjustment } from '../../services/reportService';

interface Store { id: number; name: string; }
interface Product { id: number; name: string; quantity: number; }
interface Item { product_id: string; quantity: number; }

const AddAdjustment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast } = useToast();
  const isEdit = !!id;
  const editData = state?.adjustment;

  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    store_id: '',
    date: new Date().toISOString().split('T')[0],
    type: 'addition',
    reason: '',
    note: '',
  });

  const [items, setItems] = useState<Item[]>([{ product_id: '', quantity: 1 }]);

  useEffect(() => {
    getStores().then(r => setStores(r.data.data)).catch(() => {});
    getProducts().then(r => setProducts(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editData) {
      setForm({
        store_id: String(editData.store?.id || editData.store_id || ''),
        date: editData.date || new Date().toISOString().split('T')[0],
        type: editData.type || 'addition',
        reason: editData.reason || '',
        note: editData.note || '',
      });
      if (editData.items?.length) {
        setItems(editData.items.map((i: any) => ({
          product_id: String(i.product_id || i.product?.id || ''),
          quantity: i.quantity,
        })));
      }
    }
  }, [isEdit, editData]);

  const addItem = () => setItems([...items, { product_id: '', quantity: 1 }]);
  const removeItem = (idx: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== idx)); };

  const updateItem = (idx: number, field: keyof Item, value: string | number) => {
    const updated = [...items];
    (updated[idx] as any)[field] = field === 'quantity' ? Number(value) : String(value);
    setItems(updated);
  };

  const getProductStock = (productId: string) => {
    const p = products.find(p => p.id === Number(productId));
    return p ? p.quantity : '-';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.product_id)) {
      showToast({ type: 'error', title: 'Validation', message: 'Please select a product for all items.' });
      return;
    }
    setIsLoading(true);
    const payload = {
      store_id: Number(form.store_id),
      date: form.date,
      type: form.type,
      reason: form.reason,
      note: form.note,
      items: items.map(i => ({ product_id: Number(i.product_id), quantity: i.quantity })),
    };
    try {
      if (isEdit && id) {
        await updateAdjustment(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Adjustment updated successfully!' });
      } else {
        await createAdjustment(payload);
        showToast({ type: 'success', title: 'Success', message: 'Adjustment created successfully!' });
      }
      navigate('/adjustments');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-adjustment-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Stock Adjustment' : 'Add Stock Adjustment'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/adjustments">Adjustments</Link><span>/</span>
          <span>{isEdit ? 'Edit Adjustment' : 'Add Adjustment'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-card">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <label className="form-label">Store *</label>
                  <select className="form-select" value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })} required>
                    <option value="">Select Store</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Adjustment Type *</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="addition">Addition</option>
                    <option value="subtraction">Subtraction</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive mb-4">
                <table className="data-table">
                  <thead>
                    <tr><th style={{ width: '50%' }}>Product</th><th>Current Stock</th><th>Quantity</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <select className="form-select form-select-sm" value={item.product_id} onChange={e => updateItem(idx, 'product_id', e.target.value)} required>
                            <option value="">Select Product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td>
                          <span className={`badge ${Number(getProductStock(item.product_id)) > 10 ? 'badge-success' : Number(getProductStock(item.product_id)) > 0 ? 'badge-warning' : 'badge-danger'}`}>
                            {getProductStock(item.product_id)}
                          </span>
                        </td>
                        <td>
                          <input type="number" className="form-control form-control-sm" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} style={{ width: '90px' }} required />
                        </td>
                        <td>
                          <button type="button" className="btn-action delete" onClick={() => removeItem(idx)}><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="button" className="btn btn-outline-primary btn-sm mb-4 d-flex align-items-center" onClick={addItem}>
                <FiPlus className="me-1" /> Add Product
              </button>

              <hr />

              <div className="row g-3 mt-2">
                <div className="col-12 col-md-6">
                  <label>Reason *</label>
                  <select className="form-select" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required>
                    <option value="">Select Reason</option>
                    <option value="received">Stock Received</option>
                    <option value="damaged">Damaged Items</option>
                    <option value="expired">Expired Products</option>
                    <option value="count">Inventory Count</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label>Note</label>
                  <textarea className="form-control" rows={3} placeholder="Add a note..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link to="/adjustments" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
                <button type="submit" className="btn btn-primary-custom d-flex align-items-center" disabled={isLoading}>
                  {isLoading && <span className="spinner-border spinner-border-sm me-1" />}
                  {isEdit ? 'Update Adjustment' : 'Save Adjustment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAdjustment;
