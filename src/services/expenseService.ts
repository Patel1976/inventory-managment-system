import api from '../lib/api';

export const getExpenses = () => api.get('/expenses');
export const createExpense = (data: FormData) => api.post('/create-expense', data);
export const updateExpense = (id: number, data: FormData) => api.post(`/update-expense/${id}`, data);
export const deleteExpense = (id: number) => api.delete(`/delete-expense/${id}`);

export const getExpenseCategories = () => api.get('/expense-categories');
export const createExpenseCategory = (data: object) => api.post('/create-expense-category', data);
export const updateExpenseCategory = (id: number, data: object) => api.put(`/update-expense-category/${id}`, data);
export const deleteExpenseCategory = (id: number) => api.delete(`/delete-expense-category/${id}`);
