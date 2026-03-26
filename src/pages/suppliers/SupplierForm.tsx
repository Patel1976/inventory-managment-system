import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';

const mockSuppliersData = [
  { id: 1, name: 'Tech Suppliers Inc', company: 'Tech Suppliers Inc', email: 'contact@techsuppliers.com', phone: '+1 234 567 890', address: '100 Tech Park, Silicon Valley', taxNumber: 'TX-001234', status: 'active' },
  { id: 2, name: 'Global Electronics', company: 'Global Electronics Ltd', email: 'sales@globalelec.com', phone: '+1 234 567 891', address: '200 Industry Blvd, Texas', taxNumber: 'TX-005678', status: 'active' },
  { id: 3, name: 'Premium Parts Ltd', company: 'Premium Parts Ltd', email: 'info@premiumparts.com', phone: '+1 234 567 892', address: '300 Commerce St, Florida', taxNumber: 'TX-009012', status: 'active' },
  { id: 4, name: 'Digital World', company: 'Digital World Corp', email: 'orders@digitalworld.com', phone: '+1 234 567 893', address: '400 Digital Ave, California', taxNumber: 'TX-003456', status: 'inactive' },
];

const SupplierForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', address: '', taxNumber: '', status: 'active'
  });

  useEffect(() => {
    if (isEdit && id) {
      const existing = mockSuppliersData.find(s => s.id === parseInt(id));
      if (existing) {
        setFormData({ name: existing.name, company: existing.company, email: existing.email, phone: existing.phone, address: existing.address, taxNumber: existing.taxNumber, status: existing.status });
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
      showToast({ type: 'success', title: 'Success', message: isEdit ? 'Supplier updated successfully!' : 'Supplier added successfully!' });
      navigate('/suppliers');
    }, 500);
  };

  return (
    <div className="add-supplier-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/suppliers">Suppliers</Link><span>/</span><span>{isEdit ? 'Edit' : 'Add'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-card">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Supplier Information</h5>
              </div>

              <div className="row g-3">

                <div className="col-12 col-md-6">
                  <label>Supplier Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="col-12 col-md-6">
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

                <div className="col-12 col-md-6">
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

                <div className="col-12 col-md-6">
                  <label>Tax Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="taxNumber"
                    value={formData.taxNumber}
                    onChange={handleChange}
                    placeholder="Enter tax number"
                  />
                </div>

                <div className="col-12 col-md-6">
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

                <div className="col-12">
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

              {/* Buttons inside same card */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                <Link to="/suppliers" className="btn btn-secondary-custom d-flex align-items-center">
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
                      ? 'Update Supplier'
                      : 'Save Supplier'}
                </button>

              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
