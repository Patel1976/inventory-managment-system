import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { isAdmin } = useAuth();
  const { currencySymbol, stockAlertThreshold } = useSettings();
  
  const products = [
    { id: 1, name: 'iPhone 14 Pro', sku: 'SKU001', category: 'Electronics', brand: 'Apple', price: 999, stock: 120, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Samsung Galaxy S23', sku: 'SKU002', category: 'Electronics', brand: 'Samsung', price: 899, stock: 85, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 3, name: 'MacBook Pro M2', sku: 'SKU003', category: 'Laptops', brand: 'Apple', price: 1999, stock: 42, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Sony Headphones WH-1000XM5', sku: 'SKU004', category: 'Audio', brand: 'Sony', price: 349, stock: 156, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Apple Watch Series 8', sku: 'SKU005', category: 'Wearables', brand: 'Apple', price: 399, stock: 68, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 6, name: 'Dell Monitor 27"', sku: 'SKU006', category: 'Electronics', brand: 'Dell', price: 349, stock: 5, status: 'Low Stock', image: 'https://via.placeholder.com/40' },
    { id: 7, name: 'Logitech MX Master 3', sku: 'SKU007', category: 'Accessories', brand: 'Logitech', price: 99, stock: 8, status: 'Low Stock', image: 'https://via.placeholder.com/40' },
    { id: 8, name: 'iPad Pro 12.9', sku: 'SKU008', category: 'Tablets', brand: 'Apple', price: 1099, stock: 35, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 9, name: 'AirPods Pro 2', sku: 'SKU009', category: 'Audio', brand: 'Apple', price: 249, stock: 92, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 10, name: 'ThinkPad X1 Carbon', sku: 'SKU010', category: 'Laptops', brand: 'Lenovo', price: 1599, stock: 28, status: 'Active', image: 'https://via.placeholder.com/40' },
    { id: 11, name: 'USB-C Hub', sku: 'SKU011', category: 'Accessories', brand: 'Anker', price: 49, stock: 3, status: 'Low Stock', image: 'https://via.placeholder.com/40' },
    { id: 12, name: 'Mechanical Keyboard', sku: 'SKU012', category: 'Accessories', brand: 'Keychron', price: 89, stock: 45, status: 'Active', image: 'https://via.placeholder.com/40' },
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'low-stock' && product.stock <= stockAlertThreshold) ||
      (statusFilter === 'active' && product.stock > stockAlertThreshold) ||
      (statusFilter === product.status.toLowerCase());
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getStatus = (stock: number) => {
    if (stock <= stockAlertThreshold) return { label: 'Low Stock', class: 'badge-warning' };
    if (stock === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    return { label: 'Active', class: 'badge-success' };
  };

  const categories = [...new Set(products.map(p => p.category))];

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

      {/* Filters & Actions Bar */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select 
                className="form-select"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="low-stock">Low Stock</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <div className="input-group">
                <span className="input-group-text"><FiCalendar /></span>
                <input type="date" className="form-control" placeholder="From date" />
              </div>
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2">
                <FiDownload className="me-1" /> Export
              </button>
              {isAdmin && (
                <Link to="/products/add" className="btn btn-primary-custom">
                  <FiPlus className="me-1" /> Add Product
                </Link>
              )}
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
                {paginatedProducts.map((product) => {
                  const status = getStatus(product.stock);
                  return (
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
                      <td><strong>{currencySymbol}{product.price}</strong></td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`badge ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action view me-1"><FiEye /></button>
                        {isAdmin && (
                          <>
                            <Link to={`/products/edit/${product.id}`} className="btn-action edit me-1"><FiEdit /></Link>
                            <button className="btn-action delete"><FiTrash2 /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
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
