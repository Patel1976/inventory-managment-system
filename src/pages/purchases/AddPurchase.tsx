import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/components/common/Toast';
import { useSettings } from '../../contexts/useSettings';
import * as purchaseService from '../../services/purchaseService';
import { getSuppliers, getStores } from '../../services/commonService';
import { getProducts } from '../../services/productService';

interface Supplier { id: number; name: string; }
interface Store { id: number; name: string; }
interface Product { id: number; name: string; purchase_price: number; tax: number; }
interface Item { product_id: string; quantity: number; unit_cost: number; tax_percent: number; }

const AddPurchase = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();
  const { id } = useParams();
  const { state } = useLocation();
  const isEdit = !!id;
  const editData = state?.purchase;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    supplier_id: '',
    store_id: '',
    date: new Date().toISOString().split('T')[0],
    tax: 0,
    shipping: 0,
    paid: 0,
    payment_status: 'paid',
    status: 'Ordered',
    note: '',
  });

  const [items, setItems] = useState<Item[]>([{ product_id: '', quantity: 1, unit_cost: 0, tax_percent: 0 }]);

  useEffect(() => {
    getSuppliers().then(r => setSuppliers(r.data.data)).catch(() => {});
    getStores().then(r => setStores(r.data.data)).catch(() => {});
    getProducts().then(r => setProducts(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editData) {
      setForm({
        supplier_id: String(editData.supplier?.id || ''),
        store_id: String(editData.store?.id || ''),
        date: editData.date || new Date().toISOString().split('T')[0],
        tax: editData.tax || 0,
        shipping: editData.shipping || 0,
        paid: editData.paid || 0,
        payment_status: editData.payment_status || 'paid',
        status: editData.status || 'Ordered',
        note: editData.note || '',
      });
      if (editData.items?.length) {
        setItems(editData.items.map((i: any) => ({
          product_id: String(i.product_id),
          quantity: i.quantity,
          unit_cost: i.unit_cost,
          tax_percent: i.tax_percent || 0,
        })));
      }
    }
  }, [isEdit, editData]);

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_cost, 0);
  const totalTax = items.reduce((sum, i) => sum + (i.quantity * i.unit_cost * i.tax_percent / 100), 0);
  const grandTotal = subtotal + totalTax + Number(form.shipping);

  const addItem = () => setItems([...items, { product_id: '', quantity: 1, unit_cost: 0 }]);
  const removeItem = (idx: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== idx)); };

  const updateItem = (idx: number, field: keyof Item, value: string | number) => {
    const updated = [...items];
    if (field === 'product_id') {
      updated[idx].product_id = String(value);
      const prod = products.find(p => p.id === Number(value));
      if (prod) { updated[idx].unit_cost = prod.purchase_price; updated[idx].tax_percent = prod.tax || 0; }
    } else {
      (updated[idx] as any)[field] = Number(value);
    }
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      ...form,
      supplier_id: Number(form.supplier_id),
      store_id: Number(form.store_id),
      tax: Number(form.tax),
      shipping: Number(form.shipping),
      paid: Number(form.paid),
      items: items.map(i => ({ ...i, product_id: Number(i.product_id), tax_percent: i.tax_percent })),
    };
    try {
      if (isEdit) {
        await purchaseService.updatePurchase(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Purchase updated successfully!' });
      } else {
        await purchaseService.createPurchase(payload);
        showToast({ type: 'success', title: 'Success', message: 'Purchase created successfully!' });
      }
      navigate('/purchases');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-purchase-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Purchase' : 'Add Purchase'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/purchases">Purchases</Link><span>/</span>
          <span>{isEdit ? 'Edit Purchase' : 'Add Purchase'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12">
            <div className="form-card">
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <label className="form-label">Supplier *</label>
                  <select className="form-select" value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Store *</label>
                  <select className="form-select" value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })} required>
                    <option value="">Select Store</option>
                    {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label">Status *</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="Ordered">Ordered</option>
                    <option value="Pending">Pending</option>
                    <option value="Received">Received</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive mb-3">
                <table className="data-table">
                  <thead>
                    <tr><th style={{ width: '40%' }}>Product</th><th>Quantity</th><th>Unit Cost</th><th>Tax (%)</th><th>Tax Amount</th><th>Total</th><th>Action</th></tr>
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
                          <input type="number" className="form-control form-control-sm" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} style={{ width: '80px' }} required />
                        </td>
                        <td>
                          <div className="input-group input-group-sm" style={{ width: '130px' }}>
                            <span className="input-group-text">{currencySymbol}</span>
                            <input type="number" className="form-control" min="0" step="0.01" value={item.unit_cost} onChange={e => updateItem(idx, 'unit_cost', e.target.value)} required />
                          </div>
                        </td>
                        <td><span className="text-muted">{item.tax_percent}%</span></td>
                        <td><span className="text-warning">{currencySymbol}{(item.quantity * item.unit_cost * item.tax_percent / 100).toFixed(2)}</span></td>
                        <td><strong>{currencySymbol}{(item.quantity * item.unit_cost + item.quantity * item.unit_cost * item.tax_percent / 100).toFixed(2)}</strong></td>
                        <td>
                          <button type="button" className="btn-action delete" onClick={() => removeItem(idx)}><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={addItem}>
                <FiPlus className="me-1" /> Add Product
              </button>
            </div>
          </div>

          <div className="col-12">
            <div className="form-card">
              <h5 className="mb-4">Purchase Summary</h5>
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <div className="summary-box p-3 rounded">
                    <div className="d-flex justify-content-between mb-2"><span>Subtotal:</span><strong>{currencySymbol}{subtotal.toFixed(2)}</strong></div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax:</span>
                      <strong className="text-warning">{currencySymbol}{totalTax.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2 align-items-center">
                      <span>Shipping:</span>
                      <div className="input-group input-group-sm" style={{ width: '120px' }}>
                        <span className="input-group-text">{currencySymbol}</span>
                        <input type="number" className="form-control" min="0" step="0.01" value={form.shipping} onChange={e => setForm({ ...form, shipping: Number(e.target.value) })} />
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold fs-5">Grand Total:</span>
                      <strong className="fs-5 text-primary">{currencySymbol}{grandTotal.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-8">
                  <div className="form-group mb-3">
                    <label className="form-label">Amount Paid</label>
                    <div className="input-group">
                      <span className="input-group-text">{currencySymbol}</span>
                      <input type="number" className="form-control" min="0" step="0.01" value={form.paid} onChange={e => setForm({ ...form, paid: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Payment Status</label>
                    <select className="form-select" value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })}>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" rows={3} placeholder="Add a note..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary-custom d-flex align-items-center" disabled={isLoading}>
                      {isLoading ? <span className="spinner-border spinner-border-sm me-1" /> : null}
                      {isEdit ? 'Update Purchase' : 'Save Purchase'}
                    </button>
                    <Link to="/purchases" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
