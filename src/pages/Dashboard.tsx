import { Link } from 'react-router-dom';
import { 
  FiBox, FiShoppingCart, FiDollarSign, FiUsers, 
  FiTrendingUp, FiTrendingDown, FiAlertTriangle,
  FiPlus, FiEye, FiEdit, FiTrash2, FiPercent
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { currencySymbol, stockAlertThreshold } = useSettings();

  // Mock data for dashboard with extended stats
  const stats = [
    { title: 'Total Products', value: '248', icon: <FiBox />, color: 'bg-primary', trend: '+12%', trendUp: true },
    { title: 'Total Purchase', value: `${currencySymbol}45,230`, icon: <FiShoppingCart />, color: 'bg-success', trend: '+8%', trendUp: true },
    { title: 'Total Sales', value: `${currencySymbol}67,890`, icon: <FiDollarSign />, color: 'bg-info', trend: '+15%', trendUp: true },
    { title: 'Total Customers', value: '156', icon: <FiUsers />, color: 'bg-warning', trend: '+5%', trendUp: true },
  ];

  // Additional advanced widgets
  const advancedStats = [
    { title: 'Net Profit', value: `${currencySymbol}22,660`, icon: <FiTrendingUp />, color: 'bg-success', subtitle: 'This Month' },
    { title: 'Gross Loss', value: `${currencySymbol}3,450`, icon: <FiTrendingDown />, color: 'bg-danger', subtitle: 'This Month' },
    { title: 'Tax Collected', value: `${currencySymbol}6,789`, icon: <FiPercent />, color: 'bg-info', subtitle: 'This Month' },
  ];

  const recentSales = [
    { id: 'INV-001', customer: 'John Doe', date: '2024-01-15', amount: 250.00, status: 'Completed' },
    { id: 'INV-002', customer: 'Jane Smith', date: '2024-01-14', amount: 180.00, status: 'Pending' },
    { id: 'INV-003', customer: 'Bob Wilson', date: '2024-01-14', amount: 320.00, status: 'Completed' },
    { id: 'INV-004', customer: 'Alice Brown', date: '2024-01-13', amount: 150.00, status: 'Completed' },
    { id: 'INV-005', customer: 'Charlie Davis', date: '2024-01-13', amount: 450.00, status: 'Pending' },
  ];

  const topProducts = [
    { name: 'iPhone 14 Pro', category: 'Electronics', sold: 45, revenue: 44955, image: 'https://via.placeholder.com/40' },
    { name: 'Samsung Galaxy S23', category: 'Electronics', sold: 38, revenue: 34162, image: 'https://via.placeholder.com/40' },
    { name: 'MacBook Pro M2', category: 'Laptops', sold: 32, revenue: 63968, image: 'https://via.placeholder.com/40' },
    { name: 'Sony Headphones', category: 'Audio', sold: 28, revenue: 9772, image: 'https://via.placeholder.com/40' },
    { name: 'Apple Watch Series 8', category: 'Wearables', sold: 25, revenue: 9975, image: 'https://via.placeholder.com/40' },
  ];

  const lowStockProducts = [
    { name: 'Dell Monitor 27"', category: 'Electronics', stock: 5, minStock: stockAlertThreshold },
    { name: 'Logitech Mouse', category: 'Accessories', stock: 8, minStock: stockAlertThreshold + 5 },
    { name: 'USB-C Hub', category: 'Accessories', stock: 3, minStock: stockAlertThreshold + 10 },
    { name: 'Wireless Charger', category: 'Accessories', stock: 7, minStock: stockAlertThreshold + 15 },
  ];

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Dashboard</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Dashboard</span>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className={`icon-wrapper ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
              <div className="stat-trend" style={{ marginLeft: 'auto' }}>
                <span style={{ color: stat.trendUp ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: '500' }}>
                  {stat.trendUp ? <FiTrendingUp style={{ marginRight: '4px' }} /> : <FiTrendingDown style={{ marginRight: '4px' }} />}
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Stats Row */}
      <div className="row g-4 mb-4">
        {advancedStats.map((stat, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="stat-card">
              <div className={`icon-wrapper ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{stat.subtitle}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="data-card">
            <div className="data-card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="data-card-body">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <Link to="/products/add" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      <FiPlus />
                    </div>
                    <span>Add Product</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/sales/add" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                      <FiDollarSign />
                    </div>
                    <span>New Sale</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/purchases/add" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                      <FiShoppingCart />
                    </div>
                    <span>New Purchase</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/customers" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                      <FiUsers />
                    </div>
                    <span>Add Customer</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="row g-4">
        {/* Recent Sales */}
        <div className="col-12 col-xl-8">
          <div className="data-card">
            <div className="data-card-header">
              <h5>Recent Sales</h5>
              <Link to="/sales" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td><strong>{sale.id}</strong></td>
                        <td>{sale.customer}</td>
                        <td>{sale.date}</td>
                        <td>{currencySymbol}{sale.amount.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${sale.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                            {sale.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action view me-1"><FiEye /></button>
                          {isAdmin && (
                            <>
                              <button className="btn-action edit me-1"><FiEdit /></button>
                              <button className="btn-action delete"><FiTrash2 /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="col-12 col-xl-4">
          <div className="data-card">
            <div className="data-card-header">
              <h5><FiAlertTriangle style={{ color: '#f59e0b', marginRight: '8px' }} />Low Stock Alert</h5>
            </div>
            <div className="data-card-body">
              {lowStockProducts.map((product, index) => (
                <div 
                  key={index} 
                  className="d-flex align-items-center justify-content-between p-3 mb-2"
                  style={{ background: 'var(--primary-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{product.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#dc2626' }}>{product.stock} left</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Min: {product.minStock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="data-card">
            <div className="data-card-header">
              <h5>Top Selling Products</h5>
              <Link to="/products" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Sold</th>
                      <th>Revenue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="product-img"
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td><strong>{product.sold}</strong> units</td>
                        <td><strong>{currencySymbol}{product.revenue.toLocaleString()}</strong></td>
                        <td>
                          <span className="badge badge-success">
                            <FiTrendingUp className="me-1" />Top Seller
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
