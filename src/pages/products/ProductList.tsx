import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { useSettings } from '../../contexts/useSettings';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import * as productService from '../../services/productService';
import { getBrands } from '../../services/brandService';
import * as categoryService from '../../services/categoryService';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  brand: string;
  selling_price: number;
  purchase_price: number;
  quantity: number;
  status: string;
  image: string;
  description?: string;
  created_at?: string;
}

const ProductList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { hasPermission } = useAuth();
  const { currencySymbol, stockAlertThreshold } = useSettings();
  const { showToast } = useToast();

  const canManage = hasPermission('products.edit');

  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Array<{id:number;name:string}>>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{id:number;name:string}>>([]);

  useEffect(() => {
    productService.getProducts().then(res => setProducts(res.data.data)).catch(() => {});
    getBrands().then(r => setBrands(r.data.data)).catch(() => {});
    categoryService.getCategories().then(r => setCategoriesList(r.data.data)).catch(() => {});
  }, []);

  const resolveName = (val: any, list: Array<{id:number;name:string}>) => {
    if (!val) return '-';
    if (typeof val === 'object') return val.name || '-';
    const id = Number(val);
    const found = list.find(x => x.id === id);
    return found ? found.name : String(val);
  };

  const productCategoryId = (product: Product) => {
    // product.category may be id, name, or object
    if ((product as any).category_id) return String((product as any).category_id);
    if (typeof product.category === 'object') return String((product.category as any).id || '');
    return String(product.category || '');
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const brandName = resolveName(product.brand, brands);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || productCategoryId(product) === categoryFilter;
    const matchesStatus = !statusFilter ||
      (statusFilter === 'low-stock' && product.quantity <= stockAlertThreshold) ||
      (statusFilter === 'active' && product.quantity > stockAlertThreshold) ||
      (statusFilter === product.status?.toLowerCase());
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'badge-danger' };
    if (stock <= stockAlertThreshold) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'Active', class: 'badge-success' };
  };

  const categories = categoriesList;

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`, { state: { product } });
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      await productService.deleteProduct(selectedProduct.id);
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Product deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="product-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Product List</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Product List</span></div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="d-flex justify-content-start align-items-center col-12 col-md-8 gap-3">
              <div className="col-12 col-md-4">
                <div className="position-relative">
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    style={{ paddingLeft: '35px' }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4">
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
            </div>
            <div className="col-12 col-md-4 text-end d-flex justify-content-end align-items-center">
              <button className="btn btn-outline-secondary me-2 d-inline-flex align-items-center">
                <FiDownload className="me-1" />
                <span>Export</span>
              </button>
              {canManage && (
                <Link
                  to="/products/add"
                  className="btn btn-primary-custom d-inline-flex align-items-center"
                >
                  <FiPlus className="me-1" />
                  <span>Add Product</span>
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
                  const status = getStatus(product.quantity);
                  return (
                    <tr key={product.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={product.image || 'https://placehold.co/40x40?text=N/A'}
                            alt={product.name}
                            className="product-img"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=N/A'; }}
                          />
                          <span style={{ fontWeight: '500' }}>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.sku}</td>
                      <td>{resolveName(product.category, categories)}</td>
                      <td>{resolveName(product.brand, brands)}</td>
                      <td><strong>{currencySymbol}{product.selling_price}</strong></td>
                      <td>{product.quantity}</td>
                      <td>
                        <span className={`badge ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action view me-1" onClick={() => handleView(product)}>
                          <FiEye />
                        </button>
                        {canManage && (
                          <>
                            <button className="btn-action edit me-1" onClick={() => handleEdit(product)}>
                              <FiEdit />
                            </button>
                            <button className="btn-action delete" onClick={() => handleDeleteClick(product)}>
                              <FiTrash2 />
                            </button>
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

      {/* View Product Modal */}
      <ViewModal
        isOpen={showViewModal}
        title="Product Details"
        onClose={() => setShowViewModal(false)}
      >
        {selectedProduct && (
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <img
                src={selectedProduct.image || 'https://placehold.co/150x150?text=N/A'}
                alt={selectedProduct.name}
                style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150?text=N/A'; }}
              />
            </div>
            <div className="col-md-8">
              <DetailRow label="Name" value={<strong>{selectedProduct.name}</strong>} />
              <DetailRow label="SKU" value={selectedProduct.sku} />
              <DetailRow label="Category" value={resolveName(selectedProduct.category, categories)} />
              <DetailRow label="Brand" value={resolveName(selectedProduct.brand, brands)} />
              <DetailRow label="Price" value={<strong>{currencySymbol}{selectedProduct.selling_price}</strong>} />
              <DetailRow label="Cost Price" value={`${currencySymbol}${selectedProduct.purchase_price || 0}`} />
              <DetailRow label="Stock" value={selectedProduct.quantity} />
              <DetailRow
                label="Status"
                value={
                  <span className={`badge ${getStatus(selectedProduct.quantity).class}`}>
                    {getStatus(selectedProduct.quantity).label}
                  </span>
                }
              />
              <DetailRow label="Description" value={selectedProduct.description || 'N/A'} />
              <DetailRow label="Created Date" value={selectedProduct.created_at?.split('T')[0] || 'N/A'} />
            </div>
          </div>
        )}
      </ViewModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isLoading}
        variant="danger"
      />
    </div>
  );
};

export default ProductList;
