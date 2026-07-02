import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiCamera, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../components/common/Toast';
import { getProfile, updateProfile, changePassword } from '../services/userService';

const STORAGE_URL = 'http://localhost/projects/inventory-management/public/storage/';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getProfile()
      .then((res) => {
        const d = res.data.data;
        setProfile({
          name: d.name || '',
          email: d.email || '',
          phone: d.phone || '',
        });
        if (d.image) {
          setAvatarPreview(`${STORAGE_URL}${d.image}`);
        } else {
          setAvatarPreview(null);
        }
      })
      .catch(() => {
        setProfile({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', title: 'Invalid File', message: 'Please select an image file.' });
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      if (profile.phone) formData.append('phone', profile.phone);
      if (avatarFile) formData.append('image', avatarFile);

      const res = await updateProfile(Number(user.id), formData);
      const updated = res.data.data;

      const newAvatar = updated.image
        ? `${STORAGE_URL}${updated.image}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.name)}&background=dc3545&color=fff`;

      updateUser({
        name: updated.name,
        email: updated.email,
        phone: updated.phone || '',
        avatar: newAvatar,
        image: updated.image || '',
      });

      setAvatarFile(null);
      showToast({ type: 'success', title: 'Success', message: 'Profile updated successfully!' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Update failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!passwords.newPassword) errors.newPassword = 'New password is required';
    else if (passwords.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (passwords.newPassword !== passwords.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!user?.id) return;
    setIsSavingPassword(true);
    try {
      await changePassword(Number(user.id), { password: passwords.newPassword });
      showToast({ type: 'success', title: 'Success', message: 'Password changed successfully!' });
      setPasswords({ newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Password change failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="page-header">
        <h4>User Profile</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><span>User Profile</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="data-card">
            <div className="data-card-body text-center py-5">
              <div className="profile-avatar-wrapper mb-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: avatarPreview ? 'none' : 'linear-gradient(135deg, var(--primary-color) 0%, #4a4fc7 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '48px', fontWeight: '600',
                    position: 'relative', cursor: 'pointer', overflow: 'hidden', margin: '0 auto',
                  }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                  <div
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.35)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <FiCamera size={28} color="#fff" />
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '12px' }}>Click to change photo</p>
              </div>

              <h5 className="mb-1">{profile.name}</h5>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user?.role}</span>

              <div className="mt-4 text-start px-3">
                <div className="d-flex align-items-center mb-3">
                  <FiMail className="me-3" style={{ color: 'var(--primary-color)' }} />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="d-flex align-items-center mb-3">
                    <FiPhone className="me-3" style={{ color: 'var(--primary-color)' }} />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="d-flex align-items-center">
                  <FiMapPin className="me-3" style={{ color: 'var(--primary-color)' }} />
                  <span className="text-muted">—</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile + Change Password */}
        <div className="col-12 col-lg-8">
          {/* Edit Profile */}
          <div className="data-card mb-4">
            <div className="data-card-header"><h5 className="mb-0">Edit Profile</h5></div>
            <div className="data-card-body">
              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text" className="form-control"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email" className="form-control"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel" className="form-control"
                      placeholder="Enter phone number"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-control" value={user?.role || ''} disabled style={{ textTransform: 'capitalize' }} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary-custom" disabled={isSavingProfile}>
                      {isSavingProfile ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="data-card">
            <div className="data-card-header"><h5 className="mb-0">Change Password</h5></div>
            <div className="data-card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">New Password *</label>
                    <div className="input-icon-wrapper position-relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                        placeholder="Min. 6 characters"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
                        style={{ zIndex: 5 }}
                        onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                        tabIndex={-1}
                      >
                        {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                      {passwordErrors.newPassword && <div className="invalid-feedback">{passwordErrors.newPassword}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Confirm New Password *</label>
                    <div className="input-icon-wrapper position-relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="Repeat new password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
                        style={{ zIndex: 5 }}
                        onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                        tabIndex={-1}
                      >
                        {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                      {passwordErrors.confirmPassword && <div className="invalid-feedback">{passwordErrors.confirmPassword}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary-custom" disabled={isSavingPassword}>
                      {isSavingPassword ? 'Saving...' : 'Change Password'}
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
