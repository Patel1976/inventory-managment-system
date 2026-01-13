import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', products: 45, status: 'Active' },
    { id: 2, name: 'Laptops', slug: 'laptops', products: 28, status: 'Active' },
    { id: 3, name: 'Audio', slug: 'audio', products: 32, status: 'Active' },
    { id: 4, name: 'Accessories', slug: 'accessories', products: 67, status: 'Active' },
    { id: 5, name: 'Wearables', slug: 'wearables', products: 19, status: 'Active' },
    { id: 6, name: 'Tablets', slug: 'tablets', products: 15, status: 'Active' },
    { id: 7, name: 'Gaming', slug: 'gaming', products: 42, status: 'Inactive' },
  ];

  return (
    <div className="categories-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Product Categories</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
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
              <div className="form-group">
                <label>Slug</label>
                <input type="text" className="form-control" placeholder="category-slug" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} placeholder="Enter description"></textarea>
              </div>
              <div className="form-group mb-0">
                <label>Status</label>
                <select className="form-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                      <th>Slug</th>
                      <th>Products</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td><strong>{category.name}</strong></td>
                        <td>{category.slug}</td>
                        <td>{category.products}</td>
                        <td>
                          <span className={`badge ${category.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                            {category.status}
                          </span>
                        </td>
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

export default Categories;
