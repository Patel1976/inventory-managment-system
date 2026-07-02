import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import * as expenseService from '../../services/expenseService';

interface ExpenseCategory { id: number; name: string; description: string; expenses_count?: number; }

const ExpenseCategories = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('expenses.manage');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  const fetchCategories = () => {
    expenseService.getExpenseCategories().then(r => setCategories(r.data.data)).catch(() => {});
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [categories.length, currentPage]);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = categories.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (c: ExpenseCategory) => { setSelectedCategory(c); setShowViewModal(true); };
  const handleEdit = (c: ExpenseCategory) => { setEditingCategory(c); setFormData({ name: c.name, description: c.description || '' }); };
  const handleDeleteClick = (c: ExpenseCategory) => { setSelectedCategory(c); setShowDeleteDialog(true); };
  const handleCancelEdit = () => { setEditingCategory(null); setFormData({ name: '', description: '' }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingCategory) {
        await expenseService.updateExpenseCategory(editingCategory.id, formData);
        showToast({ type: 'success', title: 'Success', message: 'Category updated successfully!' });
        setEditingCategory(null);
      } else {
        await expenseService.createExpenseCategory(formData);
        showToast({ type: 'success', title: 'Success', message: 'Category added successfully!' });
      }
      fetchCategories();
      setFormData({ name: '', description: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsLoading(true);
    try {
      await expenseService.deleteExpenseCategory(selectedCategory.id);
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Category deleted successfully!' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Delete failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="expense-categories-page">
      <div className="page-header">
        <h4>Expense Categories</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><Link to="/expenses">Expenses</Link><span>/</span><span>Categories</span></div>
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Category Name *</label><input type="text" className="form-control" placeholder="Enter category name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group mb-0"><label>Description</label><textarea className="form-control" rows={3} placeholder="Enter description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="d-flex gap-2 mt-4">
                {editingCategory && <button type="button" className="btn btn-secondary flex-fill" onClick={handleCancelEdit}>Cancel</button>}
                <button type="submit" className="btn btn-primary-custom flex-fill d-flex align-items-center justify-content-center" disabled={isLoading}>
                  {isLoading ? <span className="spinner-border spinner-border-sm me-1"></span> : <FiPlus className="me-2" />}
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <div className="data-card">
            <div className="data-card-header"><h5>All Categories</h5></div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Category Name</th><th>Description</th><th>Expenses</th><th>Action</th></tr></thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4 text-muted">No categories found</td></tr>
                    ) : paginatedData.map((category, index) => (
                      <tr key={category.id}>
                        <td>{startIndex + index + 1}</td>
                        <td><div className="fw-semibold">{category.name}</div></td>
                        <td>{category.description || '-'}</td>
                        <td>{category.expenses_count ?? 0}</td>
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
                <div className="text-muted">Showing {categories.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, categories.length)} of {categories.length} entries</div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button></li>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                      return <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button></li>;
                    })}
                    <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button></li>
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
            <DetailRow label="Description" value={selectedCategory.description || '-'} />
            <DetailRow label="Total Expenses" value={selectedCategory.expenses_count ?? 0} />
          </div>
        )}
      </ViewModal>
      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Category" message={`Are you sure you want to delete "${selectedCategory?.name}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default ExpenseCategories;
