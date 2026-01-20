import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - would integrate with backend
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Mock save - would integrate with backend
    alert('Password changed successfully!');
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
                  className="profile-avatar mx-auto"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #4a4fc7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: '600',
                    position: 'relative'
                  }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                  <button 
                    className="btn btn-sm btn-primary-custom"
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiCamera size={16} />
                  </button>
                </div>
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
              <h5 className="mb-0"><FiUser className="me-2" /> Edit Profile</h5>
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
                      <FiSave className="me-2" /> Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="data-card">
            <div className="data-card-header">
              <h5 className="mb-0"><FiLock className="me-2" /> Change Password</h5>
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
                      <FiLock className="me-2" /> Change Password
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
