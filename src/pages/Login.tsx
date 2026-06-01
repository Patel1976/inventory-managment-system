import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
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
      const success = await login(identifier, password);
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
            <label>Email or Username</label>
            <div className="input-icon-wrapper">
              <FiMail className="input-icon" />
              <input
                type="text"
                className="form-control with-icon"
                placeholder="Enter your email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
      </div>
      <div className="login-image">
        <img src="public/image/login_background.svg" alt="Login Background" />
      </div>
    </div>
  );
};

export default Login;
