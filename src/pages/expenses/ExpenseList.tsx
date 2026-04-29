import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Expense { id: number; date: string; category: string; reference: string; store: string; amount: number; note: string; }

const ExpenseList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('expenses.manage');
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2024-01-15', category: 'Rent', reference: 'EXP-001', store: 'Main Store', amount: 2500.00, note: 'Monthly rent payment' },
    { id: 2, date: '2024-01-14', category: 'Utilities', reference: 'EXP-002', store: 'Main Store', amount: 450.00, note: 'Electricity bill' },
    { id: 3, date: '2024-01-13', category: 'Salary', reference: 'EXP-003', store: 'All Stores', amount: 8500.00, note: 'Staff salaries' },
    { id: 4, date: '2024-01-12', category: 'Marketing', reference: 'EXP-004', store: 'Main Store', amount: 1200.00, note: 'Facebook ads' },
    { id: 5, date: '2024-01-11', category: 'Maintenance', reference: 'EXP-005', store: 'Branch 1', amount: 350.00, note: 'AC repair' },
    { id: 6, date: '2024-01-10', category: 'Supplies', reference: 'EXP-006', store: 'All Stores', amount: 250.00, note: 'Office supplies' },
  ]);

  const filteredExpenses = expenses.filter(e => e.reference.toLowerCase().includes(searchTerm.toLowerCase()) || e.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages); }, [filteredExpenses.length, totalPages, currentPage]);

  const handleView = (e: Expense) => { setSelectedExpense(e); setShowViewModal(true); };
  const handleEdit = (e: Expense) => { navigate(`/expenses/edit/${e.id}`, { state: { expense: e } }); };
  const handleDeleteClick = (e: Expense) => { setSelectedExpense(e); setShowDeleteDialog(true); };
  const handleDelete = () => { setIsLoading(true); setTimeout(() => { setExpenses(prev => prev.filter(e => e.id !== selectedExpense?.id)); setIsLoading(false); setShowDeleteDialog(false); showToast({ type: 'success', title: 'Deleted', message: 'Expense deleted successfully!' }); }, 500); };

  return (
    <div className="expense-list-page">
      <div className="page-header">
        <h4>Expense List</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Expenses</span>
        </div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-2">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch />
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Categories</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-4 text-end d-flex justify-content-end">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center">
                <FiDownload className="me-1" /> Export
              </button>
              <Link to="/expenses/add" className="btn btn-primary-custom d-flex align-items-center">
                <FiPlus className="me-1" /> Add Expense
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Category</th>
                  <th>Store</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="fw-semibold">{index + 1}</div>
                    </td>
                    <td>{expense.date}</td>
                    <td>
                      <div className="fw-semibold">{expense.reference}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">{expense.category}</span>
                    </td>
                    <td>{expense.store}</td>
                    <td>
                      <div className="fw-semibold">${expense.amount.toFixed(2)}</div>
                    </td>
                    <td>{expense.note}</td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(expense)}><FiEye /></button>
                      {canManage &&
                        <>
                          <button className="btn-action edit me-1" onClick={() => handleEdit(expense)}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDeleteClick(expense)}><FiTrash2 /></button>
                        </>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {paginatedData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, paginatedData.length)} of {filteredExpenses.length} entries</div>
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
        </div></div>
      <ViewModal isOpen={showViewModal} title="Expense Details" onClose={() => setShowViewModal(false)}>{selectedExpense && <div><DetailRow label="Reference" value={<strong>{selectedExpense.reference}</strong>} /><DetailRow label="Date" value={selectedExpense.date} /><DetailRow label="Category" value={<span className="badge badge-info">{selectedExpense.category}</span>} /><DetailRow label="Store" value={selectedExpense.store} /><DetailRow label="Amount" value={<strong>${selectedExpense.amount.toFixed(2)}</strong>} /><DetailRow label="Note" value={selectedExpense.note} /></div>}</ViewModal>
      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Expense" message={`Are you sure you want to delete "${selectedExpense?.reference}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default ExpenseList;
