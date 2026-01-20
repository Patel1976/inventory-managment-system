import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, FiTruck, 
  FiDollarSign, FiBarChart2, FiSettings, FiChevronDown,
  FiChevronRight, FiLayers, FiFileText, FiActivity
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: { title: string; path: string }[];
  adminOnly?: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(['Products']);
  const { isAdmin } = useAuth();

  const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <FiHome />, path: '/' },
    { 
      title: 'Products', 
      icon: <FiBox />,
      submenu: [
        { title: 'Product List', path: '/products' },
        { title: 'Add Product', path: '/products/add' },
        { title: 'Categories', path: '/products/categories' },
        { title: 'Brands', path: '/products/brands' },
      ]
    },
    { 
      title: 'Purchase', 
      icon: <FiShoppingCart />,
      submenu: [
        { title: 'Purchase List', path: '/purchases' },
        { title: 'Add Purchase', path: '/purchases/add' },
        { title: 'Purchase Returns', path: '/purchases/returns' },
      ]
    },
    { 
      title: 'Sales', 
      icon: <FiDollarSign />,
      submenu: [
        { title: 'Sales List', path: '/sales' },
        { title: 'Add Sale', path: '/sales/add' },
        { title: 'Sale Returns', path: '/sales/returns' },
      ]
    },
    { 
      title: 'People', 
      icon: <FiUsers />,
      submenu: [
        { title: 'Customers', path: '/customers' },
        { title: 'Suppliers', path: '/suppliers' },
        { title: 'Stores', path: '/stores' },
      ]
    },
    { 
      title: 'Expense', 
      icon: <FiFileText />,
      submenu: [
        { title: 'Expense List', path: '/expenses' },
        { title: 'Add Expense', path: '/expenses/add' },
        { title: 'Categories', path: '/expenses/categories' },
      ]
    },
    { 
      title: 'Stock Adjustment', 
      icon: <FiLayers />,
      submenu: [
        { title: 'Adjustment List', path: '/adjustments' },
        { title: 'Add Adjustment', path: '/adjustments/add' },
      ]
    },
    { 
      title: 'Reports', 
      icon: <FiBarChart2 />,
      submenu: [
        { title: 'Sales Report', path: '/reports/sales' },
        { title: 'Purchase Report', path: '/reports/purchase' },
        { title: 'Inventory Report', path: '/reports/inventory' },
        { title: 'Supplier Report', path: '/reports/supplier' },
        { title: 'Customer Report', path: '/reports/customer' },
      ]
    },
    { title: 'Users', icon: <FiUsers />, path: '/users', adminOnly: true },
    { title: 'Activity Log', icon: <FiActivity />, path: '/activity-log', adminOnly: true },
    { title: 'Settings', icon: <FiSettings />, path: '/settings' },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(m => m !== title)
        : [...prev, title]
    );
  };

  const isActiveLink = (path: string) => location.pathname === path;
  const isMenuOpen = (title: string) => openMenus.includes(title);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        {!isCollapsed ? (
          <h4>📦 Inventory</h4>
        ) : (
          <span style={{ fontSize: '24px' }}>📦</span>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          {filteredMenuItems.map((item) => (
            <li key={item.title} className="nav-item">
              {item.submenu ? (
                <>
                  <a
                    href="#"
                    className={`nav-link ${item.submenu.some(sub => isActiveLink(sub.path)) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(item.title);
                    }}
                  >
                    <i>{item.icon}</i>
                    {!isCollapsed && (
                      <>
                        <span className="nav-text">{item.title}</span>
                        <span style={{ marginLeft: 'auto' }}>
                          {isMenuOpen(item.title) ? <FiChevronDown /> : <FiChevronRight />}
                        </span>
                      </>
                    )}
                  </a>
                  {!isCollapsed && (
                    <ul className={`submenu ${isMenuOpen(item.title) ? 'show' : ''}`}>
                      {item.submenu.map((sub) => (
                        <li key={sub.path} className="nav-item">
                          <Link 
                            to={sub.path} 
                            className={`nav-link ${isActiveLink(sub.path) ? 'active' : ''}`}
                          >
                            <span className="nav-text">{sub.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link 
                  to={item.path!} 
                  className={`nav-link ${isActiveLink(item.path!) ? 'active' : ''}`}
                >
                  <i>{item.icon}</i>
                  {!isCollapsed && <span className="nav-text">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
