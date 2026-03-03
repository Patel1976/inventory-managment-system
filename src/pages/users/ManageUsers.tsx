import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMail, FiX, FiCheck, FiShield, FiLock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserRole,
  rolePermissions,
  roleDescriptions,
  roleBadgeColors,
  permissionCategories,
  permissionDescriptions,
  Permission
} from '../../config/permissions';
import FormModal from '@/components/common/FormModal';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

const ManageUsers = () => {
  const { hasPermission } = useAuth();
  const canManageUsers = hasPermission('users.manage');

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingRole, setViewingRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'Staff' as UserRole,
    password: '',
    confirmPassword: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock users data
  const [users, setUsers] = useState<User[]>([
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

  const handleViewPermissions = (role: UserRole) => {
    setViewingRole(role);
    setShowPermissionsModal(true);
  };

  const [editableRolePermissions, setEditableRolePermissions] = useState(rolePermissions);

  const handlePermissionToggle = (role: UserRole, permission: Permission) => {
    setEditableRolePermissions(prev => {
      const currentPermissions = prev[role];

      const updatedPermissions = currentPermissions.includes(permission)
        ? currentPermissions.filter(p => p !== permission)
        : [...currentPermissions, permission];

      return {
        ...prev,
        [role]: updatedPermissions
      };
    });
  };

  const handleSavePermissions = () => {
    console.log("Updated Role Permissions:", editableRolePermissions);
    setShowPermissionsModal(false);
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
      console.log('Saving user:', formData);
      handleCloseModal();
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDeleteDialog(false);
      showToast({ type: 'success', title: 'Deleted', message: 'User deleted successfully!' });
      setSelectedUser(prev => {
        if (prev) {
          setUsers(users.filter(u => u.id !== prev.id));
        }
        return null;
      });
    }, 500);
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
            <div className="col-12 col-md-3">
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
            <div className="col-12 col-md-3">
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
            <div className="col-12 col-md-3 text-end d-flex justify-content-end">
              {canManageUsers && (
                <button className="btn btn-primary-custom d-flex align-items-center" onClick={() => handleOpenModal()}>
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
                      <span
                        className={`badge ${roleBadgeColors[user.role]} cursor-pointer`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => { setViewingRole(user.role); setShowPermissionsModal(true); }}
                        title="Click to view permissions"
                      >
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
                      <button
                        className="btn-action permissions me-1"
                        onClick={() => handleViewPermissions(user.role)}
                      >
                        <FiLock />
                      </button>
                      {canManageUsers && (
                        <>
                          <button className="btn-action edit me-1" onClick={() => handleOpenModal(user)}>
                            <FiEdit />
                          </button>
                          <button className="btn-action delete" onClick={() => handleDeleteClick(user)}>
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
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
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

      {/* Add/Edit User Modal */}
      <FormModal
        isOpen={showModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Username *</label>
            <input
              type="text"
              className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Role *</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as UserRole })
              }
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Password {!editingUser && '*'}
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status *</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>
      </FormModal>

      {/* View User Modal */}
      <ViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="User Details"
        size="md"
      >
        {viewingUser && (
          <div className="row g-3">

            <div className="col-12 text-center mb-3">
              <div className="fw-bold fs-5">{viewingUser.name}</div>
              <span className={`badge ${roleBadgeColors[viewingUser.role]}`}>
                {viewingUser.role}
              </span>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Username</small>
              <div className="fw-semibold">{viewingUser.username}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Email</small>
              <div>{viewingUser.email}</div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Status</small>
              <div>
                <span className={`badge ${viewingUser.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                  {viewingUser.status}
                </span>
              </div>
            </div>

            <div className="col-md-6">
              <small className="text-muted">Created Date</small>
              <div>{formatDate(viewingUser.createdDate)}</div>
            </div>

          </div>
        )}
      </ViewModal>

      {/* Permissions Modal */}
      <ViewModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title={`${viewingRole} Role Permissions`}
        size="lg"
      >
        {viewingRole && (
          <>
            <p className="text-muted mb-3">
              {roleDescriptions[viewingRole]}
            </p>

            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category} className="mb-4">
                <h6 className="border-bottom pb-2">{category}</h6>

                <div className="row g-2">
                  {permissions.map((perm) => {
                    const hasAccess =
                      editableRolePermissions[viewingRole].includes(perm as Permission);

                    return (
                      <div key={perm} className="col-md-6">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={hasAccess}
                            onChange={() =>
                              handlePermissionToggle(viewingRole, perm as Permission)
                            }
                          />
                          <label className="form-check-label">
                            {permissionDescriptions[perm as Permission]}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="text-end mt-3">
              <button
                className="btn btn-primary"
                onClick={handleSavePermissions}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </ViewModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedUser(null);
        }}
        isLoading={isLoading}
        variant="danger"
      />
    </div>
  );
};

export default ManageUsers;
