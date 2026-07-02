import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { useSettings } from '../../contexts/useSettings';
import { getInventoryReport } from '../../services/reportService';

interface Product { id: number; sku: string; name: string; category: string; brand: string; quantity: number; purchase_price: number; selling_price: number; total_sold?: number; stock_value?: number; }
interface Summary { total_products: number; total_stock_value: number; total_sold: number; low_stock_items: number; out_of_stock: number; }

const InventoryReport = () => {
  const { currencySymbol } = useSettings();
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<Summary>({ total_products: 0, total_stock_value: 0, total_sold: 0, low_stock_items: 0, out_of_stock: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = (params?: object) => {
    getInventoryReport(params).then(r => {
      const data: Product[] = r.data.data;
      setProducts(data);
      setSummary(r.data.summary);
      setCategories([...new Set(data.map(p => p.category).filter(Boolean))]);
      setBrands([...new Set(data.map(p => p.brand).filter(Boolean))]);
      setCurrentPage(1);
    }).catch(() => {});
  };

  const handleFilter = () => {
    const params: any = {};
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (stockStatus) params.stock_status = stockStatus;
    fetchReport(params);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = products.slice(startIndex, startIndex + itemsPerPage);

  const stockBadge = (qty: number) => qty === 0 ? 'badge-danger' : qty <= 10 ? 'badge-warning' : 'badge-success';

  return (
    <div className="inventory-report-page">
      <div className="page-header">
        <h4>Inventory Report</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Inventory Report</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Brand</label>
              <select className="form-select" value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Stock Status</label>
              <select className="form-select" value={stockStatus} onChange={e => setStockStatus(e.target.value)}>
                <option value="">All</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-end">
              <button className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center" onClick={handleFilter}>
                <FiFilter className="me-1" /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_products}</h3><p>Total Products</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{currencySymbol}{Number(summary.total_stock_value).toLocaleString()}</h3><p>Stock Value</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3>{summary.total_sold}</h3><p>Total Sold</p></div></div></div>
        <div className="col-12 col-md-3"><div className="stat-card"><div className="stat-content"><h3 style={{ color: '#dc2626' }}>{summary.low_stock_items}</h3><p>Low Stock Items</p></div></div></div>
      </div>

      <div className="data-card">
        <div className="data-card-header d-flex justify-content-between align-items-center">
          <h5>Inventory Details</h5>
          <button className="btn btn-outline-secondary d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
        </div>
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Brand</th><th>In Stock</th><th>Sold</th><th>Purchase Price</th><th>Selling Price</th><th>Stock Value</th></tr></thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-4 text-muted">No data found</td></tr>
                ) : paginatedData.map(item => (
                  <tr key={item.id}>
                    <td>{item.sku}</td>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category || '-'}</td>
                    <td>{item.brand || '-'}</td>
                    <td><span className={`badge ${stockBadge(item.quantity)}`}>{item.quantity}</span></td>
                    <td>{item.total_sold ?? 0}</td>
                    <td>{currencySymbol}{Number(item.purchase_price).toFixed(2)}</td>
                    <td>{currencySymbol}{Number(item.selling_price).toFixed(2)}</td>
                    <td><strong>{currencySymbol}{Number(item.stock_value ?? item.quantity * item.purchase_price).toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {products.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, products.length)} of {products.length} entries</div>
            <nav><ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button></li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button></li>;
              })}
              <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button></li>
            </ul></nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
