import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import * as categoryService from '../../services/categoryService';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  products: number;
  products_count?: number;
  status: 'Active' | 'Inactive';
  createdDate?: string;
  created_at?: string;
}

const Categories = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('categories.manage');

  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [categories, setCategories] = useState<Category[]>([]);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = categories.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    categoryService.getCategories().then(res => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [categories.length, totalPages, currentPage]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        showToast({ type: 'success', title: 'Success', message: 'Category updated successfully!' });
        setEditingCategory(null);
      } else {
        await categoryService.createCategory(formData);
        showToast({ type: 'success', title: 'Success', message: 'Category added successfully!' });
      }
      const res = await categoryService.getCategories();
      setCategories(res.data.data);
      setFormData({ name: '', slug: '', description: '', status: 'Active' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Operation failed!' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsLoading(true);
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Category deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
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
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input type="text" className="form-control" placeholder="Enter category name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input type="text" className="form-control" placeholder="category-slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
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
                {editingCategory && (
                  <button type="button" className="btn btn-secondary flex-fill" onClick={handleCancelEdit}>Cancel</button>
                )}
                <button type="submit" className="btn btn-primary-custom flex-fill d-flex align-items-center justify-content-center" disabled={isLoading}>
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
                    {paginatedData.map((category, index) => (
                      <tr key={category.id}>
                        <td>{startIndex + index + 1}</td>
                        <td><strong>{category.name}</strong></td>
                        <td>{category.slug}</td>
                        <td>{category.products}</td>
                        <td>
                          <span className={`badge ${category.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                            {category.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action view me-1" onClick={() => handleView(category)}><FiEye /></button>
                          {canManage && (
                            <>
                              <button className="btn-action edit me-1" onClick={() => handleEdit(category)}><FiEdit /></button>
                              <button className="btn-action delete" onClick={() => handleDeleteClick(category)}><FiTrash2 /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                  Showing {categories.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, categories.length)} of {categories.length} entries
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
      </div>

      <ViewModal isOpen={showViewModal} title="Category Details" onClose={() => setShowViewModal(false)}>
        {selectedCategory && (
          <div>
            <DetailRow label="Name" value={<strong>{selectedCategory.name}</strong>} />
            <DetailRow label="Slug" value={selectedCategory.slug} />
            <DetailRow label="Products" value={selectedCategory.products} />
            <DetailRow label="Status" value={<span className={`badge ${selectedCategory.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{selectedCategory.status}</span>} />
            <DetailRow label="Description" value={selectedCategory.description || 'N/A'} />
            <DetailRow label="Created Date" value={selectedCategory.created_at?.split('T')[0] || selectedCategory.createdDate || 'N/A'} />
          </div>
        )}
      </ViewModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"?`}
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
