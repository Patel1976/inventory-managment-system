import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch, FiChevronDown, FiSun, FiMoon, FiLogOut, FiUser, FiSettings, FiAlertTriangle, FiCheckCircle, FiAlertCircle, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../contexts/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/useNotifications';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const { mode, toggleMode, primaryColor, setPrimaryColor } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh, isLoading } = useNotifications();
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotificationRoute = (id: string): string => {
    if (id.startsWith('stock-'))    return '/products';
    if (id.startsWith('sale-'))     return '/sales';
    if (id.startsWith('purchase-')) return '/purchases';
    if (id.startsWith('pr-'))       return '/purchases/returns';
    if (id.startsWith('sr-'))       return '/sales/returns';
    return '/';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return { cls: 'notification-icon warning', icon: <FiAlertTriangle /> };
      case 'success': return { cls: 'notification-icon success', icon: <FiCheckCircle /> };
      case 'danger':  return { cls: 'notification-icon danger',  icon: <FiAlertCircle /> };
      case 'info':    return { cls: 'notification-icon info',    icon: <FiInfo /> };
      default:        return { cls: 'notification-icon info',    icon: <FiBell /> };
    }
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <FiMenu />
        </button>
        
        <div className="search-box d-none d-md-flex" style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: '8px 15px 8px 35px',
              border: '1px solid var(--input-border)',
              borderRadius: '8px',
              width: '250px',
              fontSize: '14px',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <div className="theme-toggle-wrapper d-none d-lg-flex">
          <button 
            className={`theme-toggle-btn ${mode === 'light' ? 'active' : ''}`}
            onClick={() => mode !== 'light' && toggleMode()}
            title="Light Mode"
          >
            <FiSun />
          </button>
          <button 
            className={`theme-toggle-btn ${mode === 'dark' ? 'active' : ''}`}
            onClick={() => mode !== 'dark' && toggleMode()}
            title="Dark Mode"
          >
            <FiMoon />
          </button>
          
          {/* Color Selector */}
          <div className="color-selector">
            {(['green', 'purple', 'orange', 'blue'] as const).map(color => (
              <button
                key={color}
                className={`color-btn ${color} ${primaryColor === color ? 'active' : ''}`}
                onClick={() => setPrimaryColor(color)}
                title={`${color.charAt(0).toUpperCase() + color.slice(1)} Theme`}
              />
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="notification-dropdown" ref={notifRef}>
          <button 
            className="icon-btn header-icons"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          
          <div className={`notification-menu ${showNotifications ? 'show' : ''}`}>
            <div className="notification-header">
              <h6>Notifications</h6>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-sm btn-link text-decoration-none p-0"
                  onClick={refresh}
                  style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
                  title="Refresh"
                >
                  <FiRefreshCw style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
                </button>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-sm btn-link text-decoration-none p-0"
                    onClick={markAllAsRead}
                    style={{ fontSize: '12px', color: 'var(--primary-color)' }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            <div className="notification-list">
              {isLoading && notifications.length === 0 ? (
                <div className="text-center py-3" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-3" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No notifications</div>
              ) : (
                notifications.slice(0, 5).map(notif => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => {
                      markAsRead(notif.id);
                      setShowNotifications(false);
                      navigate(getNotificationRoute(notif.id));
                    }}
                  >
                    <div className={getNotificationIcon(notif.type).cls}>
                      {getNotificationIcon(notif.type).icon}
                    </div>
                    <div className="notification-content">
                      <p><strong>{notif.title}</strong></p>
                      <p>{notif.message}</p>
                      <small>{notif.time}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* User Dropdown */}
        <div className="user-dropdown" ref={userRef}>
          <div 
            className="d-flex align-items-center gap-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=2e3192&color=fff"} 
              alt="User"
            />
            <div className="user-info d-none d-md-block">
              <div className="user-name">{user?.name || 'Guest'}</div>
              <div className="user-role">{user?.role || 'Staff'}</div>
            </div>
            <FiChevronDown className="d-none d-md-block" />
          </div>
          
          <ul className={`dropdown-menu dropdown-menu-end ${showUserMenu ? 'show' : ''}`} style={{ display: showUserMenu ? 'block' : 'none' }}>
            <li>
              <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/profile'); setShowUserMenu(false); }}>
                <FiUser className="me-2" /> Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/settings'); setShowUserMenu(false); }}>
                <FiSettings className="me-2" /> Settings
              </a>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                <FiLogOut className="me-2" /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
