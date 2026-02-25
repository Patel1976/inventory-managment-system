import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const mockSuppliersData = [
  { id: 1, name: 'Tech Suppliers Inc', company: 'Tech Suppliers Inc', email: 'contact@techsuppliers.com', phone: '+1 234 567 890', address: '100 Tech Park, Silicon Valley', taxNumber: 'TX-001234', purchases: 45, totalPurchased: 125000.00, status: 'Active' },
  { id: 2, name: 'Global Electronics', company: 'Global Electronics Ltd', email: 'sales@globalelec.com', phone: '+1 234 567 891', address: '200 Industry Blvd, Texas', taxNumber: 'TX-005678', purchases: 32, totalPurchased: 89500.00, status: 'Active' },
  { id: 3, name: 'Premium Parts Ltd', company: 'Premium Parts Ltd', email: 'info@premiumparts.com', phone: '+1 234 567 892', address: '300 Commerce St, Florida', taxNumber: 'TX-009012', purchases: 28, totalPurchased: 67800.00, status: 'Active' },
  { id: 4, name: 'Digital World', company: 'Digital World Corp', email: 'orders@digitalworld.com', phone: '+1 234 567 893', address: '400 Digital Ave, California', taxNumber: 'TX-003456', purchases: 19, totalPurchased: 45200.00, status: 'Inactive' },
];

const SupplierView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canManage = hasPermission('suppliers.manage');
  const supplier = mockSuppliersData.find(s => s.id === parseInt(id || '0'));

  if (!supplier) {
    return (
      <div className="supplier-view-page">
        <div className="page-header"><h4>Supplier Not Found</h4></div>
        <div className="data-card"><div className="data-card-body text-center py-5">
          <p className="text-muted">The supplier you're looking for doesn't exist.</p>
          <Link to="/suppliers" className="btn btn-primary-custom"><FiArrowLeft className="me-1" /> Back to List</Link>
        </div></div>
      </div>
    );
  }

  return (
    <div className="supplier-view-page">
      <div className="page-header">
        <h4>Supplier Details</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/suppliers">Suppliers</Link><span>/</span><span>{supplier.name}</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <h5 className="mb-4">Supplier Information</h5>
            <table className="table table-borderless">
              <tbody>
                <tr><td className="text-muted" style={{width: '180px'}}>Supplier Name</td><td><strong>{supplier.name}</strong></td></tr>
                <tr><td className="text-muted">Company</td><td>{supplier.company}</td></tr>
                <tr><td className="text-muted">Email</td><td>{supplier.email}</td></tr>
                <tr><td className="text-muted">Phone</td><td>{supplier.phone}</td></tr>
                <tr><td className="text-muted">Address</td><td>{supplier.address}</td></tr>
                <tr><td className="text-muted">Tax Number</td><td>{supplier.taxNumber}</td></tr>
                <tr><td className="text-muted">Status</td><td><span className={`badge ${supplier.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{supplier.status}</span></td></tr>
                <tr><td className="text-muted">Total Orders</td><td>{supplier.purchases}</td></tr>
                <tr><td className="text-muted">Total Purchased</td><td><strong>${supplier.totalPurchased.toLocaleString()}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <div className="d-grid gap-2">
              <button className="btn btn-secondary-custom" onClick={() => navigate('/suppliers')}>
                <FiArrowLeft className="me-2" /> Back to List
              </button>
              {canManage && (
                <button className="btn btn-primary-custom" onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}>
                  <FiEdit className="me-2" /> Edit Supplier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierView;
