import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">
          <h3>Sign In</h3>
          <p>Please login to your account</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                className="form-control with-icon"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrapper">
              <FiLock className="input-icon" />

              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control with-icon with-toggle"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁'}
              </span>
            </div>
            <div className="mt-2">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-login-custom"
            disabled={loading}
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-4" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          <p className="mb-1"><strong>Demo Accounts:</strong></p>
          <p className="mb-0"><span className="fw-bold me-1" style={{ fontSize: '14px' }}>Admin :</span> admin@inventory.com / admin123</p>
          <p className="mb-0"><span className="fw-bold me-1" style={{ fontSize: '14px' }}>Manager :</span> manager@inventory.com / manager123</p>
          <p className="mb-0"><span className="fw-bold me-1" style={{ fontSize: '14px' }}>Staff :</span> staff@inventory.com / staff123</p>
        </div>
      </div>
      <div className="login-image">
        <img src="public/image/login_background.svg" alt="Login Background" />
      </div>
    </div>
  );
};

export default Login;
