import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';

interface Supplier { id: number; name: string; email: string; phone: string; address: string; purchases: number; totalPurchased: number; }

const SupplierList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = hasPermission('suppliers.manage');
  const [searchTerm, setSearchTerm] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: 'Tech Suppliers Inc', email: 'contact@techsuppliers.com', phone: '+1 234 567 890', address: '100 Tech Park, Silicon Valley', purchases: 45, totalPurchased: 125000.00 },
    { id: 2, name: 'Global Electronics', email: 'sales@globalelec.com', phone: '+1 234 567 891', address: '200 Industry Blvd, Texas', purchases: 32, totalPurchased: 89500.00 },
    { id: 3, name: 'Premium Parts Ltd', email: 'info@premiumparts.com', phone: '+1 234 567 892', address: '300 Commerce St, Florida', purchases: 28, totalPurchased: 67800.00 },
    { id: 4, name: 'Digital World', email: 'orders@digitalworld.com', phone: '+1 234 567 893', address: '400 Digital Ave, California', purchases: 19, totalPurchased: 45200.00 },
  ]);

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (supplier: Supplier) => {
    if (window.confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Supplier deleted successfully!' });
    }
  };

  return (
    <div className="supplier-list-page">
      <div className="page-header"><h4>Suppliers</h4><div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Suppliers</span></div></div>
      <div className="data-card mb-4"><div className="data-card-body"><div className="row g-3 align-items-center">
        <div className="col-12 col-md-4"><div className="input-group"><span className="input-group-text bg-white border-end-0"><FiSearch /></span><input type="text" className="form-control border-start-0" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
        <div className="col-12 col-md-5"></div>
        <div className="col-12 col-md-3 text-end">{canManage && <Link to="/suppliers/add" className="btn btn-primary-custom"><FiPlus className="me-1" /> Add Supplier</Link>}</div>
      </div></div></div>
      <div className="data-card"><div className="data-card-body"><div className="table-responsive"><table className="data-table"><thead><tr><th>#</th><th>Supplier Name</th><th>Contact</th><th>Address</th><th>Orders</th><th>Total Purchased</th><th>Action</th></tr></thead><tbody>
        {filteredSuppliers.map((supplier, index) => (
          <tr key={supplier.id}><td>{index + 1}</td><td><strong>{supplier.name}</strong></td><td><div><FiMail size={14} className="me-1" />{supplier.email}</div><div className="text-muted small"><FiPhone size={12} className="me-1" />{supplier.phone}</div></td><td>{supplier.address}</td><td>{supplier.purchases}</td><td><strong>${supplier.totalPurchased.toLocaleString()}</strong></td><td>
            <button className="btn-action view me-1" onClick={() => navigate(`/suppliers/view/${supplier.id}`)}><FiEye /></button>
            {canManage && <><button className="btn-action edit me-1" onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}><FiEdit /></button><button className="btn-action delete" onClick={() => handleDelete(supplier)}><FiTrash2 /></button></>}
          </td></tr>
        ))}
      </tbody></table></div></div></div>
    </div>
  );
};

export default SupplierList;
