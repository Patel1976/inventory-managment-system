import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import ViewModal from '../../components/common/ViewModal';
import { ConfirmDialog } from '@/components/common';

export interface PurchaseReturnItem {
  id: string; date: string; purchaseRef: string; supplier: string; product: string; quantity: number; returnAmount: number; reason: string; status: string;
}

export const mockPurchaseReturns: PurchaseReturnItem[] = [
  { id: 'PR-001', date: '2024-01-15', purchaseRef: 'PO-001', supplier: 'Tech Suppliers Inc', product: 'iPhone 14 Pro', quantity: 2, returnAmount: 1998.00, reason: 'Defective batch', status: 'Completed' },
  { id: 'PR-002', date: '2024-01-14', purchaseRef: 'PO-002', supplier: 'Global Electronics', product: 'Samsung Galaxy S23', quantity: 1, returnAmount: 899.00, reason: 'Wrong model shipped', status: 'Pending' },
  { id: 'PR-003', date: '2024-01-13', purchaseRef: 'PO-003', supplier: 'Premium Parts Ltd', product: 'MacBook Pro M2', quantity: 1, returnAmount: 1999.00, reason: 'Damaged in transit', status: 'Completed' },
  { id: 'PR-004', date: '2024-01-12', purchaseRef: 'PO-001', supplier: 'Tech Suppliers Inc', product: 'Sony Headphones', quantity: 3, returnAmount: 1047.00, reason: 'Quality issue', status: 'Processing' },
  { id: 'PR-005', date: '2024-01-11', purchaseRef: 'PO-004', supplier: 'Digital World', product: 'Dell Monitor 27"', quantity: 2, returnAmount: 598.00, reason: 'Excess order', status: 'Completed' },
  { id: 'PR-006', date: '2024-01-10', purchaseRef: 'PO-005', supplier: 'Global Electronics', product: 'Logitech MX Master 3', quantity: 1, returnAmount: 99.00, reason: 'Wrong model shipped', status: 'Completed' },
];

const PurchaseReturnList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [returns, setReturns] = useState<PurchaseReturnItem[]>(mockPurchaseReturns);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseReturnItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleView = (item: PurchaseReturnItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const filteredReturns = returns.filter(item => {
    const matchesSearch = item.purchaseRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesSupplier = !supplierFilter || item.supplier === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReturns = filteredReturns.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const handleDelete = (item: PurchaseReturnItem) => {
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;

    setReturns(prev =>
      prev.filter(r => r.id !== selectedItem?.id)
    );

    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Purchase return deleted successfully!'
    });

    setShowDeleteDialog(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, supplierFilter]);

  return (
    <div className="purchase-return-page">
      <div className="page-header">
        <h4>Purchase Returns</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Purchase Returns</span></div>
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
              <select className="form-select" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
                <option value="">All Suppliers</option>
                <option value="Tech Suppliers Inc">Tech Suppliers Inc</option><option value="Global Electronics">Global Electronics</option><option value="Premium Parts Ltd">Premium Parts Ltd</option><option value="Digital World">Digital World</option>
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
              <button className="btn btn-primary-custom d-flex align-items-center" onClick={() => navigate('/purchases/returns/add')}>
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
              <thead><tr><th>Date</th><th>Purchase Ref</th><th>Supplier</th><th>Product</th><th>Quantity</th><th>Return Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {paginatedReturns.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td><td><strong>{item.purchaseRef}</strong></td><td>{item.supplier}</td><td>{item.product}</td><td>{item.quantity}</td>
                    <td>${item.returnAmount.toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(item)}><FiEye /></button>
                      {isAdmin && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => navigate(`/purchases/returns/edit/${item.id}`)}><FiEdit /></button>
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
            <span className="text-muted">
              Showing {filteredReturns.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredReturns.length)} of{" "}
              {filteredReturns.length} entries
            </span>

            <nav>
              <ul className="pagination mb-0">

                {/* Previous */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
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
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}

                {/* Next */}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage(prev => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </button>
                </li>

              </ul>
            </nav>
          </div>
        </div>
      </div>
      <ViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Purchase Return Details"
        size="lg"
      >
        {selectedItem && (
          <div className="row g-3">

            <div className="col-md-6">
              <small className="text-muted">Return ID</small>
              <div className="fw-semibold">{selectedItem.id}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Date</small>
              <div>{selectedItem.date}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Purchase Ref</small>
              <div className="fw-semibold">{selectedItem.purchaseRef}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Supplier</small>
              <div>{selectedItem.supplier}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Product</small>
              <div>{selectedItem.product}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Quantity</small>
              <div>{selectedItem.quantity}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Return Amount</small>
              <div className="fw-bold text-success">
                ${selectedItem.returnAmount.toFixed(2)}
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Status</small>
              <div>
                <span className={`badge ${getStatusBadge(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>

            <div className="col-12">
              <small className="text-muted">Reason</small>
              <div>{selectedItem.reason}</div>
            </div>

          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete return ${selectedItem?.id}?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default PurchaseReturnList;