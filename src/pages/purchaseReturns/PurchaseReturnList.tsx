import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { useToast } from '../../components/common/Toast';
import { useSettings } from '../../contexts/useSettings';
import ViewModal from '../../components/common/ViewModal';
import { ConfirmDialog } from '@/components/common';
import * as purchaseReturnService from '../../services/purchaseReturnService';

interface PurchaseReturn {
  id: number;
  reference: string;
  return_date: string;
  purchase: { reference: string; supplier?: { name: string } } | null;
  product: { name: string } | null;
  quantity: number;
  return_amount: number;
  reason: string;
  status: string;
}

const PurchaseReturnList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();

  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseReturn | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReturns = () => {
    purchaseReturnService.getPurchaseReturns()
      .then(res => setReturns(res.data.data))
      .catch(() => {});
  };

  useEffect(() => { fetchReturns(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const filtered = returns.filter(item => {
    const matchSearch =
      item.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purchase?.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purchase?.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') return 'badge-success';
    if (status === 'Pending') return 'badge-warning';
    if (status === 'Processing') return 'badge-info';
    return 'badge-secondary';
  };

  const handleView = (item: PurchaseReturn) => { setSelectedItem(item); setIsViewOpen(true); };
  const handleDeleteClick = (item: PurchaseReturn) => { setSelectedItem(item); setShowDeleteDialog(true); };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    setIsLoading(true);
    try {
      await purchaseReturnService.deletePurchaseReturn(selectedItem.id);
      setReturns(prev => prev.filter(r => r.id !== selectedItem.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Purchase return deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="purchase-return-page">
      <div className="page-header">
        <h4>Purchase Returns</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Purchase Returns</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-12 col-md-7 text-end d-flex justify-content-end">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              {isAdmin && (
                <button className="btn btn-primary-custom d-flex align-items-center" onClick={() => navigate('/purchases/returns/add')}>
                  <FiPlus className="me-1" /> Add Return
                </button>
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
                <tr><th>Reference</th><th>Return Date</th><th>Purchase Ref</th><th>Supplier</th><th>Product</th><th>Qty</th><th>Return Amount</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginated.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.reference}</strong></td>
                    <td>{item.return_date}</td>
                    <td>{item.purchase?.reference || '-'}</td>
                    <td>{item.purchase?.supplier?.name || '-'}</td>
                    <td>{item.product?.name || '-'}</td>
                    <td>{item.quantity}</td>
                    <td>{currencySymbol}{Number(item.return_amount).toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(item)}><FiEye /></button>
                      {isAdmin && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => navigate(`/purchases/returns/edit/${item.id}`, { state: { returnData: item } })}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDeleteClick(item)}><FiTrash2 /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={9} className="text-center text-muted py-4">No purchase returns found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-muted">Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries</span>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Purchase Return Details">
        {selectedItem && (
          <div className="row g-3">
            <div className="col-md-6"><small className="text-muted">Reference</small><div className="fw-semibold">{selectedItem.reference}</div></div>
            <div className="col-md-6"><small className="text-muted">Return Date</small><div>{selectedItem.return_date}</div></div>
            <div className="col-md-6"><small className="text-muted">Purchase Ref</small><div className="fw-semibold">{selectedItem.purchase?.reference || '-'}</div></div>
            <div className="col-md-6"><small className="text-muted">Supplier</small><div>{selectedItem.purchase?.supplier?.name || '-'}</div></div>
            <div className="col-md-6"><small className="text-muted">Product</small><div>{selectedItem.product?.name || '-'}</div></div>
            <div className="col-md-6"><small className="text-muted">Quantity</small><div>{selectedItem.quantity}</div></div>
            <div className="col-md-6"><small className="text-muted">Return Amount</small><div className="fw-bold text-success">{currencySymbol}{Number(selectedItem.return_amount).toFixed(2)}</div></div>
            <div className="col-md-6"><small className="text-muted">Status</small><div><span className={`badge ${getStatusBadge(selectedItem.status)}`}>{selectedItem.status}</span></div></div>
            <div className="col-12"><small className="text-muted">Reason</small><div>{selectedItem.reason}</div></div>
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Confirm Delete" message={`Delete return "${selectedItem?.reference}"?`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default PurchaseReturnList;
