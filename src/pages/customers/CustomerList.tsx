import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface Customer {
  id: number; name: string; email: string; phone: string; address: string; purchases: number; totalSpent: number, city: string; country: string; status: 'Active' | 'Inactive';
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

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', address: '123 Main St, New York', city: 'New York', country: 'USA', purchases: 15, totalSpent: 4520.00, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', address: '456 Oak Ave, Los Angeles', city: 'Los Angeles', country: 'USA', purchases: 8, totalSpent: 2180.00, status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', address: '789 Pine Rd, Chicago', city: 'Chicago', country: 'USA', purchases: 22, totalSpent: 7890.00, status: 'Active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', address: '321 Elm St, Houston', city: 'Houston', country: 'USA', purchases: 5, totalSpent: 1250.00, status: 'Inactive' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', address: '654 Maple Dr, Phoenix', city: 'Phoenix', country: 'USA', purchases: 12, totalSpent: 3450.00, status: 'Active' },
    { id: 6, name: 'Diana Green', email: 'diana@example.com', phone: '+1 234 567 895', address: '987 Cedar Ln, Seattle', city: 'Seattle', country: 'USA', purchases: 7, totalSpent: 1890.00, status: 'Active' },
  ]);

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedCustomer) return;

    setCustomers(prev =>
      prev.filter(c => c.id !== selectedCustomer.id)
    );

    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Customer deleted successfully!'
    });

    setShowDeleteDialog(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="customer-list-page">
      <div className="page-header">
        <h4>Customers</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Customers</span>
        </div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManage &&
                <Link to="/customers/add" className="btn btn-primary-custom d-flex align-items-center">
                  <FiPlus className="me-1" /> Add Customer
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
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Purchases</th>
                  <th>Total Spent</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td className="fw-semibold">{index + 1}</td>

                      <td>
                        <div className="fw-semibold">{customer.name}</div>
                      </td>

                      <td>
                        <div className="d-flex align-items-center mb-1">
                          <FiMail size={14} className="me-2 text-muted" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="d-flex align-items-center text-muted small">
                          <FiPhone size={14} className="me-2" />
                          {customer.phone}
                        </div>
                      </td>

                      <td className="text-muted">{customer.address}</td>

                      <td>
                        {customer.purchases}
                      </td>

                      <td className="fw-bold text-success">
                        ${customer.totalSpent.toFixed(2)}
                      </td>

                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn-action view me-2"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsViewOpen(true);
                            }}
                          >
                            <FiEye />
                          </button>

                          {canManage && (
                            <>
                              <button
                                className="btn-action edit me-2"
                                onClick={() => navigate(`/customers/edit/${customer.id}`)}
                              >
                                <FiEdit />
                              </button>

                              <button
                                className="btn-action delete"
                                onClick={() => handleDelete(customer)}
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
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
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="row g-4">

            {/* Left Section */}
            <div className="col-md-8">

              <div className="row g-3">

                <div className="col-md-6">
                  <small className="text-muted">Name</small>
                  <div className="fw-semibold fs-5">
                    {selectedCustomer.name}
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Status</small>
                  <div>
                    <span className={`badge ${selectedCustomer.status === 'Active'
                      ? 'badge-success'
                      : 'badge-warning'
                      }`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Email</small>
                  <div>{selectedCustomer.email}</div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Phone</small>
                  <div>{selectedCustomer.phone}</div>
                </div>

                <div className="col-12">
                  <small className="text-muted">Address</small>
                  <div>{selectedCustomer.address}</div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">City</small>
                  <div>{selectedCustomer.city}</div>
                </div>

                <div className="col-md-6">
                  <small className="text-muted">Country</small>
                  <div>{selectedCustomer.country}</div>
                </div>

              </div>
            </div>

            {/* Right Section Summary */}
            <div className="col-md-4">
              <div className="bg-light rounded p-3 h-100">

                <div className="mb-3">
                  <small className="text-muted">Total Purchases</small>
                  <div className="fs-4 fw-bold">
                    {selectedCustomer.purchases}
                  </div>
                </div>
                <div>
                  <small className="text-muted">Total Spent</small>
                  <div className="fs-4 fw-bold text-success">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ViewModal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedCustomer?.name}"?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedCustomer(null);
        }}
        variant="danger"
      />
    </div>
  );
};

export default CustomerList;
