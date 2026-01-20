import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiBox, FiShoppingCart, FiUsers,
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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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
      ]
    },
    {
      title: 'Sales',
      icon: <FiDollarSign />,
      submenu: [
        { title: 'Sales List', path: '/sales' },
        { title: 'Add Sale', path: '/sales/add' },
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
    { title: 'Activity Log', icon: <FiActivity />, path: '/activity-log', adminOnly: true },
    { title: 'Settings', icon: <FiSettings />, path: '/settings' },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const toggleMenu = (title: string) => {
    setOpenMenu(prev => (prev === title ? null : title));
  };

  const isActiveLink = (path: string) => location.pathname === path;
  const isMenuOpen = (title: string) => openMenu === title;

  useEffect(() => {
    if (location.pathname === '/') {
      setOpenMenu(null);
      return;
    }
    const activeMenu = menuItems.find(item =>
      item.submenu?.some(sub => location.pathname.startsWith(sub.path))
    );
    if (activeMenu) {
      setOpenMenu(activeMenu.title);
    } else {
      setOpenMenu(null);
    }
  }, [location.pathname]);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        {!isCollapsed ? (
          <img src="public/image/inventory-logo.png" alt="Logo" />
        ) : (
          <img src="public/image/favicon.png" alt="Logo" />
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
