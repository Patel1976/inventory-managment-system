import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMapPin, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ViewModal from '@/components/common/ViewModal';

interface Store { id: number; name: string; code: string; manager: string; phone: string; address: string; products: number; status: string; email: string; }

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
  const itemsPerPage = 10;

  const [stores, setStores] = useState<Store[]>([
    { id: 1, name: 'Main Store', code: 'MS001', email: 'main@store.com', phone: '+1 234 567 890', address: '123 Main Street, Downtown', manager: 'John Manager', products: 248, status: 'active' },
    { id: 2, name: 'Branch 1', code: 'BR001', email: 'branch1@store.com', phone: '+1 234 567 891', address: '456 Oak Avenue, Uptown', manager: 'Jane Supervisor', products: 156, status: 'active' },
    { id: 3, name: 'Branch 2', code: 'BR002', email: 'branch2@store.com', phone: '+1 234 567 892', address: '789 Pine Road, Midtown', manager: 'Bob Lead', products: 98, status: 'active' },
    { id: 4, name: 'Warehouse', code: 'WH001', email: 'warehouse@store.com', phone: '+1 234 567 893', address: '100 Industrial Park', manager: 'Alice Stock', products: 520, status: 'active' },
    { id: 5, name: 'Outlet Store', code: 'OS001', email: 'outlet@store.com', phone: '+1 234 567 894', address: '200 Outlet Blvd, Suburbia', manager: 'Charlie Retailer', products: 87, status: 'active' },
    { id: 6, name: 'Showroom', code: 'SR001', email: 'showroom@store.com', phone: '+1 234 567 895', address: '300 Showroom Ave, City Center', manager: 'Diana Display', products: 176, status: 'inactive' },
  ]);

  const filteredStores = stores.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStores = filteredStores.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (store: Store) => {
    setSelectedStore(store);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedStore) return;

    setStores(prev =>
      prev.filter(s => s.id !== selectedStore.id)
    );

    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Store deleted successfully!'
    });

    setShowDeleteDialog(false);
    setSelectedStore(null);
  };

  return (
    <div className="store-list-page">
      <div className="page-header">
        <h4>Stores</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Stores</span>
        </div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch />
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Search stores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManage &&
                <Link to="/stores/add" className="btn btn-primary-custom d-flex align-items-center">
                  <FiPlus className="me-1" />
                  Add Store
                </Link>
              }
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
                  <th>#</th>
                  <th>Store Name</th>
                  <th>Code</th>
                  <th>Manager</th>
                  <th>Contact</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStores.map((store, index) => (
                  <tr key={store.id}>
                    <td><div className="fw-semibold">{index + 1}</div></td>
                    <td><div className="fw-semibold">{store.name}</div>
                    </td><td>{store.code}</td>
                    <td>{store.manager}</td>
                    <td>
                      <div className="d-flex align-items-center mb-1">
                        <FiPhone size={14} className="me-1 text-muted" />
                        {store.phone}
                      </div>
                      <div className="text-muted small d-flex align-items-center">
                        <FiMapPin size={12} className="me-1" />
                        {store.address}
                      </div>
                    </td>
                    <td>{store.products}</td>
                    <td><span className="badge badge-success">{store.status}</span></td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => {
                        setSelectedStore(store);
                        setIsViewOpen(true);
                      }}>
                        <FiEye />
                      </button>
                      {canManage && <>
                        <button className="btn-action edit me-1" onClick={() => navigate(`/stores/edit/${store.id}`)}>
                          <FiEdit />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete(store)}>
                          <FiTrash2 />
                        </button>
                      </>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStores.length)} of {filteredStores.length} entries
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
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
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

      <ViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Store Details"
        size="lg"
      >
        {selectedStore && (
          <div className="row g-4">

            {/* Left Side - Store Details */}
            <div className="col-md-8">
              <div className="row g-3">

                <div className="col-md-6">
                  <small className="text-muted">Store Name</small>
                  <div className="fw-semibold fs-5">
                    {selectedStore.name}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Status</small>
                  <div>
                    <span
                      className={`badge ${selectedStore.status === 'active'
                        ? 'badge-success'
                        : 'badge-warning'
                        }`}
                    >
                      {selectedStore.status}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Store Code</small>
                  <div>{selectedStore.code}</div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Manager</small>
                  <div>{selectedStore.manager}</div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Email</small>
                  <div>{selectedStore.email}</div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Phone</small>
                  <div>{selectedStore.phone}</div>
                </div>

                <div className="col-12">
                  <small className="text-muted">Address</small>
                  <div>{selectedStore.address}</div>
                </div>

              </div>
            </div>

            {/* Right Side - Summary Card */}
            <div className="col-md-4">
              <div className="bg-light rounded p-3 h-100">

                <div className="mb-3">
                  <small className="text-muted">Total Products</small>
                  <div className="fs-4 fw-bold">
                    {selectedStore.products}
                  </div>
                </div>

                <div>
                  <small className="text-muted">Store Code</small>
                  <div className="fs-5 fw-semibold text-primary">
                    {selectedStore.code}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Store"
        message={`Are you sure you want to delete "${selectedStore?.name}"?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedStore(null);
        }}
        variant="danger"
      />
    </div>
  );
};

export default StoreList;
