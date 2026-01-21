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
        <div className="login-logo">
          <span>📦</span>
          <h2>Inventory</h2>
        </div>
        
        <div className="login-title">
          <h4>Forgot Password?</h4>
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
            <Link to="/login" className="btn btn-primary-custom mt-3">
              <FiArrowLeft className="me-2" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label><FiMail className="me-2" />Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary-custom"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="me-2" />
                  Send Reset Link
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

        <div className="mt-4 text-center" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <p className="mb-0"><strong>Demo Emails:</strong></p>
          <p className="mb-0">admin@inventory.com, staff@inventory.com</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
