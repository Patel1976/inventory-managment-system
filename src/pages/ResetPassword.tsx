import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { validateResetToken, resetPassword } from '../services/authService';

type LinkStatus = 'validating' | 'valid' | 'invalid';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [linkStatus, setLinkStatus] = useState<LinkStatus>('validating');
  const [linkError, setLinkError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token || !email) {
      setLinkError('This reset link is missing required information.');
      setLinkStatus('invalid');
      return;
    }
    validateResetToken(email, token)
      .then(() => setLinkStatus('valid'))
      .catch((err: any) => {
        setLinkError(err?.response?.data?.message || 'This reset link is invalid or has already been used.');
        setLinkStatus('invalid');
      });
  }, []);

  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { score: 1, label: 'Weak', color: '#dc3545' };
    if (score <= 3) return { score: 2, label: 'Medium', color: '#ffc107' };
    return { score: 3, label: 'Strong', color: '#28a745' };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await resetPassword(email, token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Validating spinner ──
  if (linkStatus === 'validating') {
    return (
      <div className="login-page">
        <div className="login-card d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 220 }}>
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted">Verifying reset link...</p>
        </div>
        <div className="login-image">
          <img src="/image/login_background.svg" alt="Login Background" />
        </div>
      </div>
    );
  }

  // ── Invalid / already used link ──
  if (linkStatus === 'invalid') {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-title">
            <div style={{ fontSize: 48, textAlign: 'center', color: '#dc3545' }}>✕</div>
            <h3>Link Expired or Used</h3>
            <p>{linkError}</p>
          </div>
          <Link to="/forgot-password" className="btn btn-primary-custom d-flex align-items-center justify-content-center mt-3">
            Request a New Link
          </Link>
          <Link to="/login" className="btn d-flex align-items-center justify-content-center forgot-password-link mt-2">
            <FiArrowLeft className="me-1" /> Back to Login
          </Link>
        </div>
        <div className="login-image">
          <img src="/image/login_background.svg" alt="Login Background" />
        </div>
      </div>
    );
  }

  // ── Valid link — show form ──
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">
          <h3>Reset Password</h3>
          <p>Enter your new password below</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {success ? (
          <div className="forgot-password-success">
            <div className="success-icon">✓</div>
            <h5>Password Reset Successful!</h5>
            <p>Your password has been updated. Redirecting to login...</p>
            <Link to="/login" className="btn btn-primary-custom mt-3 d-flex align-items-center justify-content-center">
              <FiArrowLeft className="me-2" /> Go to Login
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group">
              <label>New Password</label>
              <div className="input-icon-wrapper position-relative">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
                  style={{ zIndex: 5 }} onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {password && (
                <div className="d-flex align-items-center gap-2 mt-1">
                  {[1, 2, 3].map(l => (
                    <div key={l} style={{ height: 4, flex: 1, borderRadius: 2, background: l <= strength.score ? strength.color : '#e0e0e0' }} />
                  ))}
                  <small style={{ color: strength.color, whiteSpace: 'nowrap' }}>{strength.label}</small>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrapper position-relative">
                <FiLock className="input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
                  style={{ zIndex: 5 }} onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {confirmPassword && (
                <small style={{ color: password === confirmPassword ? '#28a745' : '#dc3545' }}>
                  {password === confirmPassword
                    ? <>Passwords match</>
                    : 'Passwords do not match'}
                </small>
              )}
            </div>

            <button type="submit" className="btn btn-login-custom" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Resetting...</>
                : <>Reset Password</>}
            </button>

            <div className="mt-3">
              <Link to="/login" className="d-flex align-items-center forgot-password-link">
                <FiArrowLeft className="me-1" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
      <div className="login-image">
        <img src="/image/login_background.svg" alt="Login Background" />
      </div>
    </div>
  );
};

export default ResetPassword;
