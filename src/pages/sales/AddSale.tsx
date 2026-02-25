import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const AddSale = () => {
  const [items, setItems] = useState([
    { id: 1, product: '', quantity: 1, price: 0, discount: 0, total: 0 }
  ]);

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
    {/* Page Header */}
    <div className="page-header">
      <h4>Add Sale</h4>
      <div className="breadcrumb-wrapper">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/sales">Sales</Link>
        <span>/</span>
        <span>Add Sale</span>
      </div>
    </div>

    <div className="row g-4">
      <div className="col-12">
        <div className="form-card">

          {/* Top Details */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label">Customer *</label>
              <select className="form-select">
                <option value="">Select Customer</option>
                <option value="1">John Doe</option>
                <option value="2">Tech World</option>
                <option value="3">Mobile Shop</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
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
                <select className="form-select">
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Note</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Add a note..."
                ></textarea>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary-custom align-items-center d-flex"
                >
                  Save Sale
                </button>

                <Link
                  to="/sales"
                  className="btn btn-secondary-custom d-flex align-items-center"
                >
                  Cancel
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default AddSale;
