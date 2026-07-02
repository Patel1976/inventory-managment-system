import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import * as brandService from '../../services/brandService';

interface Brand {
  id: number;
  name: string;
  logo: string;
  products_count?: number;
  status: 'Active' | 'Inactive';
  description?: string;
  created_at?: string;
}

const Brands = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('brands.manage');

  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const [brands, setBrands] = useState<Brand[]>([]);

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = brands.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    brandService.getBrands().then(res => setBrands(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [brands.length, totalPages, currentPage]);

  const handleView = (brand: Brand) => { setSelectedBrand(brand); setShowViewModal(true); };
  const handleEdit = (brand: Brand) => { setEditingBrand(brand); setFormData({ name: brand.name, status: brand.status, description: brand.description || '' }); };
  const handleDeleteClick = (brand: Brand) => { setSelectedBrand(brand); setShowDeleteDialog(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('status', formData.status);
    fd.append('description', formData.description);
    const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files?.[0]) fd.append('logo', fileInput.files[0]);
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, fd);
        showToast({ type: 'success', title: 'Success', message: 'Brand updated successfully!' });
        setEditingBrand(null);
      } else {
        await brandService.createBrand(fd);
        showToast({ type: 'success', title: 'Success', message: 'Brand added successfully!' });
      }
      const res = await brandService.getBrands();
      setBrands(res.data.data);
      setFormData({ name: '', status: 'Active', description: '' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Operation failed!' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;
    setIsLoading(true);
    try {
      await brandService.deleteBrand(selectedBrand.id);
      setBrands(prev => prev.filter(b => b.id !== selectedBrand.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Brand deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCancelEdit = () => { setEditingBrand(null); setFormData({ name: '', status: 'Active', description: '' }); };

  return (
    <div className="brands-page">
      <div className="page-header">
        <h4>Product Brands</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><span>Brands</span></div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand Name *</label>
                <input type="text" className="form-control" placeholder="Enter brand name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Brand Logo</label>
                <input type="file" className="form-control" accept="image/*" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} placeholder="Enter description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group mb-0">
                <label>Status</label>
                <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="d-flex gap-2 mt-4">
                {editingBrand && (
                  <button type="button" className="btn btn-secondary flex-fill" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn btn-primary-custom flex-fill d-flex align-items-center justify-content-center" disabled={isLoading}>
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  ) : (
                    <FiPlus className="me-2" />
                  )}
                  {editingBrand ? 'Update Brand' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="data-card">
            <div className="data-card-header"><h5>All Brands</h5></div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Logo</th><th>Brand Name</th><th>Products</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {paginatedData.map((brand, index) => (
                      <tr key={brand.id}>
                        <td>{startIndex + index + 1}</td>
                        <td><img src={brand.logo || 'https://placehold.co/40x40?text=N/A'} alt={brand.name} className="product-img" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=N/A'; }} /></td>
                        <td><strong>{brand.name}</strong></td>
                        <td>{brand.products_count ?? 0}</td>
                        <td><span className={`badge ${brand.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{brand.status}</span></td>
                        <td>
                          <button className="btn-action view me-1" onClick={() => handleView(brand)}><FiEye /></button>
                          {canManage && (
                            <>
                              <button className="btn-action edit me-1" onClick={() => handleEdit(brand)}><FiEdit /></button>
                              <button className="btn-action delete" onClick={() => handleDeleteClick(brand)}><FiTrash2 /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">Showing {brands.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, brands.length)} of {brands.length} entries</div>
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
      </div>

      <ViewModal isOpen={showViewModal} title="Brand Details" onClose={() => setShowViewModal(false)}>
        {selectedBrand && (
          <div className="row">
            <div className="col-md-3 text-center mb-3">
              <img src={selectedBrand.logo || 'https://placehold.co/80x80?text=N/A'} alt={selectedBrand.name} style={{ width: '100%', height: '80px', objectFit: 'contain', borderRadius: '8px' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=N/A'; }} />
            </div>
            <div className="col-md-9">
              <DetailRow label="Name" value={<strong>{selectedBrand.name}</strong>} />
              <DetailRow label="Products" value={selectedBrand.products_count ?? 0} />
              <DetailRow label="Status" value={<span className={`badge ${selectedBrand.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{selectedBrand.status}</span>} />
              <DetailRow label="Description" value={selectedBrand.description || 'N/A'} />
              <DetailRow label="Created Date" value={selectedBrand.created_at?.split('T')[0] || 'N/A'} />
            </div>
          </div>
        )}
      </ViewModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Brand"
        message={`Are you sure you want to delete "${selectedBrand?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isLoading}
        variant="danger"
      />
    </div>
  );
};

export default Brands;
