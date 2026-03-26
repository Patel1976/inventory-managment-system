import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface Supplier { id: number; name: string; company: string; email: string; phone: string; address: string; taxNumber: string; purchases: number; totalPurchased: number, status: 'active' | 'inactive'; }

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
  const itemsPerPage = 10;

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'Tech Suppliers Inc', company: 'Tech Suppliers Inc', email: 'contact@techsuppliers.com', phone: '+1 234 567 890', address: '100 Tech Park, Silicon Valley', taxNumber: 'TX-001234', purchases: 45, totalPurchased: 125000.00, status: 'active' },
    { id: 2, name: 'Global Electronics', company: 'Global Electronics Ltd', email: 'sales@globalelec.com', phone: '+1 234 567 891', address: '200 Industry Blvd, Texas', taxNumber: 'TX-005678', purchases: 32, totalPurchased: 89500.00, status: 'active' },
    { id: 3, name: 'Premium Parts Ltd', company: 'Premium Parts Ltd', email: 'info@premiumparts.com', phone: '+1 234 567 892', address: '300 Commerce St, Florida', taxNumber: 'TX-009012', purchases: 28, totalPurchased: 67800.00, status: 'active' },
    { id: 4, name: 'Digital World', company: 'Digital World Corp', email: 'orders@digitalworld.com', phone: '+1 234 567 893', address: '400 Digital Ave, California', taxNumber: 'TX-003456', purchases: 19, totalPurchased: 45200.00, status: 'inactive' },
    { id: 5, name: 'Global Solutions', company: 'Global Solutions Ltd', email: 'info@globalsolutions.com', phone: '+1 234 567 894', address: '500 Global St, New York', taxNumber: 'TX-007890', purchases: 25, totalPurchased: 72300.00, status: 'active' },
    { id: 6, name: 'Innovate Tech', company: 'Innovate Tech Inc', email: 'support@innovatetech.com', phone: '+1 234 567 895', address: '600 Innovation Blvd, Boston', taxNumber: 'TX-012345', purchases: 12, totalPurchased: 34500.00, status: 'active' },
  ]);

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedSupplier) return;

    setSuppliers(prev =>
      prev.filter(s => s.id !== selectedSupplier.id)
    );

    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Supplier deleted successfully!'
    });

    setShowDeleteDialog(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="supplier-list-page">
      <div className="page-header">
        <h4>Suppliers</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Suppliers</span>
        </div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManage &&
                <Link to="/suppliers/add" className="btn btn-primary-custom d-flex align-items-center">
                  <FiPlus className="me-1" /> Add Supplier
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
                  <th>Supplier Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Orders</th>
                  <th>Total Purchased</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSuppliers.map((supplier, index) => (
                  <tr key={supplier.id}>
                    <td>
                      <div className="fw-semibold">{index + 1}</div>
                    </td>
                    <td>
                      <div className="fw-semibold">{supplier.name}</div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center mb-1'>
                        <FiMail size={14} className="me-1 text-muted" />{supplier.email}
                      </div>
                      <div className="text-muted small d-flex align-items-center">
                        <FiPhone size={12} className="me-1" />{supplier.phone}
                      </div>
                    </td>
                    <td>{supplier.address}</td>
                    <td>{supplier.purchases}</td>
                    <td><strong>${supplier.totalPurchased.toLocaleString()}</strong></td>
                    <td>
                      <button className="btn-action view me-1"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsViewOpen(true);
                        }}>
                        <FiEye />
                      </button>
                      {canManage && <>
                        <button className="btn-action edit me-1" onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}><FiEdit /></button>
                        <button className="btn-action delete" onClick={() => handleDelete(supplier)}><FiTrash2 /></button>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} of {filteredSuppliers.length} entries
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
        title="Supplier Details"
        size="lg"
      >
        {selectedSupplier && (
          <div className="row g-4">
            {/* Left Side - Details */}
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-md-6">
                  <small className="text-muted">Supplier Name</small>
                  <div className="fw-semibold fs-5">
                    {selectedSupplier.name}
                  </div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Status</small>
                  <div>
                    <span className={`badge ${selectedSupplier.status === 'active'
                      ? 'badge-success'
                      : 'badge-warning'
                      }`}>
                      {selectedSupplier.status}
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Company</small>
                  <div>{selectedSupplier.company}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Tax Number</small>
                  <div>{selectedSupplier.taxNumber}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Email</small>
                  <div>{selectedSupplier.email}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Phone</small>
                  <div>{selectedSupplier.phone}</div>
                </div>
                <div className="col-12">
                  <small className="text-muted">Address</small>
                  <div>{selectedSupplier.address}</div>
                </div>
              </div>
            </div>
            {/* Right Side - Summary Card */}
            <div className="col-md-4">
              <div className="bg-light rounded p-3 h-100">
                <div className="mb-3">
                  <small className="text-muted">Total Orders</small>
                  <div className="fs-4 fw-bold">
                    {selectedSupplier.purchases}
                  </div>
                </div>
                <div>
                  <small className="text-muted">Total Purchased</small>
                  <div className="fs-4 fw-bold text-success">
                    ${selectedSupplier.totalPurchased.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${selectedSupplier?.name}"?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedSupplier(null);
        }}
        variant="danger"
      />
    </div>
  );
};

export default SupplierList;
