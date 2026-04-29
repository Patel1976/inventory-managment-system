import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, DetailRow } from '../../components/common';
import { useToast } from '../../components/common/Toast';

interface Sale {
  id: string;
  date: string;
  customer: string;
  store: string;
  total: number;
  paid: number;
  due: number;
  status: string;
  paymentStatus: string;
  items?: { name: string; qty: number; price: number }[];
}

const SalesList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const canEdit = hasPermission('sales.edit');
  const canDelete = hasPermission('sales.delete');

  const navigate = useNavigate();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sales, setSales] = useState<Sale[]>([
    { id: 'INV-001', date: '2024-01-15', customer: 'John Doe', store: 'Main Store', total: 1250.00, paid: 1250.00, due: 0, status: 'Completed', paymentStatus: 'Paid', items: [{ name: 'iPhone 14 Pro', qty: 1, price: 999 }, { name: 'AirPods Pro', qty: 1, price: 251 }] },
    { id: 'INV-002', date: '2024-01-14', customer: 'Jane Smith', store: 'Branch 1', total: 850.00, paid: 500.00, due: 350.00, status: 'Pending', paymentStatus: 'Partial', items: [{ name: 'Samsung Galaxy S23', qty: 1, price: 850 }] },
    { id: 'INV-003', date: '2024-01-14', customer: 'Bob Wilson', store: 'Main Store', total: 2100.00, paid: 2100.00, due: 0, status: 'Completed', paymentStatus: 'Paid', items: [{ name: 'MacBook Pro M2', qty: 1, price: 1999 }, { name: 'USB-C Hub', qty: 2, price: 101 }] },
    { id: 'INV-004', date: '2024-01-13', customer: 'Alice Brown', store: 'Branch 2', total: 450.00, paid: 0, due: 450.00, status: 'Pending', paymentStatus: 'Unpaid', items: [{ name: 'Apple Watch Series 8', qty: 1, price: 450 }] },
    { id: 'INV-005', date: '2024-01-13', customer: 'Charlie Davis', store: 'Main Store', total: 1800.00, paid: 1800.00, due: 0, status: 'Completed', paymentStatus: 'Paid', items: [{ name: 'iPad Pro 12.9', qty: 1, price: 1099 }, { name: 'Logitech MX Master 3', qty: 1, price: 99 }] },
    { id: 'INV-006', date: '2024-01-12', customer: 'Eva Martinez', store: 'Branch 1', total: 975.00, paid: 975.00, due: 0, status: 'Completed', paymentStatus: 'Paid', items: [{ name: 'Sony Headphones', qty: 2, price: 698 }] },
  ]);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) || sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || sale.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleView = (sale: Sale) => { setSelectedSale(sale); setShowViewModal(true); };
  const handleEdit = (sale: Sale) => {
    navigate(`/sales/edit/${sale.id}`, { state: { sale } });
  };
  const handleDeleteClick = (sale: Sale) => { setSelectedSale(sale); setShowDeleteDialog(true); };

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSales(prev => prev.filter(s => s.id !== selectedSale?.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      showToast({ type: 'success', title: 'Deleted', message: 'Sale deleted successfully!' });
    }, 500);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="sales-list-page">
      <div className="page-header">
        <h4>Sales List</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><span>Sales List</span>
        </div>
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
            <div className="col-12 col-md-2"><input type="date" className="form-control" /></div>
            <div className="col-12 col-md-2"><input type="date" className="form-control" /></div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="col-12 col-md-4 text-end d-flex justify-content-end align-items-center">
              <button className="btn btn-outline-secondary me-2 d-flex align-items-center"><FiDownload className="me-1" /> Export</button>
              <Link to="/sales/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Sale</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Store</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Payment</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => (
                  <tr key={sale.id}>
                    <td><strong>{sale.id}</strong></td>
                    <td>{sale.date}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.store}</td>
                    <td>${sale.total.toFixed(2)}</td>
                    <td>${sale.paid.toFixed(2)}</td>
                    <td>${sale.due.toFixed(2)}</td>
                    <td><span className={`badge ${sale.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{sale.status}</span></td>
                    <td><span className={`badge ${sale.paymentStatus === 'Paid' ? 'badge-success' : sale.paymentStatus === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>{sale.paymentStatus}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleView(sale)}><FiEye /></button>
                      {canEdit && <button className="btn-action edit me-1" onClick={() => handleEdit(sale)}><FiEdit /></button>}
                      {canDelete && <button className="btn-action delete" onClick={() => handleDeleteClick(sale)}><FiTrash2 /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredSales.length)} of{" "}
              {filteredSales.length} entries
            </div>

            <nav>
              <ul className="pagination mb-0">
                {/* Previous */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage(prev => Math.max(1, prev - 1))
                    }
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
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage(prev =>
                        Math.min(totalPages, prev + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <ViewModal isOpen={showViewModal} title="Sale Details" onClose={() => setShowViewModal(false)}>
        {selectedSale && (
          <div>
            <DetailRow label="Invoice" value={<strong>{selectedSale.id}</strong>} />
            <DetailRow label="Date" value={selectedSale.date} />
            <DetailRow label="Customer" value={selectedSale.customer} />
            <DetailRow label="Store" value={selectedSale.store} />
            <DetailRow label="Total" value={<strong>${selectedSale.total.toFixed(2)}</strong>} />
            <DetailRow label="Paid" value={`$${selectedSale.paid.toFixed(2)}`} />
            <DetailRow label="Due" value={`$${selectedSale.due.toFixed(2)}`} />
            <DetailRow label="Status" value={<span className={`badge ${selectedSale.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{selectedSale.status}</span>} />
            {selectedSale.items && (
              <div className="mt-3">
                <h6>Items</h6>
                <table className="table table-sm items-table">
                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
                  <tbody>{selectedSale.items.map((item, i) => <tr key={i}><td>{item.name}</td><td>{item.qty}</td><td>${item.price}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Sale" message={`Are you sure you want to delete sale "${selectedSale?.id}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default SalesList;
