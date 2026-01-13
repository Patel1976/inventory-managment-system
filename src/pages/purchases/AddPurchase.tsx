import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const AddPurchase = () => {
  const [items, setItems] = useState([
    { id: 1, product: '', quantity: 1, price: 0, total: 0 }
  ]);

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
      {/* Page Header */}
      <div className="page-header">
        <h4>Add Purchase</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/purchases">Purchases</Link>
          <span>/</span>
          <span>Add Purchase</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <label className="form-label">Supplier *</label>
                <select className="form-select">
                  <option value="">Select Supplier</option>
                  <option value="1">Tech Suppliers Inc</option>
                  <option value="2">Global Electronics</option>
                  <option value="3">Premium Parts Ltd</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Date *</label>
                <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Store *</label>
                <select className="form-select">
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

            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addItem}>
              <FiPlus className="me-1" /> Add Product
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">Purchase Summary</h5>
            
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
            <div className="d-flex justify-content-between mb-4">
              <span style={{ fontSize: '18px', fontWeight: '600' }}>Grand Total:</span>
              <strong style={{ fontSize: '18px', color: '#2e3192' }}>$0.00</strong>
            </div>

            <div className="form-group">
              <label>Payment Status</label>
              <select className="form-select">
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea className="form-control" rows={3} placeholder="Add a note..."></textarea>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary-custom">
                <FiSave className="me-2" /> Save Purchase
              </button>
              <Link to="/purchases" className="btn btn-secondary-custom">
                <FiX className="me-2" /> Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPurchase;
