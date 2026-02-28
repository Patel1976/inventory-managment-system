import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, FormModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Purchase {
  id: string; date: string; supplier: string; store: string; total: number; paid: number; due: number; status: string;
}

const PurchaseList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canEdit = hasPermission('purchases.edit');
  const canDelete = hasPermission('purchases.delete');

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({ status: '', paid: 0 });

  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 'PO-001', date: '2024-01-15', supplier: 'Tech Suppliers Inc', store: 'Main Store', total: 5250.00, paid: 5250.00, due: 0, status: 'Received' },
    { id: 'PO-002', date: '2024-01-14', supplier: 'Global Electronics', store: 'Branch 1', total: 3850.00, paid: 2000.00, due: 1850.00, status: 'Pending' },
    { id: 'PO-003', date: '2024-01-13', supplier: 'Premium Parts Ltd', store: 'Main Store', total: 2100.00, paid: 2100.00, due: 0, status: 'Received' },
    { id: 'PO-004', date: '2024-01-12', supplier: 'Tech Suppliers Inc', store: 'Branch 2', total: 1450.00, paid: 0, due: 1450.00, status: 'Ordered' },
    { id: 'PO-005', date: '2024-01-11', supplier: 'Digital World', store: 'Main Store', total: 4800.00, paid: 4800.00, due: 0, status: 'Received' },
  ]);

  const filteredPurchases = purchases.filter(p => p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages); }, [filteredPurchases.length, totalPages, currentPage]);

  const handleView = (p: Purchase) => { setSelectedPurchase(p); setShowViewModal(true); };
  const handleEdit = (p: Purchase) => { setSelectedPurchase(p); setFormData({ status: p.status, paid: p.paid }); setShowEditModal(true); };
  const handleDeleteClick = (p: Purchase) => { setSelectedPurchase(p); setShowDeleteDialog(true); };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    setTimeout(() => {
      setPurchases(prev => prev.map(p => p.id === selectedPurchase?.id ? { ...p, ...formData, due: p.total - formData.paid } : p));
      setIsLoading(false); setShowEditModal(false);
      showToast({ type: 'success', title: 'Success', message: 'Purchase updated successfully!' });
    }, 500);
  };

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPurchases(prev => prev.filter(p => p.id !== selectedPurchase?.id));
      setIsLoading(false); setShowDeleteDialog(false);
      showToast({ type: 'success', title: 'Deleted', message: 'Purchase deleted successfully!' });
    }, 500);
  };

  return (
    <div className="purchase-list-page">
      <div className="page-header">
        <h4>Purchase List</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Purchase List</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-2">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2"><select className="form-select"><option value="">All Suppliers</option></select></div>
            <div className="col-12 col-md-2"><select className="form-select"><option value="">All Status</option></select></div>
            <div className="col-12 col-md-2"><input type="date" className="form-control" /></div>
            <div className="col-12 col-md-4 text-end d-flex justify-content-end align-items-center">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              <Link to="/purchases/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Purchase</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Reference</th><th>Date</th><th>Supplier</th><th>Store</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {paginatedData.map((purchase) => (
                  <tr key={purchase.id}>
                    <td><strong>{purchase.id}</strong></td><td>{purchase.date}</td><td>{purchase.supplier}</td><td>{purchase.store}</td>
                    <td>${purchase.total.toFixed(2)}</td><td>${purchase.paid.toFixed(2)}</td><td>${purchase.due.toFixed(2)}</td>
                    <td><span className={`badge ${purchase.status === 'Received' ? 'badge-success' : purchase.status === 'Pending' ? 'badge-warning' : 'badge-info'}`}>{purchase.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(purchase)}><FiEye /></button>
                      {canEdit && <button className="btn-action edit me-1" onClick={() => handleEdit(purchase)}><FiEdit /></button>}
                      {canDelete && <button className="btn-action delete" onClick={() => handleDeleteClick(purchase)}><FiTrash2 /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {filteredPurchases.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPurchases.length)} of {filteredPurchases.length} entries</div>
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
        </div>
      </div>

      <ViewModal isOpen={showViewModal} title="Purchase Details" onClose={() => setShowViewModal(false)}>
        {selectedPurchase && (
          <div>
            <DetailRow label="Reference" value={<strong>{selectedPurchase.id}</strong>} />
            <DetailRow label="Date" value={selectedPurchase.date} />
            <DetailRow label="Supplier" value={selectedPurchase.supplier} />
            <DetailRow label="Store" value={selectedPurchase.store} />
            <DetailRow label="Total" value={<strong>${selectedPurchase.total.toFixed(2)}</strong>} />
            <DetailRow label="Paid" value={`$${selectedPurchase.paid.toFixed(2)}`} />
            <DetailRow label="Due" value={`$${selectedPurchase.due.toFixed(2)}`} />
            <DetailRow label="Status" value={<span className={`badge ${selectedPurchase.status === 'Received' ? 'badge-success' : 'badge-warning'}`}>{selectedPurchase.status}</span>} />
          </div>
        )}
      </ViewModal>

      <FormModal isOpen={showEditModal} title="Edit Purchase" onClose={() => setShowEditModal(false)} onSubmit={handleEditSubmit} isLoading={isLoading}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="Ordered">Ordered</option><option value="Pending">Pending</option><option value="Received">Received</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Amount Paid</label>
            <input type="number" className="form-control" value={formData.paid} onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) })} />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Purchase" message={`Are you sure you want to delete "${selectedPurchase?.id}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default PurchaseList;
