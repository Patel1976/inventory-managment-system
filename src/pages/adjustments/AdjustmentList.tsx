import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Adjustment { id: number; date: string; reference: string; store: string; type: string; products: number; total: string; reason: string; }

const AdjustmentList = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('adjustments.manage');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdj, setSelectedAdj] = useState<Adjustment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [adjustments, setAdjustments] = useState<Adjustment[]>([
    { id: 1, date: '2024-01-15', reference: 'ADJ-001', store: 'Main Store', type: 'Addition', products: 5, total: '+150', reason: 'Stock received from supplier' },
    { id: 2, date: '2024-01-14', reference: 'ADJ-002', store: 'Branch 1', type: 'Subtraction', products: 3, total: '-25', reason: 'Damaged items removed' },
    { id: 3, date: '2024-01-13', reference: 'ADJ-003', store: 'Main Store', type: 'Addition', products: 8, total: '+200', reason: 'Inventory count adjustment' },
    { id: 4, date: '2024-01-12', reference: 'ADJ-004', store: 'Branch 2', type: 'Subtraction', products: 2, total: '-10', reason: 'Expired products' },
  ]);

  const filteredAdjustments = adjustments.filter(a => a.reference.toLowerCase().includes(searchTerm.toLowerCase()) || a.store.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredAdjustments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAdjustments.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages); }, [filteredAdjustments.length, totalPages, currentPage]);

  const handleView = (a: Adjustment) => { setSelectedAdj(a); setShowViewModal(true); };
  const handleEdit = (a: Adjustment) => { navigate(`/adjustments/edit/${a.id}`); };
  const handleDeleteClick = (a: Adjustment) => { setSelectedAdj(a); setShowDeleteDialog(true); };
  const handleDelete = () => { setIsLoading(true); setTimeout(() => { setAdjustments(prev => prev.filter(a => a.id !== selectedAdj?.id)); setIsLoading(false); setShowDeleteDialog(false); showToast({ type: 'success', title: 'Deleted', message: 'Adjustment deleted successfully!' }); }, 500); };

  return (
    <div className="adjustment-list-page">
      <div className="page-header"><h4>Stock Adjustments</h4><div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Stock Adjustments</span></div></div>
      <div className="data-card mb-4"><div className="data-card-body"><div className="row g-3 align-items-center">
        <div className="col-12 col-md-3"><div className="input-group"><span className="input-group-text bg-white border-end-0"><FiSearch /></span><input type="text" className="form-control border-start-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
        <div className="col-12 col-md-2"><select className="form-select"><option value="">All Types</option><option value="addition">Addition</option><option value="subtraction">Subtraction</option></select></div>
        <div className="col-12 col-md-2"><select className="form-select"><option value="">All Stores</option></select></div>
        <div className="col-12 col-md-2"><input type="date" className="form-control" /></div>
        <div className="col-12 col-md-3 text-end d-flex justify-content-end"><Link to="/adjustments/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Adjustment</Link></div>
      </div></div></div>
      <div className="data-card"><div className="data-card-body"><div className="table-responsive"><table className="data-table"><thead><tr><th>#</th><th>Date</th><th>Reference</th><th>Store</th><th>Type</th><th>Products</th><th>Quantity</th><th>Reason</th><th>Action</th></tr></thead><tbody>
        {filteredAdjustments.map((adj, index) => (
          <tr key={adj.id}><td><div className="fw-semibold">{index + 1}</div></td><td>{adj.date}</td><td><div className="fw-semibold">{adj.reference}</div></td><td>{adj.store}</td><td><span className={`badge ${adj.type === 'Addition' ? 'badge-success' : 'badge-danger'}`}>{adj.type}</span></td><td>{adj.products}</td><td><strong style={{ color: adj.type === 'Addition' ? '#16a34a' : '#dc2626' }}>{adj.total}</strong></td><td>{adj.reason}</td><td>
            <button className="btn-action view me-1" onClick={() => handleView(adj)}><FiEye /></button>
            {canManage && <><button className="btn-action edit me-1" onClick={() => handleEdit(adj)}><FiEdit /></button><button className="btn-action delete" onClick={() => handleDeleteClick(adj)}><FiTrash2 /></button></>}
          </td></tr>
        ))}
      </tbody></table></div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">Showing {filteredAdjustments.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAdjustments.length)} of {filteredAdjustments.length} entries</div>
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
      <ViewModal isOpen={showViewModal} title="Adjustment Details" onClose={() => setShowViewModal(false)}>{selectedAdj && <div><DetailRow label="Reference" value={<strong>{selectedAdj.reference}</strong>} /><DetailRow label="Date" value={selectedAdj.date} /><DetailRow label="Store" value={selectedAdj.store} /><DetailRow label="Type" value={<span className={`badge ${selectedAdj.type === 'Addition' ? 'badge-success' : 'badge-danger'}`}>{selectedAdj.type}</span>} /><DetailRow label="Products" value={selectedAdj.products} /><DetailRow label="Total Quantity" value={<strong>{selectedAdj.total}</strong>} /><DetailRow label="Reason" value={selectedAdj.reason} /></div>}</ViewModal>
      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Adjustment" message={`Are you sure you want to delete "${selectedAdj?.reference}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default AdjustmentList;
