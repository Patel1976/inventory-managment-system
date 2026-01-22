import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  products: number;
  status: 'Active' | 'Inactive';
  createdDate?: string;
}

const Categories = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('categories.manage');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Electronics', slug: 'electronics', products: 45, status: 'Active', description: 'Electronic devices and gadgets', createdDate: '2024-01-15' },
    { id: 2, name: 'Laptops', slug: 'laptops', products: 28, status: 'Active', description: 'Portable computers', createdDate: '2024-01-14' },
    { id: 3, name: 'Audio', slug: 'audio', products: 32, status: 'Active', description: 'Audio equipment and accessories', createdDate: '2024-01-13' },
    { id: 4, name: 'Accessories', slug: 'accessories', products: 67, status: 'Active', description: 'Various accessories', createdDate: '2024-01-12' },
    { id: 5, name: 'Wearables', slug: 'wearables', products: 19, status: 'Active', description: 'Wearable technology', createdDate: '2024-01-11' },
    { id: 6, name: 'Tablets', slug: 'tablets', products: 15, status: 'Active', description: 'Tablet devices', createdDate: '2024-01-10' },
    { id: 7, name: 'Gaming', slug: 'gaming', products: 42, status: 'Inactive', description: 'Gaming equipment', createdDate: '2024-01-09' },
  ]);

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      status: category.status
    });
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (editingCategory) {
        // Update existing category
        setCategories(prev => prev.map(c => 
          c.id === editingCategory.id 
            ? { ...c, ...formData }
            : c
        ));
        showToast({ type: 'success', title: 'Success', message: 'Category updated successfully!' });
        setEditingCategory(null);
      } else {
        // Add new category
        const newCategory: Category = {
          id: categories.length + 1,
          ...formData,
          products: 0,
          createdDate: new Date().toISOString().split('T')[0]
        };
        setCategories(prev => [...prev, newCategory]);
        showToast({ type: 'success', title: 'Success', message: 'Category added successfully!' });
      }
      setFormData({ name: '', slug: '', description: '', status: 'Active' });
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setCategories(prev => prev.filter(c => c.id !== selectedCategory?.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      showToast({ type: 'success', title: 'Deleted', message: 'Category deleted successfully!' });
    }, 500);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', status: 'Active' });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

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
        {/* Add/Edit Category Form */}
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="category-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
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
                {editingCategory && (
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
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
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
                          <button className="btn-action view me-1" onClick={() => handleView(category)}>
                            <FiEye />
                          </button>
                          {canManage && (
                            <>
                              <button className="btn-action edit me-1" onClick={() => handleEdit(category)}>
                                <FiEdit />
                              </button>
                              <button className="btn-action delete" onClick={() => handleDeleteClick(category)}>
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

      {/* View Category Modal */}
      <ViewModal
        isOpen={showViewModal}
        title="Category Details"
        onClose={() => setShowViewModal(false)}
      >
        {selectedCategory && (
          <div>
            <DetailRow label="Name" value={<strong>{selectedCategory.name}</strong>} />
            <DetailRow label="Slug" value={selectedCategory.slug} />
            <DetailRow label="Products" value={selectedCategory.products} />
            <DetailRow 
              label="Status" 
              value={
                <span className={`badge ${selectedCategory.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                  {selectedCategory.status}
                </span>
              } 
            />
            <DetailRow label="Description" value={selectedCategory.description || 'N/A'} />
            <DetailRow label="Created Date" value={selectedCategory.createdDate || 'N/A'} />
          </div>
        )}
      </ViewModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isLoading}
        variant="danger"
      />
    </div>
  );
};

export default Categories;
