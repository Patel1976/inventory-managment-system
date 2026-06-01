import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';
import { useSettings } from '../../contexts/SettingsContext';
import * as saleService from '../../services/saleService';

interface SaleItem {
  id: number;
  product: { name: string };
  quantity: number;
  unit_price: number;
  total: number;
}

interface Sale {
  id: number;
  reference: string;
  date: string;
  customer: { name: string } | null;
  store: { name: string } | null;
  subtotal: number;
  tax: number;
  discount: number;
  grand_total: number;
  paid: number;
  due: number;
  payment_status: string;
  status: string;
  note?: string;
  items: SaleItem[];
}

const SalesList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();
  const canEdit = hasPermission('sales.edit');
  const canDelete = hasPermission('sales.delete');
  const navigate = useNavigate();

  const [sales, setSales] = useState<Sale[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { saleService.getSales().then(r => setSales(r.data.data)).catch(() => {}); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const filtered = sales.filter(s => {
    const matchSearch = s.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (s: Sale) => { setSelectedSale(s); setShowViewModal(true); };
  const handleEdit = (s: Sale) => { navigate(`/sales/edit/${s.id}`, { state: { sale: s } }); };
  const handleDeleteClick = (s: Sale) => { setSelectedSale(s); setShowDeleteDialog(true); };

  const handleDelete = async () => {
    if (!selectedSale) return;
    setIsLoading(true);
    try {
      await saleService.deleteSale(selectedSale.id);
      setSales(prev => prev.filter(s => s.id !== selectedSale.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Sale deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const statusBadge = (s: string) => s === 'Completed' ? 'badge-success' : 'badge-warning';
  const paymentBadge = (s: string) => s === 'paid' ? 'badge-success' : s === 'partial' ? 'badge-warning' : 'badge-danger';

  return (
    <div className="sales-list-page">
      <div className="page-header">
        <h4>Sales List</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Sales List</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search reference or customer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-12 col-md-7 text-end d-flex justify-content-end align-items-center">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              {canEdit && (
                <Link to="/sales/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Sale</Link>
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
                <tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Store</th><th>Grand Total</th><th>Paid</th><th>Due</th><th>Payment</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginated.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.reference}</strong></td>
                    <td>{s.date}</td>
                    <td>{s.customer?.name || '-'}</td>
                    <td>{s.store?.name || '-'}</td>
                    <td><strong>{currencySymbol}{Number(s.grand_total).toFixed(2)}</strong></td>
                    <td>{currencySymbol}{Number(s.paid).toFixed(2)}</td>
                    <td>{currencySymbol}{Number(s.due).toFixed(2)}</td>
                    <td><span className={`badge ${paymentBadge(s.payment_status)}`}>{s.payment_status}</span></td>
                    <td><span className={`badge ${statusBadge(s.status)}`}>{s.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(s)}><FiEye /></button>
                      {canEdit && <button className="btn-action edit me-1" onClick={() => handleEdit(s)}><FiEdit /></button>}
                      {canDelete && <button className="btn-action delete" onClick={() => handleDeleteClick(s)}><FiTrash2 /></button>}
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={10} className="text-center text-muted py-4">No sales found</td></tr>
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

      <ViewModal isOpen={showViewModal} title="Sale Details" onClose={() => setShowViewModal(false)}>
        {selectedSale && (
          <div>
            <DetailRow label="Invoice" value={<strong>{selectedSale.reference}</strong>} />
            <DetailRow label="Date" value={selectedSale.date} />
            <DetailRow label="Customer" value={selectedSale.customer?.name || '-'} />
            <DetailRow label="Store" value={selectedSale.store?.name || '-'} />
            <DetailRow label="Subtotal" value={`${currencySymbol}${Number(selectedSale.subtotal).toFixed(2)}`} />
            <DetailRow label="Tax" value={`${currencySymbol}${Number(selectedSale.tax).toFixed(2)}`} />
            <DetailRow label="Discount" value={`${currencySymbol}${Number(selectedSale.discount).toFixed(2)}`} />
            <DetailRow label="Grand Total" value={<strong>{currencySymbol}{Number(selectedSale.grand_total).toFixed(2)}</strong>} />
            <DetailRow label="Paid" value={`${currencySymbol}${Number(selectedSale.paid).toFixed(2)}`} />
            <DetailRow label="Due" value={`${currencySymbol}${Number(selectedSale.due).toFixed(2)}`} />
            <DetailRow label="Payment" value={<span className={`badge ${paymentBadge(selectedSale.payment_status)}`}>{selectedSale.payment_status}</span>} />
            <DetailRow label="Status" value={<span className={`badge ${statusBadge(selectedSale.status)}`}>{selectedSale.status}</span>} />
            {selectedSale.note && <DetailRow label="Note" value={selectedSale.note} />}
            {selectedSale.items?.length > 0 && (
              <div className="mt-3">
                <strong>Items:</strong>
                <table className="data-table mt-2">
                  <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
                  <tbody>
                    {selectedSale.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product?.name}</td>
                        <td>{item.quantity}</td>
                        <td>{currencySymbol}{Number(item.unit_price).toFixed(2)}</td>
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

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Sale" message={`Delete sale "${selectedSale?.reference}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default SalesList;
