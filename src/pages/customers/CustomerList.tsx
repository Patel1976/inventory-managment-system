import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { useToast } from '../../components/common/Toast';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import * as customerService from '../../services/customerService';

interface Customer {
  id: number; name: string; email: string; phone: string; address: string;
  city: string; country: string; status: 'active' | 'inactive'; opening_balance?: number;
  created_at?: string;
}

const CustomerList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = hasPermission('customers.manage');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    customerService.getCustomers().then(r => setCustomers(r.data.data)).catch(() => {});
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (customer: Customer) => { setSelectedCustomer(customer); setShowDeleteDialog(true); };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    setIsLoading(true);
    try {
      await customerService.deleteCustomer(selectedCustomer.id);
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Customer deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="customer-list-page">
      <div className="page-header">
        <h4>Customers</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Customers</span></div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search customers..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManage && <Link to="/customers/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Customer</Link>}
            </div>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Contact</th><th>Address</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted">No customers found</td></tr>
                ) : paginatedCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td className="fw-semibold">{startIndex + index + 1}</td>
                    <td><div className="fw-semibold">{customer.name}</div></td>
                    <td>
                      <div className="d-flex align-items-center mb-1"><FiMail size={14} className="me-2 text-muted" /><span>{customer.email}</span></div>
                      <div className="d-flex align-items-center text-muted small"><FiPhone size={14} className="me-2" />{customer.phone || '-'}</div>
                    </td>
                    <td className="text-muted">{customer.address || '-'}</td>
                    <td><span className={`badge ${customer.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{customer.status}</span></td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button className="btn-action view me-2" onClick={() => { setSelectedCustomer(customer); setIsViewOpen(true); }}><FiEye /></button>
                        {canManage && (
                          <>
                            <button className="btn-action edit me-2" onClick={() => navigate(`/customers/edit/${customer.id}`, { state: { customer } })}><FiEdit /></button>
                            <button className="btn-action delete" onClick={() => handleDelete(customer)}><FiTrash2 /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {filteredCustomers.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries</div>
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

      <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Customer Details" size="lg">
        {selectedCustomer && (
          <div className="row g-4">
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-md-6"><small className="text-muted">Name</small><div className="fw-semibold fs-5">{selectedCustomer.name}</div></div>
                <div className="col-md-6"><small className="text-muted">Status</small><div><span className={`badge ${selectedCustomer.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{selectedCustomer.status}</span></div></div>
                <div className="col-md-6"><small className="text-muted">Email</small><div>{selectedCustomer.email}</div></div>
                <div className="col-md-6"><small className="text-muted">Phone</small><div>{selectedCustomer.phone || '-'}</div></div>
                <div className="col-12"><small className="text-muted">Address</small><div>{selectedCustomer.address || '-'}</div></div>
                <div className="col-md-6"><small className="text-muted">City</small><div>{selectedCustomer.city || '-'}</div></div>
                <div className="col-md-6"><small className="text-muted">Country</small><div>{selectedCustomer.country || '-'}</div></div>
                <div className="col-md-6"><small className="text-muted">Opening Balance</small><div>{selectedCustomer.opening_balance ?? 0}</div></div>
                <div className="col-md-6"><small className="text-muted">Created</small><div>{selectedCustomer.created_at?.split('T')[0] || '-'}</div></div>
              </div>
            </div>
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Customer" message={`Are you sure you want to delete "${selectedCustomer?.name}"?`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => { setShowDeleteDialog(false); setSelectedCustomer(null); }} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default CustomerList;
