import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send reset email. Please check SMTP settings.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">
          <h3>Forgot Password?</h3>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {success ? (
          <div className="forgot-password-success">
            <div className="success-icon">✓</div>
            <h5>Check Your Email</h5>
            <p>A password reset link has been sent to <strong>{email}</strong>. Click the link in the email to reset your password.</p>
            <Link
              to="/reset-password"
              state={{ email }}
              className="btn btn-primary-custom mt-3 d-flex align-items-center justify-content-center"
            >
              Go to Reset Password
            </Link>
            <Link to="/login" className="btn d-flex align-items-center justify-content-center forgot-password-link mt-2">
              <FiArrowLeft className="me-2" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-login-custom" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="mt-3">
              <Link to="/login" className="d-flex align-items-center forgot-password-link">
                <FiArrowLeft className="me-1" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
      <div className="login-image">
        <img src="public/image/login_background.svg" alt="Login Background" />
      </div>
    </div>
  );
};

export default ForgotPassword;
