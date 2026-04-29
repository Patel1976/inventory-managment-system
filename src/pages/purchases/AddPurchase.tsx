import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/components/common/Toast';

const AddPurchase = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const { state } = useLocation();
  const isEdit = !!id;
  const editData = state?.purchase;

  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [store, setStore] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isEdit && editData) {
      setSupplier(editData.supplier || '');
      setDate(editData.date || new Date().toISOString().split('T')[0]);
      setStore(editData.store === 'Main Store' ? '1' : editData.store === 'Branch 1' ? '2' : editData.store === 'Branch 2' ? '3' : '');
      setPaymentStatus(editData.due === 0 ? 'paid' : editData.paid === 0 ? 'unpaid' : 'partial');
    }
  }, [isEdit, editData]);
  const [items, setItems] = useState([
    { id: 1, product: '', quantity: 1, price: 0, total: 0 }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({ type: 'success', title: 'Success', message: isEdit ? 'Purchase updated successfully!' : 'Purchase added successfully!' });
    navigate('/purchases');
  };

  const addItem = () => {
    setItems([...items, { id: items.length + 1, product: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="add-purchase-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Purchase' : 'Add Purchase'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/purchases">Purchases</Link>
          <span>/</span>
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
                <select className="form-select" value={supplier} onChange={e => setSupplier(e.target.value)}>
                  <option value="">Select Supplier</option>
                  <option value="Tech Suppliers Inc">Tech Suppliers Inc</option>
                  <option value="Global Electronics">Global Electronics</option>
                  <option value="Premium Parts Ltd">Premium Parts Ltd</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Date *</label>
                <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Store *</label>
                <select className="form-select" value={store} onChange={e => setStore(e.target.value)}>
                  <option value="">Select Store</option>
                  <option value="1">Main Store</option>
                  <option value="2">Branch 1</option>
                  <option value="3">Branch 2</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="table-responsive mb-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Product</th>
                    <th>Quantity</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <select className="form-select form-select-sm">
                          <option value="">Select Product</option>
                          <option value="1">iPhone 14 Pro</option>
                          <option value="2">Samsung Galaxy S23</option>
                          <option value="3">MacBook Pro M2</option>
                        </select>
                      </td>
                      <td>
                        <input type="number" className="form-control form-control-sm" min="1" defaultValue="1" style={{ width: '80px' }} />
                      </td>
                      <td>
                        <input type="number" className="form-control form-control-sm" placeholder="0.00" style={{ width: '100px' }} />
                      </td>
                      <td><strong>$0.00</strong></td>
                      <td>
                        <button className="btn-action delete" onClick={() => removeItem(item.id)}><FiTrash2 /></button>
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

              {/* LEFT COLUMN → TOTALS */}
              <div className="col-12 col-md-4">

                <div className="summary-box p-3 rounded">

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>$0.00</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <strong>$0.00</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <strong>$0.00</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold fs-5">Grand Total:</span>
                    <strong className="fs-5 text-primary">$0.00</strong>
                  </div>

                </div>
              </div>

              {/* RIGHT COLUMN → PAYMENT + ACTIONS */}
              <div className="col-12 col-md-8">

                <div className="form-group mb-3">
                  <label className="form-label">Payment Status</label>
                  <select className="form-select" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Note</label>
                  <textarea className="form-control" rows={3} placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary-custom align-items-center d-flex">
                    {isEdit ? 'Update Purchase' : 'Save Purchase'}
                  </button>

                  <Link to="/purchases" className="btn btn-secondary-custom d-flex align-items-center">
                    Cancel
                  </Link>
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
