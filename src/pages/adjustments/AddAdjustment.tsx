import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useToast } from '@/components/common/Toast';

const AddAdjustment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    store: '',
    date: new Date().toISOString().split('T')[0],
    adjustmentType: 'addition',
    reason: '',
    note: ''
  });
  const [items, setItems] = useState([
    { id: 1, product: '', currentStock: 0, quantity: 1 }
  ]);

  useEffect(() => {
    if (isEditMode) {
      // TODO: Fetch adjustment data by id
      const mockData = {
        store: '1',
        date: '2024-01-15',
        adjustmentType: 'addition',
        reason: 'received',
        note: 'Stock received from supplier'
      };
      setFormData(mockData);
      setItems([{ id: 1, product: '1', currentStock: 100, quantity: 50 }]);
    }
  }, [isEditMode]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), product: '', currentStock: 0, quantity: 1 }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(item => !item.product)) {
      alert('Please select products for all items');
      return;
    }
    const adjustmentData = {
      ...formData,
      items: items.map(({ id, ...rest }) => rest),
      createdAt: new Date().toISOString()
    };
    showToast({ type: 'success', title: 'Success', message: isEditMode ? 'Adjustment updated successfully' : 'Adjustment created successfully' });
    navigate('/adjustments');
  };

  return (
    <div className="add-adjustment-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>{isEditMode ? 'Edit Stock Adjustment' : 'Add Stock Adjustment'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/adjustments">Adjustments</Link>
          <span>/</span>
          <span>{isEditMode ? 'Edit Adjustment' : 'Add Adjustment'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-card">

              {/* Top Details */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <label className="form-label">Store *</label>
                  <select 
                    className="form-select"
                    value={formData.store}
                    onChange={(e) => setFormData({...formData, store: e.target.value})}
                    required
                  >
                    <option value="">Select Store</option>
                    <option value="1">Main Store</option>
                    <option value="2">Branch 1</option>
                    <option value="3">Branch 2</option>
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Adjustment Type *</label>
                  <select 
                    className="form-select"
                    value={formData.adjustmentType}
                    onChange={(e) => setFormData({...formData, adjustmentType: e.target.value})}
                  >
                    <option value="addition">Addition</option>
                    <option value="subtraction">Subtraction</option>
                  </select>
                </div>
              </div>

              {/* Product Table */}
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
                          <select 
                            className="form-select form-select-sm"
                            value={item.product}
                            onChange={(e) => {
                              const updated = items.map(i => 
                                i.id === item.id ? {...i, product: e.target.value} : i
                              );
                              setItems(updated);
                            }}
                            required
                          >
                            <option value="">Select Product</option>
                            <option value="1">iPhone 14 Pro</option>
                            <option value="2">Samsung Galaxy S23</option>
                            <option value="3">MacBook Pro M2</option>
                          </select>
                        </td>

                        <td>-</td>

                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = items.map(i => 
                                i.id === item.id ? {...i, quantity: parseInt(e.target.value) || 1} : i
                              );
                              setItems(updated);
                            }}
                            style={{ width: '80px' }}
                            required
                          />
                        </td>

                        <td>
                          <button
                            type="button"
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
                className="btn btn-outline-primary btn-sm mb-4 d-flex align-items-center"
                onClick={addItem}
              >
                <FiPlus className="me-1" /> Add Product
              </button>

              {/* Divider */}
              <hr />

              {/* Adjustment Extra Details */}
              <div className="row g-3 mt-3">
                <div className="col-12 col-md-6">
                  <label>Reason *</label>
                  <select 
                    className="form-select"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    required
                  >
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
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link to="/adjustments" className="btn btn-secondary-custom d-flex align-items-center">
                  Cancel
                </Link>

                <button type="submit" className="btn btn-primary-custom">
                  {isEditMode ? 'Update Adjustment' : 'Save Adjustment'}
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