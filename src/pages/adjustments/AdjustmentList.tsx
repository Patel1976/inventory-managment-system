import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const AdjustmentList = () => {
  const adjustments = [
    { id: 1, date: '2024-01-15', reference: 'ADJ-001', store: 'Main Store', type: 'Addition', products: 5, total: '+150', reason: 'Stock received from supplier' },
    { id: 2, date: '2024-01-14', reference: 'ADJ-002', store: 'Branch 1', type: 'Subtraction', products: 3, total: '-25', reason: 'Damaged items removed' },
    { id: 3, date: '2024-01-13', reference: 'ADJ-003', store: 'Main Store', type: 'Addition', products: 8, total: '+200', reason: 'Inventory count adjustment' },
    { id: 4, date: '2024-01-12', reference: 'ADJ-004', store: 'Branch 2', type: 'Subtraction', products: 2, total: '-10', reason: 'Expired products' },
  ];

  return (
    <div className="adjustment-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Stock Adjustments</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Stock Adjustments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." />
              </div>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Types</option>
                <option value="addition">Addition</option>
                <option value="subtraction">Subtraction</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select">
                <option value="">All Stores</option>
                <option value="1">Main Store</option>
                <option value="2">Branch 1</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-3 text-end">
              <Link to="/adjustments/add" className="btn btn-primary-custom">
                <FiPlus className="me-1" /> Add Adjustment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Store</th>
                  <th>Type</th>
                  <th>Products</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.map((adj, index) => (
                  <tr key={adj.id}>
                    <td>{index + 1}</td>
                    <td>{adj.date}</td>
                    <td><strong>{adj.reference}</strong></td>
                    <td>{adj.store}</td>
                    <td>
                      <span className={`badge ${adj.type === 'Addition' ? 'badge-success' : 'badge-danger'}`}>
                        {adj.type}
                      </span>
                    </td>
                    <td>{adj.products}</td>
                    <td><strong style={{ color: adj.type === 'Addition' ? '#16a34a' : '#dc2626' }}>{adj.total}</strong></td>
                    <td>{adj.reason}</td>
                    <td>
                      <button className="btn-action view me-1"><FiEye /></button>
                      <button className="btn-action edit me-1"><FiEdit /></button>
                      <button className="btn-action delete"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentList;
