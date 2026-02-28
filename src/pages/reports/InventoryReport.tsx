import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const InventoryReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const inventoryData = [
    { sku: 'SKU001', product: 'iPhone 14 Pro', category: 'Electronics', inStock: 120, sold: 45, purchasePrice: 800, sellingPrice: 999 },
    { sku: 'SKU002', product: 'Samsung Galaxy S23', category: 'Electronics', inStock: 85, sold: 38, purchasePrice: 700, sellingPrice: 899 },
    { sku: 'SKU003', product: 'MacBook Pro M2', category: 'Laptops', inStock: 42, sold: 32, purchasePrice: 1600, sellingPrice: 1999 },
    { sku: 'SKU004', product: 'Sony Headphones', category: 'Audio', inStock: 156, sold: 28, purchasePrice: 250, sellingPrice: 349 },
    { sku: 'SKU005', product: 'Apple Watch', category: 'Wearables', inStock: 68, sold: 25, purchasePrice: 300, sellingPrice: 399 },
    { sku: 'SKU006', product: 'Dell Monitor 27"', category: 'Electronics', inStock: 5, sold: 15, purchasePrice: 250, sellingPrice: 349 },
  ];

  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = inventoryData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="inventory-report-page">
      <div className="page-header">
        <h4>Inventory Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><Link to="/reports/inventory">Reports</Link><span>/</span><span>Inventory Report</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">Category</label>
              <select className="form-select">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Brand</label>
              <select className="form-select">
                <option value="">All Brands</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Stock Status</label>
              <select className="form-select">
                <option value="">All</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-end gap-2 justify-content-end">
              <button className="btn btn-primary-custom d-flex align-items-center"><FiFilter className="me-1" /> Filter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>476</h3><p>Total Products</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>$245,800</h3><p>Stock Value</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>183</h3><p>Total Sold</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#dc2626' }}>5</h3><p>Low Stock Items</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Inventory Details</h5>
          <div className="col-12 col-md-3 d-flex align-items-end gap-2 justify-content-end">
            <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Excel</button>
            <button className="btn btn-outline-secondary d-flex align-items-center"><FiFileText className="me-1" /> PDF</button>
          </div>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>In Stock</th><th>Sold</th><th>Purchase Price</th><th>Selling Price</th><th>Stock Value</th></tr></thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.sku}</td><td><strong>{item.product}</strong></td><td>{item.category}</td>
                    <td><span className={`badge ${item.inStock > 50 ? 'badge-success' : item.inStock > 10 ? 'badge-warning' : 'badge-danger'}`}>{item.inStock}</span></td>
                    <td>{item.sold}</td><td>${item.purchasePrice}</td><td>${item.sellingPrice}</td><td><strong>${(item.inStock * item.purchasePrice).toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {inventoryData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, inventoryData.length)} of {inventoryData.length} entries</div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FiChevronLeft /></button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><FiChevronRight /></button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
