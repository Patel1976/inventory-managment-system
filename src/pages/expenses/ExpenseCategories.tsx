import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Category { id: number; name: string; description: string; expenses: number; total: number; }

const ExpenseCategories = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('expenses.manage');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Rent', description: 'Office and store rent payments', expenses: 12, total: 30000.00 },
    { id: 2, name: 'Utilities', description: 'Electricity, water, internet bills', expenses: 24, total: 5400.00 },
    { id: 3, name: 'Salary', description: 'Staff salaries and wages', expenses: 12, total: 102000.00 },
    { id: 4, name: 'Marketing', description: 'Advertising and promotions', expenses: 8, total: 4800.00 },
    { id: 5, name: 'Maintenance', description: 'Equipment and facility maintenance', expenses: 15, total: 3200.00 },
    { id: 6, name: 'Transportation', description: 'Delivery and logistics costs', expenses: 18, total: 2100.00 },
  ]);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = categories.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages); }, [categories.length, totalPages, currentPage]);

  const handleView = (c: Category) => { setSelectedCategory(c); setShowViewModal(true); };
  const handleEdit = (c: Category) => { setEditingCategory(c); setFormData({ name: c.name, description: c.description }); };
  const handleDeleteClick = (c: Category) => { setSelectedCategory(c); setShowDeleteDialog(true); };
  const handleCancelEdit = () => { setEditingCategory(null); setFormData({ name: '', description: '' }); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    setTimeout(() => {
      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
        showToast({ type: 'success', title: 'Success', message: 'Category updated successfully!' });
        setEditingCategory(null);
      } else {
        setCategories(prev => [...prev, { id: prev.length + 1, ...formData, expenses: 0, total: 0 }]);
        showToast({ type: 'success', title: 'Success', message: 'Category added successfully!' });
      }
      setFormData({ name: '', description: '' }); setIsLoading(false);
    }, 500);
  };

  const handleDelete = () => { setIsLoading(true); setTimeout(() => { setCategories(prev => prev.filter(c => c.id !== selectedCategory?.id)); setIsLoading(false); setShowDeleteDialog(false); showToast({ type: 'success', title: 'Deleted', message: 'Category deleted successfully!' }); }, 500); };

  return (
    <div className="expense-categories-page">
      <div className="page-header"><h4>Expense Categories</h4><div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><Link to="/expenses">Expenses</Link><span>/</span><span>Categories</span></div></div>
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <h5 className="mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Category Name *</label><input type="text" className="form-control" placeholder="Enter category name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group mb-0"><label>Description</label><textarea className="form-control" rows={3} placeholder="Enter description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="d-flex gap-2 mt-4">{editingCategory && <button type="button" className="btn btn-secondary flex-fill" onClick={handleCancelEdit}>Cancel</button>}<button type="submit" className="btn btn-primary-custom flex-fill" disabled={isLoading}>{isLoading ? <span className="spinner-border spinner-border-sm me-1"></span> : <FiPlus className="me-2" />}{editingCategory ? 'Update Category' : 'Add Category'}</button></div>
            </form>
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <div className="data-card"><div className="data-card-header"><h5>All Categories</h5></div><div className="data-card-body"><div className="table-responsive"><table className="data-table"><thead><tr><th>#</th><th>Category Name</th><th>Description</th><th>Expenses</th><th>Total</th><th>Action</th></tr></thead><tbody>
            {paginatedData.map((category, index) => (
              <tr key={category.id}><td>{startIndex + index + 1}</td><td><strong>{category.name}</strong></td><td>{category.description}</td><td>{category.expenses}</td><td><strong>${category.total.toLocaleString()}</strong></td><td>
                <button className="btn-action view me-1" onClick={() => handleView(category)}><FiEye /></button>
                {canManage && <><button className="btn-action edit me-1" onClick={() => handleEdit(category)}><FiEdit /></button><button className="btn-action delete" onClick={() => handleDeleteClick(category)}><FiTrash2 /></button></>}
              </td></tr>
            ))}
          </tbody></table></div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {categories.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, categories.length)} of {categories.length} entries</div>
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
          </div></div>
        </div>
      </div>
      <ViewModal isOpen={showViewModal} title="Category Details" onClose={() => setShowViewModal(false)}>{selectedCategory && <div><DetailRow label="Name" value={<strong>{selectedCategory.name}</strong>} /><DetailRow label="Description" value={selectedCategory.description} /><DetailRow label="Total Expenses" value={selectedCategory.expenses} /><DetailRow label="Total Amount" value={<strong>${selectedCategory.total.toLocaleString()}</strong>} /></div>}</ViewModal>
      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Category" message={`Are you sure you want to delete "${selectedCategory?.name}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default ExpenseCategories;
