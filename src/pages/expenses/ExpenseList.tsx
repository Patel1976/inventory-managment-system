import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { useSettings } from '../../contexts/useSettings';
import * as expenseService from '../../services/expenseService';

interface ExpenseCategory { id: number; name: string; }
interface Store { id: number; name: string; }
interface Expense {
  id: number; date: string; reference: string; amount: number; note: string;
  payment_method: string; expense_category_id: number;
  category?: ExpenseCategory; store?: Store;
}

const ExpenseList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();
  const canManage = hasPermission('expenses.manage');
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    expenseService.getExpenses().then(r => setExpenses(r.data.data)).catch(() => {});
    expenseService.getExpenseCategories().then(r => setExpenseCategories(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, categoryFilter]);

  const filtered = expenses.filter(e => {
    const matchSearch = e.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !categoryFilter || String(e.expense_category_id) === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (e: Expense) => { setSelectedExpense(e); setShowViewModal(true); };
  const handleEdit = (e: Expense) => { navigate(`/expenses/edit/${e.id}`, { state: { expense: e } }); };
  const handleDeleteClick = (e: Expense) => { setSelectedExpense(e); setShowDeleteDialog(true); };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    setIsLoading(true);
    try {
      await expenseService.deleteExpense(selectedExpense.id);
      setExpenses(prev => prev.filter(e => e.id !== selectedExpense.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Expense deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="expense-list-page">
      <div className="page-header">
        <h4>Expense List</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Expenses</span></div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                {expenseCategories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6 text-end d-flex justify-content-end">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              {canManage && <Link to="/expenses/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Expense</Link>}
            </div>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Date</th><th>Reference</th><th>Category</th><th>Store</th><th>Amount</th><th>Payment</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4 text-muted">No expenses found</td></tr>
                ) : paginatedData.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{expense.date}</td>
                    <td><div className="fw-semibold">{expense.reference}</div></td>
                    <td><span className="badge badge-info">{expense.category?.name || '-'}</span></td>
                    <td>{expense.store?.name || '-'}</td>
                    <td><div className="fw-semibold">{currencySymbol}{Number(expense.amount).toFixed(2)}</div></td>
                    <td>{expense.payment_method}</td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(expense)}><FiEye /></button>
                      {canManage && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => handleEdit(expense)}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDeleteClick(expense)}><FiTrash2 /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries</div>
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
      <ViewModal isOpen={showViewModal} title="Expense Details" onClose={() => setShowViewModal(false)}>
        {selectedExpense && (
          <div>
            <DetailRow label="Reference" value={<strong>{selectedExpense.reference}</strong>} />
            <DetailRow label="Date" value={selectedExpense.date} />
            <DetailRow label="Category" value={<span className="badge badge-info">{selectedExpense.category?.name || '-'}</span>} />
            <DetailRow label="Store" value={selectedExpense.store?.name || '-'} />
            <DetailRow label="Amount" value={<strong>{currencySymbol}{Number(selectedExpense.amount).toFixed(2)}</strong>} />
            <DetailRow label="Payment Method" value={selectedExpense.payment_method} />
            <DetailRow label="Note" value={selectedExpense.note || '-'} />
          </div>
        )}
      </ViewModal>
      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Expense" message={`Are you sure you want to delete "${selectedExpense?.reference}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default ExpenseList;
