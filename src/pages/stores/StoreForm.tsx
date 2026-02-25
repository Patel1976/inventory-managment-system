import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { useToast } from '../../components/common/Toast';

const mockStoresData = [
  { id: 1, name: 'Main Store', email: 'main@store.com', phone: '+1 234 567 890', address: '123 Main Street, Downtown', manager: 'John Manager', status: 'Active' },
  { id: 2, name: 'Branch 1', email: 'branch1@store.com', phone: '+1 234 567 891', address: '456 Oak Avenue, Uptown', manager: 'Jane Supervisor', status: 'Active' },
  { id: 3, name: 'Branch 2', email: 'branch2@store.com', phone: '+1 234 567 892', address: '789 Pine Road, Midtown', manager: 'Bob Lead', status: 'Active' },
  { id: 4, name: 'Warehouse', email: 'warehouse@store.com', phone: '+1 234 567 893', address: '100 Industrial Park', manager: 'Alice Stock', status: 'Active' },
];

const StoreForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', manager: '', status: 'Active'
  });

  useEffect(() => {
    if (isEdit && id) {
      const existing = mockStoresData.find(s => s.id === parseInt(id));
      if (existing) {
        setFormData({ name: existing.name, email: existing.email, phone: existing.phone, address: existing.address, manager: existing.manager, status: existing.status });
      }
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast({ type: 'success', title: 'Success', message: isEdit ? 'Store updated successfully!' : 'Store added successfully!' });
      navigate('/stores');
    }, 500);
  };

  return (
    <div className="add-store-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Store' : 'Add Store'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/stores">Stores</Link><span>/</span><span>{isEdit ? 'Edit' : 'Add'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="form-card">
              <h5 className="mb-4">Store Information</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0"><label>Store Name *</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter store name" required />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0"><label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0"><label>Phone</label>
                    <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0"><label>Manager Name</label>
                    <input type="text" className="form-control" name="manager" value={formData.manager} onChange={handleChange} placeholder="Enter manager name" />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0"><label>Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-0"><label>Address</label>
                    <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Enter full address" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="form-card">
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary-custom" disabled={isLoading}>
                  <FiSave className="me-2" /> {isLoading ? 'Saving...' : (isEdit ? 'Update Store' : 'Save Store')}
                </button>
                <Link to="/stores" className="btn btn-secondary-custom">
                  <FiX className="me-2" /> Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
