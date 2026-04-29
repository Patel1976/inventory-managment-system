import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/components/common/Toast';

const AddSale = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const { state } = useLocation();
  const isEdit = !!id;
  const editData = state?.sale;

  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [store, setStore] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isEdit && editData) {
      setCustomer(editData.customer || '');
      setDate(editData.date || new Date().toISOString().split('T')[0]);
      setStore(editData.store === 'Main Store' ? '1' : editData.store === 'Branch 1' ? '2' : editData.store === 'Branch 2' ? '3' : '');
      setPaymentStatus(editData.paymentStatus?.toLowerCase() || 'paid');
    }
  }, [isEdit, editData]);
  const [items, setItems] = useState([
    { id: 1, product: '', quantity: 1, price: 0, discount: 0, total: 0 }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({ type: 'success', title: 'Success', message: isEdit ? 'Sale updated successfully!' : 'Sale added successfully!' });
    navigate('/sales');
  };

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      product: '', 
      quantity: 1, 
      price: 0, 
      discount: 0, 
      total: 0 
    }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
  <div className="add-sale-page">
    <div className="page-header">
      <h4>{isEdit ? 'Edit Sale' : 'Add Sale'}</h4>
      <div className="breadcrumb-wrapper">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/sales">Sales</Link>
        <span>/</span>
        <span>{isEdit ? 'Edit Sale' : 'Add Sale'}</span>
      </div>
    </div>

    <form onSubmit={handleSubmit}>
    <div className="row g-4">
      <div className="col-12">
        <div className="form-card">

          {/* Top Details */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label">Customer *</label>
              <select className="form-select" value={customer} onChange={e => setCustomer(e.target.value)}>
                <option value="">Select Customer</option>
                <option value="John Doe">John Doe</option>
                <option value="Tech World">Tech World</option>
                <option value="Mobile Shop">Mobile Shop</option>
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

          {/* Products Table */}
          <div className="table-responsive mb-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Product</th>
                  <th>Quantity</th>
                  <th>Selling Price</th>
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
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        defaultValue="1"
                        style={{ width: '80px' }}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="0.00"
                        style={{ width: '100px' }}
                      />
                    </td>

                    <td>
                      <strong>$0.00</strong>
                    </td>

                    <td>
                      <button
                        className="btn-action delete"
                        onClick={() => removeItem(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center"
            onClick={addItem}
          >
            <FiPlus className="me-1" /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="col-12">
        <div className="form-card">
          <h5 className="mb-4">Sale Summary</h5>

          <div className="row g-4">

            {/* LEFT → TOTALS */}
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
                  <span>Discount:</span>
                  <strong>$0.00</strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <span className="fw-semibold fs-5">Grand Total:</span>
                  <strong className="fs-5 text-primary">$0.00</strong>
                </div>

              </div>
            </div>

            {/* RIGHT → PAYMENT + ACTIONS */}
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
                  {isEdit ? 'Update Sale' : 'Save Sale'}
                </button>

                <Link to="/sales" className="btn btn-secondary-custom d-flex align-items-center">
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

export default AddSale;
