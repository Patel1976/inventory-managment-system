import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import * as customerService from '../../services/customerService';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', country: '',
    status: 'active', opening_balance: ''
  });

  useEffect(() => {
    if (isEdit && state?.customer) {
      const c = state.customer;
      setFormData({
        name: c.name || '', email: c.email || '', phone: c.phone || '',
        address: c.address || '', city: c.city || '', country: c.country || '',
        status: c.status || 'active', opening_balance: c.opening_balance?.toString() || ''
      });
    } else if (isEdit && id) {
      customerService.getCustomer(Number(id))
        .then(r => {
          const c = r.data.data;
          setFormData({
            name: c.name || '', email: c.email || '', phone: c.phone || '',
            address: c.address || '', city: c.city || '', country: c.country || '',
            status: c.status || 'active', opening_balance: c.opening_balance?.toString() || ''
          });
        }).catch(() => {});
    }
  }, [id, isEdit, state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { ...formData, opening_balance: formData.opening_balance ? Number(formData.opening_balance) : 0 };
    try {
      if (isEdit && id) {
        await customerService.updateCustomer(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Customer updated successfully!' });
      } else {
        await customerService.createCustomer(payload);
        showToast({ type: 'success', title: 'Success', message: 'Customer added successfully!' });
      }
      navigate('/customers');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-customer-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Customer' : 'Add Customer'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/customers">Customers</Link><span>/</span><span>{isEdit ? 'Edit' : 'Add'}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <h5 className="mb-4">Customer Information</h5>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Name *</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter customer name" required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Email *</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Phone</label>
                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>City</label>
                <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Country</label>
                <input type="text" className="form-control" name="country" value={formData.country} onChange={handleChange} placeholder="Enter country" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Opening Balance</label>
                <input type="number" className="form-control" name="opening_balance" value={formData.opening_balance} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="col-12">
              <div className="form-group mb-0">
                <label>Address</label>
                <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Enter full address" />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Link to="/customers" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
            <button type="submit" className="btn btn-primary-custom" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
