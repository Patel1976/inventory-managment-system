import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import { useSettings } from '../../contexts/SettingsContext';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import * as saleReturnService from '../../services/saleReturnService';
import { DetailRow } from '../../components/common';
import { getCustomers } from '../../services/commonService';

export interface SaleReturnItem {
  id: number;
  reference: string;
  sale_id: number;
  product_id: number;
  quantity: number;
  return_amount: number | string;
  return_date: string;
  reason: string;
  status: string;
  note?: string;
  sale?: { id: number; reference: string; customer_id?: number };
  product?: { id: number; name: string };
}

const SaleReturnList = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();
  const canEdit = hasPermission('sales.edit');
  const canDelete = hasPermission('sales.delete');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [returns, setReturns] = useState<SaleReturnItem[]>([]);
  const [customers, setCustomers] = useState<Array<{id:number;name:string}>>([]);
  const [selectedReturn, setSelectedReturn] = useState<SaleReturnItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  // Fetch sale returns from API
  const fetchSaleReturns = () => {
    saleReturnService.getSaleReturns()
      .then(res => setReturns(res.data.data))
      .catch(() => showToast({ type: 'error', title: 'Error', message: 'Failed to load sale returns' }));
  };
  
  useEffect(() => {
    fetchSaleReturns();
    getCustomers().then(r => setCustomers(r.data.data)).catch(() => {});
  }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const filteredReturns = returns.filter(item => {
    const saleRef = item.sale?.reference || '';
    const customerName = item.sale?.customer_id ? (customers.find(c => c.id === item.sale?.customer_id)?.name || '') : '';
    const matchesSearch = (item.reference?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      saleRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredReturns.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (item: SaleReturnItem) => {
    setSelectedReturn(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: SaleReturnItem) => {
    navigate(`/sales/returns/edit/${item.id}`, { state: { saleReturn: item } });
  };

  const handleDeleteClick = (item: SaleReturnItem) => {
    setSelectedReturn(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedReturn) return;
    setIsLoading(true);
    try {
      await saleReturnService.deleteSaleReturn(selectedReturn.id);
      setReturns(prev => prev.filter(r => r.id !== selectedReturn.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Sale return deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setSelectedReturn(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="sale-return-page">
      <div className="page-header">
        <h4>Sale Returns</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Sale Returns</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search reference or customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-12 col-md-7 text-end d-flex justify-content-end">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              {canEdit && (
                <button className="btn btn-primary-custom d-flex align-items-center" onClick={() => navigate('/sales/returns/add')}>
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
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Sale Ref</th>
                  <th>Customer</th>
                  <th>Quantity</th>
                  <th>Return Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.reference}</strong></td>
                    <td>{item.return_date}</td>
                    <td>{item.sale?.reference || '-'}</td>
                    <td>{item.sale?.customer_id ? (customers.find(c => c.id === item.sale?.customer_id)?.name || '-') : '-'}</td>
                    <td>{item.quantity}</td>
                    <td><strong>{currencySymbol}{Number(item.return_amount).toFixed(2)}</strong></td>
                    <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(item)}><FiEye /></button>
                      {canEdit && <button className="btn-action edit me-1" onClick={() => handleEdit(item)}><FiEdit /></button>}
                      {canDelete && <button className="btn-action delete" onClick={() => handleDeleteClick(item)}><FiTrash2 /></button>}
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-muted py-4">No sale returns found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredReturns.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-muted">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReturns.length)} of {filteredReturns.length} entries</span>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</button>
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
                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Sale Return Details">
        {selectedReturn && (
          <div className="space-y-3">
            <DetailRow label="Reference" value={selectedReturn.reference} />
            <DetailRow label="Date" value={selectedReturn.return_date} />
            <DetailRow label="Sale Reference" value={selectedReturn.sale?.reference || '-'} />
            <DetailRow label="Customer" value={selectedReturn.sale?.customer_id ? (customers.find(c => c.id === selectedReturn.sale?.customer_id)?.name || '-') : '-'} />
            <DetailRow label="Quantity" value={String(selectedReturn.quantity)} />
            <DetailRow label="Return Amount" value={`${currencySymbol}${Number(selectedReturn.return_amount).toFixed(2)}`} />
            <DetailRow label="Reason" value={selectedReturn.reason || '-'} />
            <DetailRow label="Status" value={selectedReturn.status} />
            {selectedReturn.note && <DetailRow label="Note" value={selectedReturn.note} />}
          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onCancel={() => { setShowDeleteDialog(false); setSelectedReturn(null); }}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this sale return? (${selectedReturn?.reference})`}
        isLoading={isLoading}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

export default SaleReturnList;
