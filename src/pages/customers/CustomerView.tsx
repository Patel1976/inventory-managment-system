import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const mockCustomersData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', address: '123 Main St, New York', city: 'New York', country: 'USA', purchases: 15, totalSpent: 4520.00, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', address: '456 Oak Ave, Los Angeles', city: 'Los Angeles', country: 'USA', purchases: 8, totalSpent: 2180.00, status: 'Active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', address: '789 Pine Rd, Chicago', city: 'Chicago', country: 'USA', purchases: 22, totalSpent: 7890.00, status: 'Active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', address: '321 Elm St, Houston', city: 'Houston', country: 'USA', purchases: 5, totalSpent: 1250.00, status: 'Inactive' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', address: '654 Maple Dr, Phoenix', city: 'Phoenix', country: 'USA', purchases: 12, totalSpent: 3450.00, status: 'Active' },
];

const CustomerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canManage = hasPermission('customers.manage');
  const customer = mockCustomersData.find(c => c.id === parseInt(id || '0'));

  if (!customer) {
    return (
      <div className="customer-view-page">
        <div className="page-header"><h4>Customer Not Found</h4></div>
        <div className="data-card"><div className="data-card-body text-center py-5">
          <p className="text-muted">The customer you're looking for doesn't exist.</p>
          <Link to="/customers" className="btn btn-primary-custom"><FiArrowLeft className="me-1" /> Back to List</Link>
        </div></div>
      </div>
    );
  }

  return (
    <div className="customer-view-page">
      <div className="page-header">
        <h4>Customer Details</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/customers">Customers</Link><span>/</span><span>{customer.name}</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <h5 className="mb-4">Customer Information</h5>
            <table className="table table-borderless">
              <tbody>
                <tr><td className="text-muted" style={{width: '180px'}}>Name</td><td><strong>{customer.name}</strong></td></tr>
                <tr><td className="text-muted">Email</td><td>{customer.email}</td></tr>
                <tr><td className="text-muted">Phone</td><td>{customer.phone}</td></tr>
                <tr><td className="text-muted">Address</td><td>{customer.address}</td></tr>
                <tr><td className="text-muted">City</td><td>{customer.city}</td></tr>
                <tr><td className="text-muted">Country</td><td>{customer.country}</td></tr>
                <tr><td className="text-muted">Status</td><td><span className={`badge ${customer.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{customer.status}</span></td></tr>
                <tr><td className="text-muted">Total Purchases</td><td>{customer.purchases}</td></tr>
                <tr><td className="text-muted">Total Spent</td><td><strong>${customer.totalSpent.toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <div className="d-grid gap-2">
              <button className="btn btn-secondary-custom" onClick={() => navigate('/customers')}>
                <FiArrowLeft className="me-2" /> Back to List
              </button>
              {canManage && (
                <button className="btn btn-primary-custom" onClick={() => navigate(`/customers/edit/${customer.id}`)}>
                  <FiEdit className="me-2" /> Edit Customer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
