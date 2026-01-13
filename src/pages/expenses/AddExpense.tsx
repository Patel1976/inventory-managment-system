import { Link } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';

const AddExpense = () => {
  return (
    <div className="add-expense-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Add Expense</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/expenses">Expenses</Link>
          <span>/</span>
          <span>Add Expense</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <h5 className="mb-4">Expense Details</h5>
            
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="form-group mb-0">
                  <label>Category *</label>
                  <select className="form-select">
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
                  <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group mb-0">
                  <label>Store *</label>
                  <select className="form-select">
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
                  <input type="text" className="form-control" placeholder="Auto-generated" readOnly />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group mb-0">
                  <label>Amount *</label>
                  <input type="number" className="form-control" placeholder="0.00" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group mb-0">
                  <label>Payment Method</label>
                  <select className="form-select">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-0">
                  <label>Note</label>
                  <textarea className="form-control" rows={4} placeholder="Add a note..."></textarea>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group mb-0">
                  <label>Attachment</label>
                  <input type="file" className="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">Actions</h5>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary-custom">
                <FiSave className="me-2" /> Save Expense
              </button>
              <Link to="/expenses" className="btn btn-secondary-custom">
                <FiX className="me-2" /> Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
