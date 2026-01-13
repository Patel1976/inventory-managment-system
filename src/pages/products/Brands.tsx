import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const Brands = () => {
  const brands = [
    { id: 1, name: 'Apple', logo: 'https://via.placeholder.com/40', products: 35, status: 'Active' },
    { id: 2, name: 'Samsung', logo: 'https://via.placeholder.com/40', products: 28, status: 'Active' },
    { id: 3, name: 'Sony', logo: 'https://via.placeholder.com/40', products: 22, status: 'Active' },
    { id: 4, name: 'Dell', logo: 'https://via.placeholder.com/40', products: 18, status: 'Active' },
    { id: 5, name: 'Logitech', logo: 'https://via.placeholder.com/40', products: 24, status: 'Active' },
    { id: 6, name: 'Microsoft', logo: 'https://via.placeholder.com/40', products: 15, status: 'Active' },
    { id: 7, name: 'HP', logo: 'https://via.placeholder.com/40', products: 12, status: 'Inactive' },
  ];

  return (
    <div className="brands-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Product Brands</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>Brands</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Add Brand Form */}
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">Add Brand</h5>
            <form>
              <div className="form-group">
                <label>Brand Name *</label>
                <input type="text" className="form-control" placeholder="Enter brand name" />
              </div>
              <div className="form-group">
                <label>Brand Logo</label>
                <input type="file" className="form-control" accept="image/*" />
              </div>
              <div className="form-group mb-0">
                <label>Status</label>
                <select className="form-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary-custom w-100 mt-4">
                <FiPlus className="me-2" /> Add Brand
              </button>
            </form>
          </div>
        </div>

        {/* Brands List */}
        <div className="col-12 col-lg-8">
          <div className="data-card">
            <div className="data-card-header">
              <h5>All Brands</h5>
            </div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Logo</th>
                      <th>Brand Name</th>
                      <th>Products</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((brand, index) => (
                      <tr key={brand.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={brand.logo} alt={brand.name} className="product-img" />
                        </td>
                        <td><strong>{brand.name}</strong></td>
                        <td>{brand.products}</td>
                        <td>
                          <span className={`badge ${brand.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                            {brand.status}
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

export default Brands;
