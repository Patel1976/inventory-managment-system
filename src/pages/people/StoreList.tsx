import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMapPin, FiPhone } from 'react-icons/fi';

const StoreList = () => {
  const stores = [
    { id: 1, name: 'Main Store', code: 'MS001', manager: 'John Manager', phone: '+1 234 567 890', address: '123 Main Street, Downtown', products: 248, status: 'Active' },
    { id: 2, name: 'Branch 1', code: 'BR001', manager: 'Jane Supervisor', phone: '+1 234 567 891', address: '456 Oak Avenue, Uptown', products: 156, status: 'Active' },
    { id: 3, name: 'Branch 2', code: 'BR002', manager: 'Bob Lead', phone: '+1 234 567 892', address: '789 Pine Road, Midtown', products: 98, status: 'Active' },
    { id: 4, name: 'Warehouse', code: 'WH001', manager: 'Alice Stock', phone: '+1 234 567 893', address: '100 Industrial Park', products: 520, status: 'Active' },
  ];

  return (
    <div className="store-list-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Stores</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/stores">People</Link>
          <span>/</span>
          <span>Stores</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input type="text" className="form-control border-start-0" placeholder="Search stores..." />
              </div>
            </div>
            <div className="col-12 col-md-5"></div>
            <div className="col-12 col-md-3 text-end">
              <Link to="/stores/add" className="btn btn-primary-custom">
                <FiPlus className="me-1" /> Add Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Store Name</th>
                  <th>Code</th>
                  <th>Manager</th>
                  <th>Contact</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, index) => (
                  <tr key={store.id}>
                    <td>{index + 1}</td>
                    <td><strong>{store.name}</strong></td>
                    <td>{store.code}</td>
                    <td>{store.manager}</td>
                    <td>
                      <div><FiPhone size={14} className="me-1" />{store.phone}</div>
                      <div className="text-muted small"><FiMapPin size={12} className="me-1" />{store.address}</div>
                    </td>
                    <td>{store.products}</td>
                    <td>
                      <span className="badge badge-success">{store.status}</span>
                    </td>
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

export default StoreList;
