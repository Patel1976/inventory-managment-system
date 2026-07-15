import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { useSettings } from '../../contexts/useSettings';
import * as purchaseService from '../../services/purchaseService';
import ExportDropdown from '../../components/common/ExportDropdown';

interface PurchaseItem {
  id: number;
  product: { name: string };
  quantity: number;
  unit_cost: number;
  total: number;
}

interface Purchase {
  id: number;
  reference: string;
  date: string;
  supplier: { name: string } | null;
  store: { name: string } | null;
  subtotal: number;
  tax: number;
  shipping: number;
  grand_total: number;
  paid: number;
  due: number;
  payment_status: string;
  status: string;
  note?: string;
  items: PurchaseItem[];
}

const PurchaseList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();
  const canEdit = hasPermission('purchases.edit');
  const canDelete = hasPermission('purchases.delete');
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPurchases = () => {
    purchaseService.getPurchases()
      .then(res => setPurchases(res.data.data))
      .catch(() => {});
  };

  useEffect(() => { fetchPurchases(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const filtered = purchases.filter(p => {
    const matchSearch = p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (p: Purchase) => { setSelectedPurchase(p); setShowViewModal(true); };
  const handleEdit = (p: Purchase) => { navigate(`/purchases/edit/${p.id}`, { state: { purchase: p } }); };
  const handleDeleteClick = (p: Purchase) => { setSelectedPurchase(p); setShowDeleteDialog(true); };

  const handleDelete = async () => {
    if (!selectedPurchase) return;
    setIsLoading(true);
    try {
      await purchaseService.deletePurchase(selectedPurchase.id);
      setPurchases(prev => prev.filter(p => p.id !== selectedPurchase.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Purchase deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'Received') return 'badge-success';
    if (status === 'Pending') return 'badge-warning';
    return 'badge-info';
  };

  const paymentBadge = (status: string) => {
    if (status === 'paid') return 'badge-success';
    if (status === 'partial') return 'badge-warning';
    return 'badge-danger';
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
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search reference or supplier..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Ordered">Ordered</option>
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
              </select>
            </div>
            <div className="col-12 col-md-7 text-end d-flex justify-content-end align-items-center">
              <ExportDropdown filename="purchases" rows={filtered.map(p => ({ Reference: p.reference, Date: p.date, Supplier: p.supplier?.name || '-', Store: p.store?.name || '-', 'Grand Total': p.grand_total, Paid: p.paid, Due: p.due, Payment: p.payment_status, Status: p.status }))} />
              {canEdit && (
                <Link to="/purchases/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Purchase</Link>
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
                <tr><th>Reference</th><th>Date</th><th>Supplier</th><th>Store</th><th>Grand Total</th><th>Paid</th><th>Due</th><th>Payment</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginated.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.reference}</strong></td>
                    <td>{p.date}</td>
                    <td>{p.supplier?.name || '-'}</td>
                    <td>{p.store?.name || '-'}</td>
                    <td><strong>{currencySymbol}{Number(p.grand_total).toFixed(2)}</strong></td>
                    <td>{currencySymbol}{Number(p.paid).toFixed(2)}</td>
                    <td>{currencySymbol}{Number(p.due).toFixed(2)}</td>
                    <td><span className={`badge ${paymentBadge(p.payment_status)}`}>{p.payment_status}</span></td>
                    <td><span className={`badge ${statusBadge(p.status)}`}>{p.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(p)}><FiEye /></button>
                      {canEdit && <button className="btn-action edit me-1" onClick={() => handleEdit(p)}><FiEdit /></button>}
                      {canDelete && <button className="btn-action delete" onClick={() => handleDeleteClick(p)}><FiTrash2 /></button>}
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={10} className="text-center text-muted py-4">No purchases found</td></tr>
                )}
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

      <ViewModal isOpen={showViewModal} title="Purchase Details" onClose={() => setShowViewModal(false)}>
        {selectedPurchase && (
          <div>
            <DetailRow label="Reference" value={<strong>{selectedPurchase.reference}</strong>} />
            <DetailRow label="Date" value={selectedPurchase.date} />
            <DetailRow label="Supplier" value={selectedPurchase.supplier?.name || '-'} />
            <DetailRow label="Store" value={selectedPurchase.store?.name || '-'} />
            <DetailRow label="Subtotal" value={`${currencySymbol}${Number(selectedPurchase.subtotal).toFixed(2)}`} />
            <DetailRow label="Tax" value={`${currencySymbol}${Number(selectedPurchase.tax).toFixed(2)}`} />
            <DetailRow label="Shipping" value={`${currencySymbol}${Number(selectedPurchase.shipping).toFixed(2)}`} />
            <DetailRow label="Grand Total" value={<strong>{currencySymbol}{Number(selectedPurchase.grand_total).toFixed(2)}</strong>} />
            <DetailRow label="Paid" value={`${currencySymbol}${Number(selectedPurchase.paid).toFixed(2)}`} />
            <DetailRow label="Due" value={`${currencySymbol}${Number(selectedPurchase.due).toFixed(2)}`} />
            <DetailRow label="Payment" value={<span className={`badge ${paymentBadge(selectedPurchase.payment_status)}`}>{selectedPurchase.payment_status}</span>} />
            <DetailRow label="Status" value={<span className={`badge ${statusBadge(selectedPurchase.status)}`}>{selectedPurchase.status}</span>} />
            {selectedPurchase.note && <DetailRow label="Note" value={selectedPurchase.note} />}
            {selectedPurchase.items?.length > 0 && (
              <div className="mt-3">
                <strong>Items:</strong>
                <table className="data-table mt-2">
                  <thead><tr><th>Product</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead>
                  <tbody>
                    {selectedPurchase.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product?.name}</td>
                        <td>{item.quantity}</td>
                        <td>{currencySymbol}{Number(item.unit_cost).toFixed(2)}</td>
                        <td>{currencySymbol}{Number(item.total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Purchase" message={`Delete purchase "${selectedPurchase?.reference}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default PurchaseList;
