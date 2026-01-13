import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const products = [
    { id: 1, name: 'iPhone 14 Pro', sku: 'SKU001', category: 'Electronics', brand: 'Apple', price: 999, stock: 120, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Samsung Galaxy S23', sku: 'SKU002', category: 'Electronics', brand: 'Samsung', price: 899, stock: 85, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 3, name: 'MacBook Pro M2', sku: 'SKU003', category: 'Laptops', brand: 'Apple', price: 1999, stock: 42, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Sony Headphones WH-1000XM5', sku: 'SKU004', category: 'Audio', brand: 'Sony', price: 349, stock: 156, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Apple Watch Series 8', sku: 'SKU005', category: 'Wearables', brand: 'Apple', price: 399, stock: 68, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 6, name: 'Dell Monitor 27"', sku: 'SKU006', category: 'Electronics', brand: 'Dell', price: 349, stock: 5, status: 'Low Stock', image: 'https://via.placeholder.com/40' },
    { id: 7, name: 'Logitech MX Master 3', sku: 'SKU007', category: 'Accessories', brand: 'Logitech', price: 99, stock: 8, status: 'Low Stock', image: 'https://via.placeholder.com/40' },
    { id: 8, name: 'iPad Pro 12.9', sku: 'SKU008', category: 'Tablets', brand: 'Apple', price: 1099, stock: 35, status: 'Active', image: 'https://via.placeholder.com/40' },
  ];

  return (
    <div className="product-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Product List</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>Product List</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="low-stock">Low Stock</option>
              </select>
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2">
                <FiDownload className="me-1" /> Export
              </button>
              <Link to="/products/add" className="btn btn-primary-custom">
                <FiPlus className="me-1" /> Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="product-img"
                        />
                        <span style={{ fontWeight: '500' }}>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td><strong>${product.price}</strong></td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action view me-1"><FiEye /></button>
                      <Link to={`/products/edit/${product.id}`} className="btn-action edit me-1"><FiEdit /></Link>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing 1 to 8 of 248 entries
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                <li className="page-item active"><span className="page-link">1</span></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
