import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiSend, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock registered emails for demo
  const registeredEmails = ['admin@inventory.com', 'staff@inventory.com'];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email is registered (mock validation)
    const isRegistered = registeredEmails.some(
      e => e.toLowerCase() === email.toLowerCase()
    );

    if (isRegistered) {
      setSuccess(true);
    } else {
      setError('This email is not registered in our system');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">
          <h3>Forgot Password?</h3>
          <p>Enter your email to receive a reset link</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {success ? (
          <div className="forgot-password-success">
            <div className="success-icon">✓</div>
            <h5>Check Your Email</h5>
            <p>Password reset link sent to your email</p>
            <p className="text-muted" style={{ fontSize: '13px' }}>
              Please check your inbox and spam folder
            </p>
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

            <button
              type="submit"
              className="btn btn-login-custom"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                </>
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

        <div className="mt-4" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          <p className="mb-0"><strong>Demo Emails:</strong></p>
          <p className="mb-0"><span className="fw-bold me-1" style={{ fontSize: '14px' }}>Admin :</span> admin@inventory.com</p>
          <p className="mb-0"><span className="fw-bold me-1" style={{ fontSize: '14px' }}>Staff :</span> staff@inventory.com</p>
        </div>
      </div>
      <div className="login-image">
        <img src="public/image/login_background.svg" alt="Login Background" />
      </div>
    </div>
  );
};

export default ForgotPassword;
