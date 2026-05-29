import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import * as supplierService from '../../services/supplierService';

const SupplierForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', address: '',
    taxNumber: '', status: 'active', opening_balance: ''
  });

  useEffect(() => {
    if (isEdit && state?.supplier) {
      const s = state.supplier;
      setFormData({
        name: s.name || '', company: s.company || '', email: s.email || '',
        phone: s.phone || '', address: s.address || '', taxNumber: s.taxNumber || '',
        status: s.status || 'active', opening_balance: s.opening_balance?.toString() || ''
      });
    } else if (isEdit && id) {
      supplierService.getSupplier(Number(id))
        .then(r => {
          const s = r.data.data;
          setFormData({
            name: s.name || '', company: s.company || '', email: s.email || '',
            phone: s.phone || '', address: s.address || '', taxNumber: s.taxNumber || '',
            status: s.status || 'active', opening_balance: s.opening_balance?.toString() || ''
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
        await supplierService.updateSupplier(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Supplier updated successfully!' });
      } else {
        await supplierService.createSupplier(payload);
        showToast({ type: 'success', title: 'Success', message: 'Supplier added successfully!' });
      }
      navigate('/suppliers');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
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
              <h5 className="mb-4">Supplier Information</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label>Supplier Name *</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter supplier name" required />
                </div>
                <div className="col-12 col-md-6">
                  <label>Company Name</label>
                  <input type="text" className="form-control" name="company" value={formData.company} onChange={handleChange} placeholder="Enter company name" />
                </div>
                <div className="col-12 col-md-6">
                  <label>Email *</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                </div>
                <div className="col-12 col-md-6">
                  <label>Phone</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
                </div>
                <div className="col-12 col-md-6">
                  <label>Tax Number</label>
                  <input type="text" className="form-control" name="taxNumber" value={formData.taxNumber} onChange={handleChange} placeholder="Enter tax number" />
                </div>
                <div className="col-12 col-md-6">
                  <label>Opening Balance</label>
                  <input type="number" className="form-control" name="opening_balance" value={formData.opening_balance} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="col-12 col-md-6">
                  <label>Status</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-12">
                  <label>Address</label>
                  <textarea className="form-control" name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Enter full address" />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Link to="/suppliers" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
                <button type="submit" className="btn btn-primary-custom" disabled={isLoading}>
                  {isLoading ? 'Saving...' : isEdit ? 'Update Supplier' : 'Save Supplier'}
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
