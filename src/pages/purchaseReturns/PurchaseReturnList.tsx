import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';

export interface PurchaseReturnItem {
  id: string;
  date: string;
  purchaseRef: string;
  supplier: string;
  product: string;
  quantity: number;
  returnAmount: number;
  reason: string;
  status: string;
}

export const mockPurchaseReturns: PurchaseReturnItem[] = [
  { id: 'PR-001', date: '2024-01-15', purchaseRef: 'PO-001', supplier: 'Tech Suppliers Inc', product: 'iPhone 14 Pro', quantity: 2, returnAmount: 1998.00, reason: 'Defective batch', status: 'Completed' },
  { id: 'PR-002', date: '2024-01-14', purchaseRef: 'PO-002', supplier: 'Global Electronics', product: 'Samsung Galaxy S23', quantity: 1, returnAmount: 899.00, reason: 'Wrong model shipped', status: 'Pending' },
  { id: 'PR-003', date: '2024-01-13', purchaseRef: 'PO-003', supplier: 'Premium Parts Ltd', product: 'MacBook Pro M2', quantity: 1, returnAmount: 1999.00, reason: 'Damaged in transit', status: 'Completed' },
  { id: 'PR-004', date: '2024-01-12', purchaseRef: 'PO-001', supplier: 'Tech Suppliers Inc', product: 'Sony Headphones', quantity: 3, returnAmount: 1047.00, reason: 'Quality issue', status: 'Processing' },
  { id: 'PR-005', date: '2024-01-11', purchaseRef: 'PO-004', supplier: 'Digital World', product: 'Dell Monitor 27"', quantity: 2, returnAmount: 598.00, reason: 'Excess order', status: 'Completed' },
];

const PurchaseReturnList = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [returns, setReturns] = useState<PurchaseReturnItem[]>(mockPurchaseReturns);

  const filteredReturns = returns.filter(item => {
    const matchesSearch = item.purchaseRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesSupplier = !supplierFilter || item.supplier === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const handleDelete = (item: PurchaseReturnItem) => {
    if (window.confirm(`Are you sure you want to delete purchase return "${item.id}"?`)) {
      setReturns(prev => prev.filter(r => r.id !== item.id));
      showToast({ type: 'success', title: 'Deleted', message: `Purchase return ${item.id} deleted successfully!` });
    }
  };

  return (
    <div className="purchase-return-page">
      <div className="page-header">
        <h4>Purchase Returns</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><span>Purchase Returns</span>
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
            <div className="col-12 col-md-2">
              <select className="form-select" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
                <option value="">All Suppliers</option>
                <option value="Tech Suppliers Inc">Tech Suppliers Inc</option>
                <option value="Global Electronics">Global Electronics</option>
                <option value="Premium Parts Ltd">Premium Parts Ltd</option>
                <option value="Digital World">Digital World</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3 text-end">
              <button className="btn btn-outline-secondary me-2"><FiDownload className="me-1" /> Export</button>
              <button className="btn btn-primary-custom" onClick={() => navigate('/purchases/returns/add')}>
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
              <thead>
                <tr>
                  <th>Date</th><th>Purchase Ref</th><th>Supplier</th><th>Product</th><th>Quantity</th><th>Return Amount</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturns.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td><strong>{item.purchaseRef}</strong></td>
                    <td>{item.supplier}</td>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>${item.returnAmount.toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => navigate(`/purchases/returns/view/${item.id}`)}><FiEye /></button>
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
            <span className="text-muted">Showing 1 to {filteredReturns.length} of {filteredReturns.length} entries</span>
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item disabled"><a className="page-link" href="#">Next</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturnList;
