import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiBox, FiShoppingCart, FiUsers,
  FiDollarSign, FiBarChart2, FiSettings, FiChevronDown,
  FiChevronRight, FiLayers, FiFileText, FiActivity
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { Permission } from '../../config/permissions';

interface SidebarProps {
  isCollapsed: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: { title: string; path: string; permission?: Permission }[];
  adminOnly?: boolean;
  permission?: Permission;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { isAdmin, hasPermission } = useAuth();

  const menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: <FiHome />, path: '/', permission: 'dashboard.view' },
    { 
      title: 'Products', 
      icon: <FiBox />,
      permission: 'products.view',
      submenu: [
        { title: 'Product List', path: '/products', permission: 'products.view' },
        { title: 'Add Product', path: '/products/add', permission: 'products.create' },
        { title: 'Categories', path: '/products/categories', permission: 'categories.manage' },
        { title: 'Brands', path: '/products/brands', permission: 'brands.manage' },
      ]
    },
    {
      title: 'Purchase',
      icon: <FiShoppingCart />,
      permission: 'purchases.view',
      submenu: [
        { title: 'Purchase List', path: '/purchases', permission: 'purchases.view' },
        { title: 'Add Purchase', path: '/purchases/add', permission: 'purchases.create' },
        { title: 'Purchase Returns', path: '/purchases/returns', permission: 'purchases.view' },
      ]
    },
    {
      title: 'Sales',
      icon: <FiDollarSign />,
      permission: 'sales.view',
      submenu: [
        { title: 'Sales List', path: '/sales', permission: 'sales.view' },
        { title: 'Add Sale', path: '/sales/add', permission: 'sales.create' },
        { title: 'Sale Returns', path: '/sales/returns', permission: 'sales.view' },
      ]
    },
    {
      title: 'People',
      icon: <FiUsers />,
      permission: 'customers.view',
      submenu: [
        { title: 'Customers', path: '/customers', permission: 'customers.view' },
        { title: 'Suppliers', path: '/suppliers', permission: 'suppliers.view' },
        { title: 'Stores', path: '/stores', permission: 'stores.view' },
      ]
    },
    {
      title: 'Expense',
      icon: <FiFileText />,
      permission: 'expenses.view',
      submenu: [
        { title: 'Expense List', path: '/expenses', permission: 'expenses.view' },
        { title: 'Add Expense', path: '/expenses/add', permission: 'expenses.create' },
        { title: 'Categories', path: '/expenses/categories', permission: 'expenses.manage' },
      ]
    },
    {
      title: 'Stock Adjustment',
      icon: <FiLayers />,
      permission: 'adjustments.view',
      submenu: [
        { title: 'Adjustment List', path: '/adjustments', permission: 'adjustments.view' },
        { title: 'Add Adjustment', path: '/adjustments/add', permission: 'adjustments.create' },
      ]
    },
    {
      title: 'Reports',
      icon: <FiBarChart2 />,
      permission: 'reports.view',
      submenu: [
        { title: 'Sales Report', path: '/reports/sales', permission: 'reports.view' },
        { title: 'Purchase Report', path: '/reports/purchase', permission: 'reports.view' },
        { title: 'Inventory Report', path: '/reports/inventory', permission: 'reports.view' },
        { title: 'Supplier Report', path: '/reports/supplier', permission: 'reports.view' },
        { title: 'Customer Report', path: '/reports/customer', permission: 'reports.view' },
      ]
    },
    { title: 'Users', icon: <FiUsers />, path: '/users', permission: 'users.view' },
    { title: 'Activity Log', icon: <FiActivity />, path: '/activity-log', permission: 'activity.view' },
    { title: 'Settings', icon: <FiSettings />, path: '/settings', permission: 'settings.view' },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => {
    // Check main permission
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
  }).map(item => {
    // Filter submenu items based on permissions
    if (item.submenu) {
      return {
        ...item,
        submenu: item.submenu.filter(sub => !sub.permission || hasPermission(sub.permission))
      };
    }
    return item;
  }).filter(item => {
    // Remove parent items with empty submenus
    if (item.submenu && item.submenu.length === 0) return false;
    return true;
  });

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
          <img src="inventory-logo.png" alt="Logo" />
        ) : (
          <img src="favicon.png" alt="Logo" />
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
                            className={`${isActiveLink(sub.path) ? 'active' : ''}`}
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
