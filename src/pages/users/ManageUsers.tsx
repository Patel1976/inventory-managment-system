import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserRole, rolePermissions, roleDescriptions, roleBadgeColors,
  permissionCategories, permissionDescriptions, Permission
} from '../../config/permissions';
import FormModal from '@/components/common/FormModal';
import ViewModal from '@/components/common/ViewModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import * as userService from '../../services/userService';

interface User {
  id: number; name: string; username: string; email: string;
  role: string; status: 'Active' | 'Inactive'; created_at?: string;
}

// Map backend role → frontend UserRole
const toFrontendRole = (role: string): UserRole => {
  if (role === 'admin' || role === 'super-admin') return 'Admin';
  if (role === 'manager') return 'Manager';
  return 'Staff';
};

// Map frontend UserRole → backend role
const toBackendRole = (role: UserRole): string => {
  if (role === 'Admin') return 'admin';
  if (role === 'Manager') return 'manager';
  return 'staff';
};

const ManageUsers = () => {
  const { hasPermission } = useAuth();
  const canManageUsers = hasPermission('users.manage');
  const { showToast } = useToast();

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
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    name: '', username: '', email: '', role: 'Staff' as UserRole,
    password: '', confirmPassword: '', status: 'Active' as 'Active' | 'Inactive'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editableRolePermissions, setEditableRolePermissions] = useState(rolePermissions);

  useEffect(() => {
    userService.getUsers().then(r => setUsers(r.data.data)).catch(() => {});
  }, []);

  const filteredUsers = users.filter(user => {
    const frontendRole = toFrontendRole(user.role);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || frontendRole === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, username: user.username, email: user.email, role: toFrontendRole(user.role), password: '', confirmPassword: '', status: user.status });
    } else {
      setEditingUser(null);
      setFormData({ name: '', username: '', email: '', role: 'Staff', password: '', confirmPassword: '', status: 'Active' });
    }
    setFormErrors({});
    setShowModal(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const payload: any = {
      name: formData.name, username: formData.username,
      email: formData.email, role: toBackendRole(formData.role),
      status: formData.status,
    };
    if (formData.password) payload.password = formData.password;
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, payload);
        showToast({ type: 'success', title: 'Updated', message: 'User updated successfully!' });
      } else {
        await userService.createUser(payload);
        showToast({ type: 'success', title: 'Added', message: 'User added successfully!' });
      }
      const res = await userService.getUsers();
      setUsers(res.data.data);
      setShowModal(false);
      setEditingUser(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => { setSelectedUser(user); setShowDeleteDialog(true); };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      await userService.deleteUser(selectedUser.id);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      showToast({ type: 'success', title: 'Deleted', message: 'User deleted successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Delete failed!' });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handlePermissionToggle = (role: UserRole, permission: Permission) => {
    setEditableRolePermissions(prev => ({
      ...prev,
      [role]: prev[role].includes(permission) ? prev[role].filter(p => p !== permission) : [...prev[role], permission]
    }));
  };

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <h4>Users</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Users</span></div>
      </div>
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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

      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th><th>Action</th></tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => {
                  const frontendRole = toFrontendRole(user.role);
                  return (
                    <tr key={user.id}>
                      <td>{startIndex + index + 1}</td>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.username}</td>
                      <td><div className="d-flex align-items-center"><FiMail size={14} className="me-1 text-muted" />{user.email}</div></td>
                      <td>
                        <span className={`badge ${roleBadgeColors[frontendRole]}`} style={{ cursor: 'pointer' }} onClick={() => { setViewingRole(frontendRole); setShowPermissionsModal(true); }} title="Click to view permissions">
                          {frontendRole}
                        </span>
                      </td>
                      <td><span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{user.status}</span></td>
                      <td>{user.created_at?.split('T')[0] || '-'}</td>
                      <td>
                        <button className="btn-action view me-1" onClick={() => { setViewingUser(user); setShowViewModal(true); }}><FiEye /></button>
                        <button className="btn-action permissions me-1" onClick={() => { setViewingRole(frontendRole); setShowPermissionsModal(true); }}><FiLock /></button>
                        {canManageUsers && (
                          <>
                            <button className="btn-action edit me-1" onClick={() => handleOpenModal(user)}><FiEdit /></button>
                            <button className="btn-action delete" onClick={() => handleDeleteClick(user)}><FiTrash2 /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {paginatedUsers.length === 0 && <tr><td colSpan={8} className="text-center py-4">No users found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries</div>
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

      {/* Add/Edit Modal */}
      <FormModal isOpen={showModal} title={editingUser ? 'Edit User' : 'Add New User'} onClose={() => { setShowModal(false); setEditingUser(null); setFormErrors({}); }} onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name *</label>
            <input type="text" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Username *</label>
            <input type="text" className={`form-control ${formErrors.username ? 'is-invalid' : ''}`} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Role *</label>
            <select className="form-select" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Password {!editingUser && '*'}</label>
            <input type="password" className={`form-control ${formErrors.password ? 'is-invalid' : ''}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input type="password" className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
            {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Status *</label>
            <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* View User Modal */}
      <ViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="User Details" size="md">
        {viewingUser && (
          <div className="row g-3">
            <div className="col-12 text-center mb-3">
              <div className="fw-bold fs-5">{viewingUser.name}</div>
              <span className={`badge ${roleBadgeColors[toFrontendRole(viewingUser.role)]}`}>{toFrontendRole(viewingUser.role)}</span>
            </div>
            <div className="col-md-6"><small className="text-muted">Username</small><div className="fw-semibold">{viewingUser.username}</div></div>
            <div className="col-md-6"><small className="text-muted">Email</small><div>{viewingUser.email}</div></div>
            <div className="col-md-6"><small className="text-muted">Status</small><div><span className={`badge ${viewingUser.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{viewingUser.status}</span></div></div>
            <div className="col-md-6"><small className="text-muted">Created</small><div>{viewingUser.created_at?.split('T')[0] || '-'}</div></div>
          </div>
        )}
      </ViewModal>

      {/* Permissions Modal */}
      <ViewModal isOpen={showPermissionsModal} onClose={() => setShowPermissionsModal(false)} title={`${viewingRole} Role Permissions`} size="lg">
        {viewingRole && (
          <>
            <p className="text-muted mb-3">{roleDescriptions[viewingRole]}</p>
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category} className="mb-4">
                <h6 className="border-bottom pb-2">{category}</h6>
                <div className="row g-2">
                  {permissions.map((perm) => (
                    <div key={perm} className="col-md-6">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" checked={editableRolePermissions[viewingRole].includes(perm as Permission)} onChange={() => handlePermissionToggle(viewingRole, perm as Permission)} />
                        <label className="form-check-label">{permissionDescriptions[perm as Permission]}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-end mt-3">
              <button className="btn btn-primary" onClick={() => { setShowPermissionsModal(false); showToast({ type: 'success', title: 'Saved', message: 'Permissions updated!' }); }}>Save Changes</button>
            </div>
          </>
        )}
      </ViewModal>

      <ConfirmDialog isOpen={showDeleteDialog} title="Delete User" message={`Are you sure you want to delete "${selectedUser?.name}"?`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => { setShowDeleteDialog(false); setSelectedUser(null); }} isLoading={isLoading} variant="danger" />
    </div>
  );
};

export default ManageUsers;
