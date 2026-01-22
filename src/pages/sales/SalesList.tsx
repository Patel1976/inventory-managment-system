import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog, ViewModal, FormModal, DetailRow } from '../../components/common';
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

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({ status: '', paymentStatus: '', paid: 0 });

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

  const handleView = (sale: Sale) => { setSelectedSale(sale); setShowViewModal(true); };
  const handleEdit = (sale: Sale) => { 
    setSelectedSale(sale); 
    setFormData({ status: sale.status, paymentStatus: sale.paymentStatus, paid: sale.paid });
    setShowEditModal(true); 
  };
  const handleDeleteClick = (sale: Sale) => { setSelectedSale(sale); setShowDeleteDialog(true); };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSales(prev => prev.map(s => s.id === selectedSale?.id ? { ...s, ...formData, due: s.total - formData.paid } : s));
      setIsLoading(false);
      setShowEditModal(false);
      showToast({ type: 'success', title: 'Success', message: 'Sale updated successfully!' });
    }, 500);
  };

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSales(prev => prev.filter(s => s.id !== selectedSale?.id));
      setIsLoading(false);
      setShowDeleteDialog(false);
      showToast({ type: 'success', title: 'Deleted', message: 'Sale deleted successfully!' });
    }, 500);
  };

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
            <div className="col-12 col-md-3">
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
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2"><FiDownload className="me-1" /> Export</button>
              <Link to="/sales/add" className="btn btn-primary-custom"><FiPlus className="me-1" /> Add Sale</Link>
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
                {filteredSales.map((sale) => (
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
            <div className="text-muted">Showing 1 to {filteredSales.length} of {filteredSales.length} entries</div>
            <nav><ul className="pagination mb-0"><li className="page-item active"><span className="page-link">1</span></li></ul></nav>
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

      <FormModal isOpen={showEditModal} title="Edit Sale" onClose={() => setShowEditModal(false)} onSubmit={handleEditSubmit} isLoading={isLoading}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Payment Status</label>
            <select className="form-select" value={formData.paymentStatus} onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}>
              <option value="Unpaid">Unpaid</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Amount Paid</label>
            <input type="number" className="form-control" value={formData.paid} onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) })} />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Sale" message={`Are you sure you want to delete sale "${selectedSale?.id}"?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setShowDeleteDialog(false)} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default SalesList;
