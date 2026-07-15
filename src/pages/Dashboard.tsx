import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBox, FiShoppingCart, FiDollarSign, FiUsers,
  FiTrendingUp, FiTrendingDown, FiAlertTriangle,
  FiPlus, FiPercent
} from 'react-icons/fi';
import { useSettings } from '../contexts/useSettings';
import { getDashboardData } from '../services/dashboardService';

interface Trend { label: string; trend_up: boolean; }
interface Stats {
  total_products: number;
  total_purchases: number;
  total_sales: number;
  total_customers: number;
  trends: { products: Trend; purchases: Trend; sales: Trend; customers: Trend; };
}
interface AdvancedStats { net_profit: number; gross_loss: number; tax_collected: number; }
interface RecentSale { id: string; customer: string; date: string; amount: number; status: string; }
interface LowStockProduct { name: string; category: string; stock: number; min_stock: number; }
interface TopProduct { name: string; category: string; total_sold: number; total_revenue: number; image: string | null; }

const Dashboard = () => {
  const { currencySymbol } = useSettings();
  const [stats, setStats] = useState<Stats | null>(null);
  const [advancedStats, setAdvancedStats] = useState<AdvancedStats | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((res) => {
        const d = res.data.data;
        setStats(d.stats);
        setAdvancedStats(d.advanced_stats);
        setRecentSales(d.recent_sales);
        setLowStockProducts(d.low_stock_products);
        setTopProducts(d.top_products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val: number) => `${currencySymbol}${Number(val).toLocaleString()}`;

  const mainStats = stats
    ? [
        { title: 'Total Products', value: String(stats.total_products), icon: <FiBox />, color: 'bg-primary', trend: stats.trends.products },
        { title: 'Total Purchase', value: fmt(stats.total_purchases), icon: <FiShoppingCart />, color: 'bg-success', trend: stats.trends.purchases },
        { title: 'Total Sales', value: fmt(stats.total_sales), icon: <FiDollarSign />, color: 'bg-info', trend: stats.trends.sales },
        { title: 'Total Customers', value: String(stats.total_customers), icon: <FiUsers />, color: 'bg-warning', trend: stats.trends.customers },
      ]
    : [];

  const advStats = advancedStats
    ? [
        { title: 'Net Profit', value: fmt(advancedStats.net_profit), icon: <FiTrendingUp />, color: 'bg-success', subtitle: 'This Month' },
        { title: 'Gross Loss', value: fmt(advancedStats.gross_loss), icon: <FiTrendingDown />, color: 'bg-danger', subtitle: 'This Month' },
        { title: 'Tax Collected', value: fmt(advancedStats.tax_collected), icon: <FiPercent />, color: 'bg-info', subtitle: 'This Month' },
      ]
    : [];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h4>Dashboard</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Dashboard</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="row g-4 mb-4">
        {mainStats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className={`icon-wrapper ${stat.color}`}>{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
              <div className="stat-trend" style={{ marginLeft: 'auto' }}>
                <span style={{ color: stat.trend.trend_up ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: '500' }}>
                  {stat.trend.trend_up ? <FiTrendingUp style={{ marginRight: '4px' }} /> : <FiTrendingDown style={{ marginRight: '4px' }} />}
                  {stat.trend.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Stats */}
      <div className="row g-4 mb-4">
        {advStats.map((stat, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="stat-card">
              <div className={`icon-wrapper ${stat.color}`}>{stat.icon}</div>
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
            <div className="data-card-header"><h5>Quick Actions</h5></div>
            <div className="data-card-body">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <Link to="/products/add" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}><FiPlus /></div>
                    <span>Add Product</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/sales/add" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}><FiDollarSign /></div>
                    <span>New Sale</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/purchases/add" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}><FiShoppingCart /></div>
                    <span>New Purchase</span>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/customers" className="quick-action-btn">
                    <div className="icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}><FiUsers /></div>
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
              <Link to="/sales" className="btn btn-sm btn-outline-primary d-flex align-items-center">View All</Link>
            </div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {recentSales.length === 0 ? (
                      <tr><td colSpan={5} className="text-center text-muted">No recent sales</td></tr>
                    ) : recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td><strong>{sale.id}</strong></td>
                        <td>{sale.customer}</td>
                        <td>{sale.date}</td>
                        <td>{currencySymbol}{Number(sale.amount).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${sale.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                            {sale.status}
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

        {/* Low Stock Alert */}
        <div className="col-12 col-xl-4">
          <div className="data-card">
            <div className="data-card-header">
              <h5 className="d-flex align-items-center">
                <FiAlertTriangle style={{ color: '#f59e0b', marginRight: '8px' }} />Low Stock Alert
              </h5>
            </div>
            <div className="data-card-body">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted text-center">No low stock products</p>
              ) : lowStockProducts.map((product, index) => (
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
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Min: {product.min_stock}</div>
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
              <Link to="/products" className="btn btn-sm btn-outline-primary d-flex align-items-center">View All</Link>
            </div>
            <div className="data-card-body">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr><th>Product</th><th>Category</th><th>Sold</th><th>Revenue</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0 ? (
                      <tr><td colSpan={5} className="text-center text-muted">No data available</td></tr>
                    ) : topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={product.image || 'https://placehold.co/40x40?text=N/A'}
                              alt={product.name}
                              className="product-img"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=N/A'; }}
                            />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td><strong>{product.total_sold}</strong> units</td>
                        <td><strong>{currencySymbol}{Number(product.total_revenue).toLocaleString()}</strong></td>
                        <td>
                          <span className="badge badge-success d-inline-flex align-items-center">
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
