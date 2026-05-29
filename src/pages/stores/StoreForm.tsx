import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import * as storeService from '../../services/storeService';

const StoreForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { showToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', code: '', email: '', phone: '', address: '', manager: '', status: 'active'
  });

  useEffect(() => {
    if (isEdit && state?.store) {
      const s = state.store;
      setFormData({ name: s.name || '', code: s.code || '', email: s.email || '', phone: s.phone || '', address: s.address || '', manager: s.manager || '', status: s.status || 'active' });
    } else if (isEdit && id) {
      storeService.getStore(Number(id)).then(r => {
        const s = r.data.data;
        setFormData({ name: s.name || '', code: s.code || '', email: s.email || '', phone: s.phone || '', address: s.address || '', manager: s.manager || '', status: s.status || 'active' });
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
    try {
      if (isEdit && id) {
        await storeService.updateStore(Number(id), formData);
        showToast({ type: 'success', title: 'Success', message: 'Store updated successfully!' });
      } else {
        await storeService.createStore(formData);
        showToast({ type: 'success', title: 'Success', message: 'Store added successfully!' });
      }
      navigate('/stores');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsLoading(false);
    }
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
        <div className="row">
          <div className="col-12">
            <div className="form-card">
              <h5 className="mb-4">Store Information</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Store Name *</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Enter store name" required />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Store Code *</label>
                    <input type="text" className="form-control" name="code" value={formData.code} onChange={handleChange} placeholder="e.g. MS001" required />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
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
                    <label>Manager Name</label>
                    <input type="text" className="form-control" name="manager" value={formData.manager} onChange={handleChange} placeholder="Enter manager name" />
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
                <div className="col-12 mt-3 d-flex justify-content-end">
                  <div className="d-flex gap-2">
                    <Link to="/stores" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
                    <button type="submit" className="btn btn-primary-custom" disabled={isLoading}>
                      {isLoading ? 'Saving...' : isEdit ? 'Update Store' : 'Save Store'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
