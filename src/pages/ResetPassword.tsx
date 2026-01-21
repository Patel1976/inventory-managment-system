import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiCheck, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Mock token validation
    if (!token || token.length < 10) {
      setTokenValid(false);
    }
  }, [token]);

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#dc3545' };
    if (score <= 4) return { score: 2, label: 'Medium', color: '#ffc107' };
    return { score: 3, label: 'Strong', color: '#28a745' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 2) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccess(true);
    setLoading(false);
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  if (!tokenValid) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <span>📦</span>
            <h2>Inventory</h2>
          </div>
          
          <div className="forgot-password-success" style={{ textAlign: 'center' }}>
            <div className="error-icon" style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: '#dc354520',
              color: '#dc3545',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>✕</div>
            <h5>Invalid or Expired Link</h5>
            <p className="text-muted">This password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="btn btn-primary-custom mt-3">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span>📦</span>
          <h2>Inventory</h2>
        </div>
        
        <div className="login-title">
          <h4>Reset Password</h4>
          <p>Create a new password for your account</p>
        </div>

        {error && <div className="login-error">{error}</div>}
        
        {success ? (
          <div className="forgot-password-success">
            <div className="success-icon">✓</div>
            <h5>Password Reset Successful!</h5>
            <p>Your password has been updated successfully.</p>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Redirecting to login page...
            </p>
            <Link to="/login" className="btn btn-primary-custom mt-3">
              <FiArrowLeft className="me-2" />
              Go to Login
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label><FiLock className="me-2" />New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              
              {password && (
                <div className="password-strength mt-2">
                  <div className="strength-bars">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="strength-bar"
                        style={{
                          backgroundColor: level <= passwordStrength.score 
                            ? passwordStrength.color 
                            : '#e0e0e0'
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              
              <div className="password-requirements mt-2">
                <small className="text-muted">
                  Password must contain:
                  <ul className="mb-0 ps-3">
                    <li className={password.length >= 8 ? 'text-success' : ''}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? 'text-success' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-success' : ''}>
                      One number
                    </li>
                  </ul>
                </small>
              </div>
            </div>

            <div className="form-group">
              <label><FiLock className="me-2" />Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <small className="text-danger">Passwords do not match</small>
              )}
              {confirmPassword && password === confirmPassword && (
                <small className="text-success">
                  <FiCheck className="me-1" />Passwords match
                </small>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary-custom"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Resetting...
                </>
              ) : (
                <>
                  <FiCheck className="me-2" />
                  Reset Password
                </>
              )}
            </button>

            <div className="text-center mt-3">
              <Link to="/login" className="forgot-password-link">
                <FiArrowLeft className="me-1" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
