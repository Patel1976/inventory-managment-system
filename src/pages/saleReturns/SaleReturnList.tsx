import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export interface SaleReturnItem {
  id: string; date: string; saleRef: string; customer: string; product: string; quantity: number; returnAmount: number; reason: string; status: string;
}

export const mockSaleReturns: SaleReturnItem[] = [
  { id: 'SR-001', date: '2024-01-15', saleRef: 'INV-001', customer: 'John Doe', product: 'iPhone 14 Pro', quantity: 1, returnAmount: 999.00, reason: 'Defective screen', status: 'Completed' },
  { id: 'SR-002', date: '2024-01-14', saleRef: 'INV-002', customer: 'Jane Smith', product: 'Samsung Galaxy S23', quantity: 1, returnAmount: 899.00, reason: 'Wrong color', status: 'Pending' },
  { id: 'SR-003', date: '2024-01-13', saleRef: 'INV-003', customer: 'Bob Wilson', product: 'Sony Headphones', quantity: 2, returnAmount: 698.00, reason: 'Not as described', status: 'Completed' },
  { id: 'SR-004', date: '2024-01-12', saleRef: 'INV-001', customer: 'John Doe', product: 'MacBook Pro M2', quantity: 1, returnAmount: 1999.00, reason: 'Changed mind', status: 'Processing' },
  { id: 'SR-005', date: '2024-01-11', saleRef: 'INV-004', customer: 'Alice Brown', product: 'Dell Monitor 27"', quantity: 1, returnAmount: 299.00, reason: 'Dead pixels', status: 'Completed' },
];

const SaleReturnList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [returns, setReturns] = useState<SaleReturnItem[]>(mockSaleReturns);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleView = (item: SaleReturnItem) => {
    setSelectedReturn(item);
    setIsViewOpen(true);
  };

  const filteredReturns = returns.filter(item => {
    const matchesSearch = item.saleRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesCustomer = !customerFilter || item.customer === customerFilter;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredReturns.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, customerFilter]);
  useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages); }, [filteredReturns.length, totalPages, currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const handleDelete = (item: SaleReturnItem) => {
    setSelectedReturn(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedReturn) return;

    setReturns(prev =>
      prev.filter(r => r.id !== selectedReturn.id)
    );

    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Sale return deleted successfully!'
    });

    setShowDeleteDialog(false);
    setSelectedReturn(null);
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
            <div className="col-12 col-md-2">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
                <option value="">All Customers</option>
                <option value="John Doe">John Doe</option><option value="Jane Smith">Jane Smith</option><option value="Bob Wilson">Bob Wilson</option><option value="Alice Brown">Alice Brown</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option><option value="Completed">Completed</option><option value="Pending">Pending</option><option value="Processing">Processing</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-4 text-end d-flex justify-content-end">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              <button className="btn btn-primary-custom d-flex align-items-center" onClick={() => navigate('/sales/returns/add')}>
                <FiPlus className="me-1" /> Add Return
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Sale Ref</th><th>Customer</th><th>Product</th><th>Quantity</th><th>Return Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td><td><strong>{item.saleRef}</strong></td><td>{item.customer}</td><td>{item.product}</td><td>{item.quantity}</td>
                    <td>${item.returnAmount.toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(item)}><FiEye /></button>
                      {isAdmin && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => navigate(`/sales/returns/edit/${item.id}`)}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDelete(item)}><FiTrash2 /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-muted">Showing {filteredReturns.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReturns.length)} of {filteredReturns.length} entries</span>
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
      <ViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Sale Return Details"
        size="lg"
      >
        {selectedReturn && (
          <div className="row g-3">

            <div className="col-md-6">
              <small className="text-muted">Return ID</small>
              <div className="fw-semibold">{selectedReturn.id}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Date</small>
              <div>{selectedReturn.date}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Sale Ref</small>
              <div className="fw-semibold">{selectedReturn.saleRef}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Customer</small>
              <div>{selectedReturn.customer}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Product</small>
              <div>{selectedReturn.product}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Quantity</small>
              <div>{selectedReturn.quantity}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Return Amount</small>
              <div className="fw-bold text-success">
                ${selectedReturn.returnAmount.toFixed(2)}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Status</small>
              <div>
                <span className={`badge ${getStatusBadge(selectedReturn.status)}`}>
                  {selectedReturn.status}
                </span>
              </div>
            </div>

            <div className="col-12">
              <small className="text-muted">Reason</small>
              <div>{selectedReturn.reason}</div>
            </div>

          </div>
        )}
      </ViewModal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete return ${selectedReturn?.id}?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default SaleReturnList;
