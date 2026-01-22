import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Brand {
  id: number;
  name: string;
  logo: string;
  products: number;
  status: 'Active' | 'Inactive';
  description?: string;
  createdDate?: string;
}

const Brands = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('brands.manage');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    status: 'Active' as 'Active' | 'Inactive',
    description: ''
  });

  const [brands, setBrands] = useState<Brand[]>([
    { id: 1, name: 'Apple', logo: 'https://via.placeholder.com/40', products: 35, status: 'Active', description: 'Technology company', createdDate: '2024-01-15' },
    { id: 2, name: 'Samsung', logo: 'https://via.placeholder.com/40', products: 28, status: 'Active', description: 'Electronics manufacturer', createdDate: '2024-01-14' },
    { id: 3, name: 'Sony', logo: 'https://via.placeholder.com/40', products: 22, status: 'Active', description: 'Entertainment company', createdDate: '2024-01-13' },
    { id: 4, name: 'Dell', logo: 'https://via.placeholder.com/40', products: 18, status: 'Active', description: 'Computer manufacturer', createdDate: '2024-01-12' },
    { id: 5, name: 'Logitech', logo: 'https://via.placeholder.com/40', products: 24, status: 'Active', description: 'Peripherals manufacturer', createdDate: '2024-01-11' },
    { id: 6, name: 'Microsoft', logo: 'https://via.placeholder.com/40', products: 15, status: 'Active', description: 'Software company', createdDate: '2024-01-10' },
    { id: 7, name: 'HP', logo: 'https://via.placeholder.com/40', products: 12, status: 'Inactive', description: 'Computing devices', createdDate: '2024-01-09' },
  ]);

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowViewModal(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      status: brand.status,
      description: brand.description || ''
    });
  };

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (editingBrand) {
        setBrands(prev => prev.map(b => 
          b.id === editingBrand.id 
            ? { ...b, ...formData }
            : b
        ));
        showToast({ type: 'success', title: 'Success', message: 'Brand updated successfully!' });
        setEditingBrand(null);
      } else {
        const newBrand: Brand = {
          id: brands.length + 1,
          name: formData.name,
          logo: 'https://via.placeholder.com/40',
          products: 0,
          status: formData.status,
          description: formData.description,
          createdDate: new Date().toISOString().split('T')[0]
        };
        setBrands(prev => [...prev, newBrand]);
        showToast({ type: 'success', title: 'Success', message: 'Brand added successfully!' });
      }
      setFormData({ name: '', status: 'Active', description: '' });
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setBrands(prev => prev.filter(b => b.id !== selectedBrand?.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      showToast({ type: 'success', title: 'Deleted', message: 'Brand deleted successfully!' });
    }, 500);
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setFormData({ name: '', status: 'Active', description: '' });
  };

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
        {/* Add/Edit Brand Form */}
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">{editingBrand ? 'Edit Brand' : 'Add Brand'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter brand name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand Logo</label>
                <input type="file" className="form-control" accept="image/*" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  rows={3} 
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group mb-0">
                <label>Status</label>
                <select 
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                >
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
                <button type="submit" className="btn btn-primary-custom flex-fill" disabled={isLoading}>
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
                          <button className="btn-action view me-1" onClick={() => handleView(brand)}>
                            <FiEye />
                          </button>
                          {canManage && (
                            <>
                              <button className="btn-action edit me-1" onClick={() => handleEdit(brand)}>
                                <FiEdit />
                              </button>
                              <button className="btn-action delete" onClick={() => handleDeleteClick(brand)}>
                                <FiTrash2 />
                              </button>
                            </>
                          )}
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

      {/* View Brand Modal */}
      <ViewModal
        isOpen={showViewModal}
        title="Brand Details"
        onClose={() => setShowViewModal(false)}
      >
        {selectedBrand && (
          <div className="row">
            <div className="col-md-3 text-center mb-3">
              <img 
                src={selectedBrand.logo} 
                alt={selectedBrand.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="col-md-9">
              <DetailRow label="Name" value={<strong>{selectedBrand.name}</strong>} />
              <DetailRow label="Products" value={selectedBrand.products} />
              <DetailRow 
                label="Status" 
                value={
                  <span className={`badge ${selectedBrand.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedBrand.status}
                  </span>
                } 
              />
              <DetailRow label="Description" value={selectedBrand.description || 'N/A'} />
              <DetailRow label="Created Date" value={selectedBrand.createdDate || 'N/A'} />
            </div>
          </div>
        )}
      </ViewModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Brand"
        message={`Are you sure you want to delete "${selectedBrand?.name}"? This action cannot be undone.`}
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
