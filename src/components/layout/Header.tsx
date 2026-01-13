import { FiMenu, FiBell, FiMail, FiSearch, FiChevronDown } from 'react-icons/fi';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <FiMenu />
        </button>
        
        <div className="search-box d-none d-md-flex" style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: '8px 15px 8px 35px',
              border: '1px solid #eee',
              borderRadius: '8px',
              width: '250px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-icons d-flex gap-2">
          <button className="icon-btn">
            <FiBell />
            <span className="badge">3</span>
          </button>
          <button className="icon-btn">
            <FiMail />
            <span className="badge">5</span>
          </button>
        </div>

        <div className="user-dropdown dropdown">
          <div className="d-flex align-items-center gap-2" data-bs-toggle="dropdown">
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=2e3192&color=fff" 
              alt="User"
            />
            <div className="user-info d-none d-md-block">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
            <FiChevronDown className="d-none d-md-block" />
          </div>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Logout</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
