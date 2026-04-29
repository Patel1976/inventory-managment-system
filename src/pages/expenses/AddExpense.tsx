import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/common/Toast';

const AddExpense = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();
  const { state } = useLocation();
  const isEdit = !!id;
  const editData = state?.expense;

  const [formData, setFormData] = useState({
    category: '',
    date: new Date().toISOString().split('T')[0],
    store: '',
    reference: '',
    amount: '',
    paymentMethod: 'cash',
    note: '',
    attachment: null as File | null,
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData(prev => ({
        ...prev,
        category: editData.category?.toLowerCase() || '',
        date: editData.date || prev.date,
        store: editData.store === 'Main Store' ? '1' : editData.store === 'Branch 1' ? '2' : editData.store === 'Branch 2' ? '3' : editData.store === 'All Stores' ? 'all' : '',
        reference: editData.reference || '',
        amount: editData.amount?.toString() || '',
        note: editData.note || '',
      }));
    }
  }, [isEdit, editData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'attachment' && files) {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast({ type: 'success', title: 'Success', message: isEdit ? 'Expense updated successfully!' : 'Expense added successfully!' });
      navigate('/expenses');
    }, 500);
  };

  return (
    <div className="add-expense-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>{isEdit ? 'Edit Expense' : 'Add Expense'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/expenses">Expenses</Link>
          <span>/</span>
          <span>{isEdit ? 'Edit Expense' : 'Add Expense'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-card">
              <h5 className="mb-4">Expense Details</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Category *</label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="rent">Rent</option>
                      <option value="utilities">Utilities</option>
                      <option value="salary">Salary</option>
                      <option value="marketing">Marketing</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Store *</label>
                    <select
                      name="store"
                      className="form-select"
                      value={formData.store}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Store</option>
                      <option value="1">Main Store</option>
                      <option value="2">Branch 1</option>
                      <option value="3">Branch 2</option>
                      <option value="all">All Stores</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Reference No</label>
                    <input
                      type="text"
                      name="reference"
                      className="form-control"
                      placeholder="Auto-generated"
                      value={formData.reference}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Amount *</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Payment Method</label>
                    <select
                      name="paymentMethod"
                      className="form-select"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Note</label>
                    <textarea
                      className="form-control"
                      name="note"
                      rows={4}
                      placeholder="Add a note..."
                      value={formData.note}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Attachment</label>
                    <input
                      type="file"
                      name="attachment"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Buttons Inside Same Card */}
                <div className="col-12 mt-4 d-flex justify-content-end">
                  <div className="d-flex gap-2">
                    <Link to="/expenses" className="btn btn-secondary-custom d-flex align-items-center">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary-custom"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Expense'}
                    </button>
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

export default AddExpense;
