import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';

interface Customer {
  id: number; name: string; email: string; phone: string; address: string; purchases: number; totalSpent: number;
}

const CustomerList = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canManage = hasPermission('customers.manage');

  const [searchTerm, setSearchTerm] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', address: '123 Main St, New York', purchases: 15, totalSpent: 4520.00 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', address: '456 Oak Ave, Los Angeles', purchases: 8, totalSpent: 2180.00 },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', address: '789 Pine Rd, Chicago', purchases: 22, totalSpent: 7890.00 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', address: '321 Elm St, Houston', purchases: 5, totalSpent: 1250.00 },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', address: '654 Maple Dr, Phoenix', purchases: 12, totalSpent: 3450.00 },
  ]);

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      showToast({ type: 'success', title: 'Deleted', message: 'Customer deleted successfully!' });
    }
  };

  return (
    <div className="customer-list-page">
      <div className="page-header"><h4>Customers</h4><div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Customers</span></div></div>
      <div className="data-card mb-4"><div className="data-card-body"><div className="row g-3 align-items-center">
        <div className="col-12 col-md-4"><div className="input-group"><span className="input-group-text bg-white border-end-0"><FiSearch /></span><input type="text" className="form-control border-start-0" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
        <div className="col-12 col-md-5"></div>
        <div className="col-12 col-md-3 text-end">{canManage && <Link to="/customers/add" className="btn btn-primary-custom"><FiPlus className="me-1" /> Add Customer</Link>}</div>
      </div></div></div>
      <div className="data-card"><div className="data-card-body"><div className="table-responsive"><table className="data-table"><thead><tr><th>#</th><th>Name</th><th>Contact</th><th>Address</th><th>Purchases</th><th>Total Spent</th><th>Action</th></tr></thead><tbody>
        {filteredCustomers.map((customer, index) => (
          <tr key={customer.id}>
            <td>{index + 1}</td><td><strong>{customer.name}</strong></td>
            <td><div><FiMail size={14} className="me-1" />{customer.email}</div><div className="text-muted small"><FiPhone size={12} className="me-1" />{customer.phone}</div></td>
            <td>{customer.address}</td><td>{customer.purchases}</td><td><strong>${customer.totalSpent.toFixed(2)}</strong></td>
            <td>
              <button className="btn-action view me-1" onClick={() => navigate(`/customers/view/${customer.id}`)}><FiEye /></button>
              {canManage && <><button className="btn-action edit me-1" onClick={() => navigate(`/customers/edit/${customer.id}`)}><FiEdit /></button><button className="btn-action delete" onClick={() => handleDelete(customer)}><FiTrash2 /></button></>}
            </td>
          </tr>
        ))}
      </tbody></table></div></div></div>
    </div>
  );
};

export default CustomerList;
