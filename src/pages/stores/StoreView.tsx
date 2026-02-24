import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const mockStoresData = [
  { id: 1, name: 'Main Store', code: 'MS001', email: 'main@store.com', phone: '+1 234 567 890', address: '123 Main Street, Downtown', manager: 'John Manager', products: 248, status: 'Active' },
  { id: 2, name: 'Branch 1', code: 'BR001', email: 'branch1@store.com', phone: '+1 234 567 891', address: '456 Oak Avenue, Uptown', manager: 'Jane Supervisor', products: 156, status: 'Active' },
  { id: 3, name: 'Branch 2', code: 'BR002', email: 'branch2@store.com', phone: '+1 234 567 892', address: '789 Pine Road, Midtown', manager: 'Bob Lead', products: 98, status: 'Active' },
  { id: 4, name: 'Warehouse', code: 'WH001', email: 'warehouse@store.com', phone: '+1 234 567 893', address: '100 Industrial Park', manager: 'Alice Stock', products: 520, status: 'Active' },
];

const StoreView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canManage = hasPermission('stores.manage');
  const store = mockStoresData.find(s => s.id === parseInt(id || '0'));

  if (!store) {
    return (
      <div className="store-view-page">
        <div className="page-header"><h4>Store Not Found</h4></div>
        <div className="data-card"><div className="data-card-body text-center py-5">
          <p className="text-muted">The store you're looking for doesn't exist.</p>
          <Link to="/stores" className="btn btn-primary-custom"><FiArrowLeft className="me-1" /> Back to List</Link>
        </div></div>
      </div>
    );
  }

  return (
    <div className="store-view-page">
      <div className="page-header">
        <h4>Store Details</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/stores">Stores</Link><span>/</span><span>{store.name}</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <h5 className="mb-4">Store Information</h5>
            <table className="table table-borderless">
              <tbody>
                <tr><td className="text-muted" style={{width: '180px'}}>Store Name</td><td><strong>{store.name}</strong></td></tr>
                <tr><td className="text-muted">Code</td><td>{store.code}</td></tr>
                <tr><td className="text-muted">Email</td><td>{store.email}</td></tr>
                <tr><td className="text-muted">Phone</td><td>{store.phone}</td></tr>
                <tr><td className="text-muted">Address</td><td>{store.address}</td></tr>
                <tr><td className="text-muted">Manager</td><td>{store.manager}</td></tr>
                <tr><td className="text-muted">Products</td><td>{store.products}</td></tr>
                <tr><td className="text-muted">Status</td><td><span className={`badge ${store.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{store.status}</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <div className="d-grid gap-2">
              <button className="btn btn-secondary-custom" onClick={() => navigate('/stores')}>
                <FiArrowLeft className="me-2" /> Back to List
              </button>
              {canManage && (
                <button className="btn btn-primary-custom" onClick={() => navigate(`/stores/edit/${store.id}`)}>
                  <FiEdit className="me-2" /> Edit Store
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreView;
