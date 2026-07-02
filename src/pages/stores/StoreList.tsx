import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { useToast } from '../../components/common/Toast';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ViewModal from '@/components/common/ViewModal';
import * as storeService from '../../services/storeService';

interface Store {
  id: number; name: string; code: string; manager: string; phone: string;
  address: string; email: string; status: string; created_at?: string;
}

const StoreList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = hasPermission('stores.manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    storeService.getStores().then(r => setStores(r.data.data)).catch(() => {});
  }, []);

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStores = filteredStores.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (store: Store) => { setSelectedStore(store); setShowDeleteDialog(true); };

  const confirmDelete = async () => {
    if (!selectedStore) return;
    setIsLoading(true);
    try {
      await storeService.deleteStore(selectedStore.id);
      setStores(prev => prev.filter(s => s.id !== selectedStore.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Store deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setSelectedStore(null);
    }
  };

  return (
    <div className="store-list-page">
      <div className="page-header">
        <h4>Stores</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><span>Stores</span>
        </div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search stores..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManage && (
                <Link to="/stores/add" className="btn btn-primary-custom d-flex align-items-center">
                  <FiPlus className="me-1" /> Add Store
                </Link>
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
                <tr><th>#</th><th>Store Name</th><th>Code</th><th>Manager</th><th>Contact</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedStores.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">No stores found</td></tr>
                ) : paginatedStores.map((store, index) => (
                  <tr key={store.id}>
                    <td>{startIndex + index + 1}</td>
                    <td><div className="fw-semibold">{store.name}</div></td>
                    <td>{store.code}</td>
                    <td>{store.manager || '-'}</td>
                    <td>
                      <div className="d-flex align-items-center mb-1"><FiPhone size={14} className="me-1 text-muted" />{store.phone || '-'}</div>
                      <div className="text-muted small d-flex align-items-center"><FiMapPin size={12} className="me-1" />{store.address || '-'}</div>
                    </td>
                    <td><span className={`badge ${store.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{store.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => { setSelectedStore(store); setIsViewOpen(true); }}><FiEye /></button>
                      {canManage && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => navigate(`/stores/edit/${store.id}`, { state: { store } })}><FiEdit /></button>
                          <button className="btn-action delete" onClick={() => handleDelete(store)}><FiTrash2 /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {filteredStores.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStores.length)} of {filteredStores.length} entries</div>
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

      <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Store Details" size="lg">
        {selectedStore && (
          <div className="row g-3">
            <div className="col-md-6"><small className="text-muted">Store Name</small><div className="fw-semibold fs-5">{selectedStore.name}</div></div>
            <div className="col-md-6"><small className="text-muted">Status</small><div><span className={`badge ${selectedStore.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{selectedStore.status}</span></div></div>
            <div className="col-md-6"><small className="text-muted">Store Code</small><div>{selectedStore.code}</div></div>
            <div className="col-md-6"><small className="text-muted">Manager</small><div>{selectedStore.manager || '-'}</div></div>
            <div className="col-md-6"><small className="text-muted">Email</small><div>{selectedStore.email || '-'}</div></div>
            <div className="col-md-6"><small className="text-muted">Phone</small><div>{selectedStore.phone || '-'}</div></div>
            <div className="col-12"><small className="text-muted">Address</small><div>{selectedStore.address || '-'}</div></div>
            <div className="col-md-6"><small className="text-muted">Created</small><div>{selectedStore.created_at?.split('T')[0] || '-'}</div></div>
          </div>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete Store" message={`Are you sure you want to delete "${selectedStore?.name}"?`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => { setShowDeleteDialog(false); setSelectedStore(null); }} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default StoreList;
