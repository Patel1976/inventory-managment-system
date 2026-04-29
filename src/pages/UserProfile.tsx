import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common/Toast';

const UserProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: user?.name || 'John Admin',
    email: user?.email || 'admin@inventory.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100, New York, NY 10001',
    role: user?.role || 'admin'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', title: 'Invalid File', message: 'Please select an image file.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - would integrate with backend
    showToast({ type: 'success', title: 'Success', message: 'Profile updated successfully!' });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast({ type: 'error', title: 'Error', message: 'New passwords do not match!' });
      return;
    }
    // Mock save - would integrate with backend
    showToast({ type: 'success', title: 'Success', message: 'Password changed successfully!' });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="user-profile-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>User Profile</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>User Profile</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="data-card">
            <div className="data-card-body text-center py-5">
              <div className="profile-avatar-wrapper mb-4">
                <div
                  onClick={handleAvatarClick}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: avatarPreview ? 'none' : 'linear-gradient(135deg, var(--primary-color) 0%, #4a4fc7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: '600',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    margin: '0 auto'
                  }}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s'
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                  >
                    <FiCamera size={28} color="#fff" />
                  </div>
                  {/* Camera badge */}
                  {/* <div style={{
                    position: 'absolute', bottom: 4, right: 4,
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--card-bg)', pointerEvents: 'none'
                  }}>
                    <FiCamera size={14} color="#fff" />
                  </div> */}
                </div>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '12px' }}>Click to change photo</p>
              </div>
              <h5 className="mb-1">{profile.name}</h5>
              <span 
                className="badge badge-primary"
                style={{ textTransform: 'capitalize' }}
              >
                {profile.role}
              </span>
              <div className="mt-4 text-start px-3">
                <div className="d-flex align-items-center mb-3">
                  <FiMail className="me-3" style={{ color: 'var(--primary-color)' }} />
                  <span>{profile.email}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FiPhone className="me-3" style={{ color: 'var(--primary-color)' }} />
                  <span>{profile.phone}</span>
                </div>
                <div className="d-flex align-items-start">
                  <FiMapPin className="me-3 mt-1" style={{ color: 'var(--primary-color)' }} />
                  <span>{profile.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile & Change Password */}
        <div className="col-12 col-lg-8">
          {/* Edit Profile Form */}
          <div className="data-card mb-4">
            <div className="data-card-header">
              <h5 className="mb-0">Edit Profile</h5>
            </div>
            <div className="data-card-body">
              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Role</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={profile.role}
                      disabled
                      style={{ textTransform: 'capitalize' }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <textarea 
                      className="form-control" 
                      name="address"
                      rows={2}
                      value={profile.address}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary-custom">
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="data-card">
            <div className="data-card-header">
              <h5 className="mb-0">Change Password</h5>
            </div>
            <div className="data-card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label">Current Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">New Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Confirm New Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary-custom">
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
