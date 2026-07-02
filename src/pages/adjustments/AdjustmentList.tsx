import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { getAdjustments, deleteAdjustment } from '../../services/reportService';

interface AdjItem { id: number; product: { name: string }; quantity: number; }
interface Adjustment {
  id: number; date: string; reference: string; type: string; reason: string; note?: string;
  store?: { name: string }; items: AdjItem[];
}

const AdjustmentList = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canManage = hasPermission('adjustments.manage');

  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdj, setSelectedAdj] = useState<Adjustment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getAdjustments().then(r => setAdjustments(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, typeFilter]);

  const filtered = adjustments.filter(a => {
    const matchSearch = a.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.store?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !typeFilter || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (a: Adjustment) => { setSelectedAdj(a); setShowViewModal(true); };
  const handleEdit = (a: Adjustment) => { navigate(`/adjustments/edit/${a.id}`, { state: { adjustment: a } }); };
  const handleDeleteClick = (a: Adjustment) => { setSelectedAdj(a); setShowDeleteDialog(true); };

  const handleDelete = async () => {
    if (!selectedAdj) return;
    setIsLoading(true);
    try {
      await deleteAdjustment(selectedAdj.id);
      setAdjustments(prev => prev.filter(a => a.id !== selectedAdj.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Adjustment deleted successfully!' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Delete failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const totalQty = (a: Adjustment) => a.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  return (
    <div className="adjustment-list-page">
      <div className="page-header">
        <h4>Stock Adjustments</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Stock Adjustments</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search reference or store..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="addition">Addition</option>
                <option value="subtraction">Subtraction</option>
              </select>
            </div>
            <div className="col-12 col-md-7 text-end d-flex justify-content-end">
              {canManage && (
                <Link to="/adjustments/add" className="btn btn-primary-custom d-flex align-items-center">
                  <FiPlus className="me-1" /> Add Adjustment
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Date</th><th>Reference</th><th>Store</th><th>Type</th><th>Items</th><th>Total Qty</th><th>Reason</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-4 text-muted">No adjustments found</td></tr>
                ) : paginatedData.map((adj, index) => (
                  <tr key={adj.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{adj.date}</td>
                    <td><strong>{adj.reference}</strong></td>
                    <td>{adj.store?.name || '-'}</td>
                    <td>
                      <span className={`badge ${adj.type === 'addition' ? 'badge-success' : 'badge-danger'}`}>
                        {adj.type.charAt(0).toUpperCase() + adj.type.slice(1)}
                      </span>
                    </td>
                    <td>{adj.items?.length ?? 0}</td>
                    <td>
                      <strong style={{ color: adj.type === 'addition' ? '#16a34a' : '#dc2626' }}>
                        {adj.type === 'addition' ? '+' : '-'}{totalQty(adj)}
                      </strong>
                    </td>
                    <td>{adj.reason}</td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(adj)}><FiEye /></button>
                      {canManage && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => handleEdit(adj)}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDeleteClick(adj)}><FiTrash2 /></button>
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
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  return <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button></li>;
                })}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <ViewModal isOpen={showViewModal} title="Adjustment Details" onClose={() => setShowViewModal(false)}>
        {selectedAdj && (
          <div>
            <DetailRow label="Reference" value={<strong>{selectedAdj.reference}</strong>} />
            <DetailRow label="Date" value={selectedAdj.date} />
            <DetailRow label="Store" value={selectedAdj.store?.name || '-'} />
            <DetailRow label="Type" value={<span className={`badge ${selectedAdj.type === 'addition' ? 'badge-success' : 'badge-danger'}`}>{selectedAdj.type}</span>} />
            <DetailRow label="Reason" value={selectedAdj.reason} />
            {selectedAdj.note && <DetailRow label="Note" value={selectedAdj.note} />}
            {selectedAdj.items?.length > 0 && (
              <div className="mt-3">
                <strong>Items:</strong>
                <table className="data-table mt-2">
                  <thead><tr><th>Product</th><th>Quantity</th></tr></thead>
                  <tbody>
                    {selectedAdj.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product?.name}</td>
                        <td><strong style={{ color: selectedAdj.type === 'addition' ? '#16a34a' : '#dc2626' }}>{selectedAdj.type === 'addition' ? '+' : '-'}{item.quantity}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Adjustment" message={`Are you sure you want to delete "${selectedAdj?.reference}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default AdjustmentList;
