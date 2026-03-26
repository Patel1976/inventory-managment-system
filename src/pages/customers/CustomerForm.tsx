import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { useToast } from '../../components/common/Toast';

const mockCustomersData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', address: '123 Main St', city: 'New York', country: 'USA', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', address: '456 Oak Ave', city: 'Los Angeles', country: 'USA', status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', address: '789 Pine Rd', city: 'Chicago', country: 'USA', status: 'active' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', address: '321 Elm St', city: 'Houston', country: 'USA', status: 'inactive' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', address: '654 Maple Dr', city: 'Phoenix', country: 'USA', status: 'active' },
];

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', country: '', status: 'active'
  });

  useEffect(() => {
    if (isEdit && id) {
      const existing = mockCustomersData.find(c => c.id === parseInt(id));
      if (existing) {
        setFormData({ name: existing.name, email: existing.email, phone: existing.phone, address: existing.address, city: existing.city, country: existing.country, status: existing.status });
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
      showToast({ type: 'success', title: 'Success', message: isEdit ? 'Customer updated successfully!' : 'Customer added successfully!' });
      navigate('/customers');
    }, 500);
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
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group mb-0">
                <label>Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="col-12">
              <div className="form-group mb-0">
                <label>Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter full address"
                />
              </div>
            </div>

          </div>

          {/* Buttons inside same card */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Link to="/customers" className="btn btn-secondary-custom d-flex align-items-center">
              Cancel
            </Link>

            <button
              type="submit"
              className="btn btn-primary-custom"
              disabled={isLoading}
            >
              {isLoading
                ? 'Saving...'
                : isEdit
                  ? 'Update Customer'
                  : 'Save Customer'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
