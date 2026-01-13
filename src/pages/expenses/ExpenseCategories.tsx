import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const ExpenseCategories = () => {
  const categories = [
    { id: 1, name: 'Rent', description: 'Office and store rent payments', expenses: 12, total: 30000.00 },
    { id: 2, name: 'Utilities', description: 'Electricity, water, internet bills', expenses: 24, total: 5400.00 },
    { id: 3, name: 'Salary', description: 'Staff salaries and wages', expenses: 12, total: 102000.00 },
    { id: 4, name: 'Marketing', description: 'Advertising and promotions', expenses: 8, total: 4800.00 },
    { id: 5, name: 'Maintenance', description: 'Equipment and facility maintenance', expenses: 15, total: 3200.00 },
    { id: 6, name: 'Transportation', description: 'Delivery and logistics costs', expenses: 18, total: 2100.00 },
  ];

  return (
    <div className="expense-categories-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Expense Categories</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/expenses">Expenses</Link>
          <span>/</span>
          <span>Categories</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Add Category Form */}
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">Add Category</h5>
            <form>
              <div className="form-group">
                <label>Category Name *</label>
                <input type="text" className="form-control" placeholder="Enter category name" />
              </div>
              <div className="form-group mb-0">
                <label>Description</label>
                <textarea className="form-control" rows={3} placeholder="Enter description"></textarea>
              </div>
              <button type="submit" className="btn btn-primary-custom w-100 mt-4">
                <FiPlus className="me-2" /> Add Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="col-12 col-lg-8">
          <div className="data-card">
            <div className="data-card-header">
              <h5>All Categories</h5>
            </div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Expenses</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td><strong>{category.name}</strong></td>
                        <td>{category.description}</td>
                        <td>{category.expenses}</td>
                        <td><strong>${category.total.toLocaleString()}</strong></td>
                        <td>
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
      </div>
    </div>
  );
};

export default ExpenseCategories;
