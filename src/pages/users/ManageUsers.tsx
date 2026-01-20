import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMail, FiX, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'Active' | 'Inactive';
  createdDate: string;
}

const ManageUsers = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'Staff' as 'Admin' | 'Manager' | 'Staff',
    password: '',
    confirmPassword: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock users data
  const [users] = useState<User[]>([
    { id: 1, name: 'John Admin', username: 'johnadmin', email: 'john.admin@example.com', role: 'Admin', status: 'Active', createdDate: '2024-01-15' },
    { id: 2, name: 'Sarah Manager', username: 'sarahm', email: 'sarah.m@example.com', role: 'Manager', status: 'Active', createdDate: '2024-02-10' },
    { id: 3, name: 'Mike Staff', username: 'mikestaff', email: 'mike.staff@example.com', role: 'Staff', status: 'Active', createdDate: '2024-02-20' },
    { id: 4, name: 'Emily Chen', username: 'emilyc', email: 'emily.chen@example.com', role: 'Staff', status: 'Inactive', createdDate: '2024-03-01' },
    { id: 5, name: 'David Wilson', username: 'davidw', email: 'david.w@example.com', role: 'Manager', status: 'Active', createdDate: '2024-03-05' },
    { id: 6, name: 'Lisa Brown', username: 'lisab', email: 'lisa.brown@example.com', role: 'Staff', status: 'Active', createdDate: '2024-03-10' },
    { id: 7, name: 'Robert Taylor', username: 'robertt', email: 'robert.t@example.com', role: 'Staff', status: 'Inactive', createdDate: '2024-03-15' },
    { id: 8, name: 'Jennifer Lopez', username: 'jenniferl', email: 'jennifer.l@example.com', role: 'Admin', status: 'Active', createdDate: '2024-03-20' },
    { id: 9, name: 'James Anderson', username: 'jamesa', email: 'james.a@example.com', role: 'Manager', status: 'Active', createdDate: '2024-03-25' },
    { id: 10, name: 'Patricia White', username: 'patriciaw', email: 'patricia.w@example.com', role: 'Staff', status: 'Active', createdDate: '2024-04-01' },
    { id: 11, name: 'Michael Johnson', username: 'michaelj', email: 'michael.j@example.com', role: 'Staff', status: 'Inactive', createdDate: '2024-04-05' },
    { id: 12, name: 'Linda Davis', username: 'lindad', email: 'linda.d@example.com', role: 'Staff', status: 'Active', createdDate: '2024-04-10' },
  ]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        password: '',
        confirmPassword: '',
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        username: '',
        email: '',
        role: 'Staff',
        password: '',
        confirmPassword: '',
        status: 'Active'
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!editingUser) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    } else if (formData.password) {
      if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Mock save - in real app would call API
      console.log('Saving user:', formData);
      handleCloseModal();
    }
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', userId);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="manage-users-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Users</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Users</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select 
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12 col-md-5 text-end">
              {isAdmin && (
                <button className="btn btn-primary-custom" onClick={() => handleOpenModal()}>
                  <FiPlus className="me-1" /> Add User
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{startIndex + index + 1}</td>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.username}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FiMail size={14} className="me-1 text-muted" />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.role === 'Admin' ? 'bg-danger' : 
                        user.role === 'Manager' ? 'bg-warning text-dark' : 
                        'bg-info'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{formatDate(user.createdDate)}</td>
                    <td>
                      <button className="btn-action view me-1" onClick={() => handleViewUser(user)}>
                        <FiEye />
                      </button>
                      {isAdmin && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => handleOpenModal(user)}>
                            <FiEdit />
                          </button>
                          <button className="btn-action delete" onClick={() => handleDelete(user.id)}>
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                      {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Username <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Enter username"
                      />
                      {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Manager' | 'Staff' })}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Password {!editingUser && <span className="text-danger">*</span>}
                        {editingUser && <small className="text-muted">(leave blank to keep current)</small>}
                      </label>
                      <input
                        type="password"
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                      />
                      {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Confirm Password {!editingUser && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="password"
                        className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                      />
                      {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    <FiX className="me-1" /> Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FiCheck className="me-1" /> {editingUser ? 'Update' : 'Save'} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && viewingUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div className="avatar-lg mx-auto mb-3" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: viewingUser.role === 'Admin' ? '#dc3545' : viewingUser.role === 'Manager' ? '#ffc107' : '#0dcaf0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: viewingUser.role === 'Manager' ? '#000' : '#fff',
                    fontWeight: 'bold'
                  }}>
                    {viewingUser.name.charAt(0).toUpperCase()}
                  </div>
                  <h5 className="mb-1">{viewingUser.name}</h5>
                  <span className={`badge ${
                    viewingUser.role === 'Admin' ? 'bg-danger' : 
                    viewingUser.role === 'Manager' ? 'bg-warning text-dark' : 
                    'bg-info'
                  }`}>
                    {viewingUser.role}
                  </span>
                </div>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: '40%' }}>Username</td>
                      <td><strong>{viewingUser.username}</strong></td>
                    </tr>
                    <tr>
                      <td className="text-muted">Email</td>
                      <td><strong>{viewingUser.email}</strong></td>
                    </tr>
                    <tr>
                      <td className="text-muted">Status</td>
                      <td>
                        <span className={`badge ${viewingUser.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {viewingUser.status}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Created Date</td>
                      <td><strong>{formatDate(viewingUser.createdDate)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
