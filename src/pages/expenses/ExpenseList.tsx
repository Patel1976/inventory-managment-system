import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';

const ExpenseList = () => {
  const expenses = [
    { id: 1, date: '2024-01-15', category: 'Rent', reference: 'EXP-001', store: 'Main Store', amount: 2500.00, note: 'Monthly rent payment' },
    { id: 2, date: '2024-01-14', category: 'Utilities', reference: 'EXP-002', store: 'Main Store', amount: 450.00, note: 'Electricity bill' },
    { id: 3, date: '2024-01-13', category: 'Salary', reference: 'EXP-003', store: 'All Stores', amount: 8500.00, note: 'Staff salaries' },
    { id: 4, date: '2024-01-12', category: 'Marketing', reference: 'EXP-004', store: 'Main Store', amount: 1200.00, note: 'Facebook ads' },
    { id: 5, date: '2024-01-11', category: 'Maintenance', reference: 'EXP-005', store: 'Branch 1', amount: 350.00, note: 'AC repair' },
  ];

  return (
    <div className="expense-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Expense List</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Expenses</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Categories</option>
                <option value="rent">Rent</option>
                <option value="utilities">Utilities</option>
                <option value="salary">Salary</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2"><FiDownload className="me-1" /> Export</button>
              <Link to="/expenses/add" className="btn btn-primary-custom"><FiPlus className="me-1" /> Add Expense</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Category</th>
                  <th>Store</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{index + 1}</td>
                    <td>{expense.date}</td>
                    <td><strong>{expense.reference}</strong></td>
                    <td>
                      <span className="badge badge-info">{expense.category}</span>
                    </td>
                    <td>{expense.store}</td>
                    <td><strong>${expense.amount.toFixed(2)}</strong></td>
                    <td>{expense.note}</td>
                    <td>
                      <button className="btn-action view me-1"><FiEye /></button>
                      <button className="btn-action edit me-1"><FiEdit /></button>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
