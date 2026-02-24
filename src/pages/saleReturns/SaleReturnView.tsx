import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { mockSaleReturns } from './SaleReturnList';
import { useAuth } from '../../contexts/AuthContext';

const SaleReturnView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const item = mockSaleReturns.find(r => r.id === id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  if (!item) {
    return (
      <div className="sale-return-view-page">
        <div className="page-header"><h4>Sale Return Not Found</h4></div>
        <div className="data-card"><div className="data-card-body text-center py-5">
          <p className="text-muted">The sale return you're looking for doesn't exist.</p>
          <Link to="/sales/returns" className="btn btn-primary-custom"><FiArrowLeft className="me-1" /> Back to List</Link>
        </div></div>
      </div>
    );
  }

  return (
    <div className="sale-return-view-page">
      <div className="page-header">
        <h4>Sale Return Details</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/sales/returns">Sale Returns</Link><span>/</span><span>{item.id}</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="form-card">
            <h5 className="mb-4">Return Information</h5>
            <table className="table table-borderless">
              <tbody>
                <tr><td className="text-muted" style={{width: '180px'}}>Return ID</td><td><strong>{item.id}</strong></td></tr>
                <tr><td className="text-muted">Date</td><td>{item.date}</td></tr>
                <tr><td className="text-muted">Sale Reference</td><td><strong>{item.saleRef}</strong></td></tr>
                <tr><td className="text-muted">Customer</td><td>{item.customer}</td></tr>
                <tr><td className="text-muted">Product</td><td>{item.product}</td></tr>
                <tr><td className="text-muted">Quantity</td><td>{item.quantity}</td></tr>
                <tr><td className="text-muted">Return Amount</td><td><strong>${item.returnAmount.toFixed(2)}</strong></td></tr>
                <tr><td className="text-muted">Reason</td><td>{item.reason}</td></tr>
                <tr><td className="text-muted">Status</td><td><span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="form-card">
            <div className="d-grid gap-2">
              <button className="btn btn-secondary-custom" onClick={() => navigate('/sales/returns')}>
                <FiArrowLeft className="me-2" /> Back to List
              </button>
              {isAdmin && (
                <button className="btn btn-primary-custom" onClick={() => navigate(`/sales/returns/edit/${item.id}`)}>
                  <FiEdit className="me-2" /> Edit Return
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReturnView;
