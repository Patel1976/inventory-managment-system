import axios from 'axios';

const BASE = 'http://localhost:8000/api/admin';

export const forgotPassword = (email: string) =>
  axios.post(`${BASE}/forgot-password`, { email });

export const validateResetToken = (email: string, token: string) =>
  axios.post(`${BASE}/validate-reset-token`, { email, token });

export const resetPassword = (email: string, token: string, password: string) =>
  axios.post(`${BASE}/reset-password`, {
    email,
    token,
    password,
    password_confirmation: password,
  });
