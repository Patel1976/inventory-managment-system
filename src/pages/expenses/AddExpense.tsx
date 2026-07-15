import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/common/Toast';
import { useSettings } from '../../contexts/useSettings';
import { getStores } from '../../services/commonService';
import * as expenseService from '../../services/expenseService';

interface ExpenseCategory { id: number; name: string; }
interface Store { id: number; name: string; }

const AddExpense = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currencySymbol } = useSettings();
  const { id } = useParams();
  const { state } = useLocation();
  const isEdit = !!id;
  const editData = state?.expense;

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    expense_category_id: '',
    date: new Date().toISOString().split('T')[0],
    store_id: '',
    amount: '',
    payment_method: 'cash',
    note: '',
    attachment: null as File | null,
  });

  useEffect(() => {
    expenseService.getExpenseCategories().then(r => setCategories(r.data.data)).catch(() => {});
    getStores().then(r => setStores(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit && editData) {
      setFormData(prev => ({
        ...prev,
        expense_category_id: String(editData.expense_category_id || editData.category?.id || ''),
        date: editData.date || prev.date,
        store_id: String(editData.store_id || editData.store?.id || ''),
        amount: editData.amount?.toString() || '',
        payment_method: editData.payment_method || 'cash',
        note: editData.note || '',
      }));
    }
  }, [isEdit, editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'attachment' && files) {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('expense_category_id', formData.expense_category_id);
    payload.append('date', formData.date);
    if (formData.store_id) payload.append('store_id', formData.store_id);
    payload.append('amount', formData.amount);
    payload.append('payment_method', formData.payment_method);
    if (formData.note) payload.append('note', formData.note);
    if (formData.attachment) payload.append('attachment', formData.attachment);

    try {
      if (isEdit && id) {
        await expenseService.updateExpense(Number(id), payload);
        showToast({ type: 'success', title: 'Success', message: 'Expense updated successfully!' });
      } else {
        await expenseService.createExpense(payload);
        showToast({ type: 'success', title: 'Success', message: 'Expense added successfully!' });
      }
      navigate('/expenses');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Operation failed!';
      showToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-expense-page">
      <div className="page-header">
        <h4>{isEdit ? 'Edit Expense' : 'Add Expense'}</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><Link to="/expenses">Expenses</Link><span>/</span><span>{isEdit ? 'Edit Expense' : 'Add Expense'}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-card">
              <h5 className="mb-4">Expense Details</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Category *</label>
                    <select name="expense_category_id" className="form-select" value={formData.expense_category_id} onChange={handleChange} required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Date *</label>
                    <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Store</label>
                    <select name="store_id" className="form-select" value={formData.store_id} onChange={handleChange}>
                      <option value="">Select Store</option>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Amount *</label>
                    <div className="input-group">
                      <span className="input-group-text">{currencySymbol}</span>
                      <input type="number" name="amount" className="form-control" placeholder="0.00" value={formData.amount} onChange={handleChange} required min="0" step="0.01" />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group mb-0">
                    <label>Payment Method</label>
                    <select name="payment_method" className="form-select" value={formData.payment_method} onChange={handleChange}>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Note</label>
                    <textarea className="form-control" name="note" rows={4} placeholder="Add a note..." value={formData.note} onChange={handleChange}></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-0">
                    <label>Attachment</label>
                    <input type="file" name="attachment" className="form-control" onChange={handleChange} accept=".jpg,.jpeg,.png,.pdf" />
                  </div>
                </div>
                <div className="col-12 mt-4 d-flex justify-content-end">
                  <div className="d-flex gap-2">
                    <Link to="/expenses" className="btn btn-secondary-custom d-flex align-items-center">Cancel</Link>
                    <button type="submit" className="btn btn-primary-custom" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Expense'}
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

export default AddExpense;
