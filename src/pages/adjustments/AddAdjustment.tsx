import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const AddAdjustment = () => {
  const [items, setItems] = useState([
    { id: 1, product: '', currentStock: 0, quantity: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: items.length + 1, product: '', currentStock: 0, quantity: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="add-adjustment-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Add Stock Adjustment</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/adjustments">Adjustments</Link>
          <span>/</span>
          <span>Add Adjustment</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <label className="form-label">Store *</label>
                <select className="form-select">
                  <option value="">Select Store</option>
                  <option value="1">Main Store</option>
                  <option value="2">Branch 1</option>
                  <option value="3">Branch 2</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Date *</label>
                <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Adjustment Type *</label>
                <select className="form-select">
                  <option value="addition">Addition</option>
                  <option value="subtraction">Subtraction</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="table-responsive mb-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Product</th>
                    <th>Current Stock</th>
                    <th>Quantity</th>
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
                      <td>-</td>
                      <td>
                        <input type="number" className="form-control form-control-sm" min="1" defaultValue="1" style={{ width: '80px' }} />
                      </td>
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
            <h5 className="mb-4">Adjustment Details</h5>
            
            <div className="form-group">
              <label>Reason *</label>
              <select className="form-select">
                <option value="">Select Reason</option>
                <option value="received">Stock Received</option>
                <option value="damaged">Damaged Items</option>
                <option value="expired">Expired Products</option>
                <option value="count">Inventory Count</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Note</label>
              <textarea className="form-control" rows={4} placeholder="Add a note..."></textarea>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary-custom">
                <FiSave className="me-2" /> Save Adjustment
              </button>
              <Link to="/adjustments" className="btn btn-secondary-custom">
                <FiX className="me-2" /> Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdjustment;
