import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { useToast } from '../../components/common/Toast';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import * as supplierService from '../../services/supplierService';

interface Supplier {
  id: number; name: string; company: string; email: string; phone: string;
  address: string; taxNumber: string; status: 'active' | 'inactive';
  opening_balance?: number; created_at?: string;
}

const SupplierList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = hasPermission('suppliers.manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    supplierService.getSuppliers().then(r => setSuppliers(r.data.data)).catch(() => {});
  }, []);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (supplier: Supplier) => { setSelectedSupplier(supplier); setShowDeleteDialog(true); };

  const confirmDelete = async () => {
    if (!selectedSupplier) return;
    setIsLoading(true);
    try {
      await supplierService.deleteSupplier(selectedSupplier.id);
      setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Supplier deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setSelectedSupplier(null);
    }
  };

  return (
    <div className="supplier-list-page">
      <div className="page-header">
        <h4>Suppliers</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Suppliers</span></div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManage && <Link to="/suppliers/add" className="btn btn-primary-custom d-flex align-items-center"><FiPlus className="me-1" /> Add Supplier</Link>}
            </div>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Supplier Name</th><th>Contact</th><th>Address</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedSuppliers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-muted">No suppliers found</td></tr>
                ) : paginatedSuppliers.map((supplier, index) => (
                  <tr key={supplier.id}>
                    <td><div className="fw-semibold">{startIndex + index + 1}</div></td>
                    <td><div className="fw-semibold">{supplier.name}</div><div className="text-muted small">{supplier.company}</div></td>
                    <td>
                      <div className="d-flex align-items-center mb-1"><FiMail size={14} className="me-1 text-muted" />{supplier.email}</div>
                      <div className="text-muted small d-flex align-items-center"><FiPhone size={12} className="me-1" />{supplier.phone || '-'}</div>
                    </td>
                    <td>{supplier.address || '-'}</td>
                    <td><span className={`badge ${supplier.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{supplier.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => { setSelectedSupplier(supplier); setIsViewOpen(true); }}><FiEye /></button>
                      {canManage && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => navigate(`/suppliers/edit/${supplier.id}`, { state: { supplier } })}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDelete(supplier)}><FiTrash2 /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {filteredSuppliers.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} entries</div>
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

      <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Supplier Details" size="lg">
        {selectedSupplier && (
          <div className="row g-4">
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-md-6"><small className="text-muted">Supplier Name</small><div className="fw-semibold fs-5">{selectedSupplier.name}</div></div>
                <div className="col-md-6"><small className="text-muted">Status</small><div><span className={`badge ${selectedSupplier.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{selectedSupplier.status}</span></div></div>
                <div className="col-md-6"><small className="text-muted">Company</small><div>{selectedSupplier.company || '-'}</div></div>
                <div className="col-md-6"><small className="text-muted">Tax Number</small><div>{selectedSupplier.taxNumber || '-'}</div></div>
                <div className="col-md-6"><small className="text-muted">Email</small><div>{selectedSupplier.email}</div></div>
                <div className="col-md-6"><small className="text-muted">Phone</small><div>{selectedSupplier.phone || '-'}</div></div>
                <div className="col-12"><small className="text-muted">Address</small><div>{selectedSupplier.address || '-'}</div></div>
                <div className="col-md-6"><small className="text-muted">Opening Balance</small><div>{selectedSupplier.opening_balance ?? 0}</div></div>
                <div className="col-md-6"><small className="text-muted">Created</small><div>{selectedSupplier.created_at?.split('T')[0] || '-'}</div></div>
              </div>
            </div>
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Supplier" message={`Are you sure you want to delete "${selectedSupplier?.name}"?`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => { setShowDeleteDialog(false); setSelectedSupplier(null); }} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default SupplierList;
