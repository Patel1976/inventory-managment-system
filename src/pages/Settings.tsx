import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSave, FiSettings, FiMail, FiShield, FiDollarSign, FiPackage, FiFileText, FiDroplet } from 'react-icons/fi';
import { useSettings } from '../contexts/useSettings';
import { useTheme } from '../contexts/ThemeContext';
import { getSettings, updateSettings, testEmailConnection } from '../services/settingsService';

const Settings = () => {
  const { setCurrency, setTaxPercentage, setStockAlertThreshold, setInvoicePrefix } = useSettings();
  const { primaryColor, setPrimaryColor } = useTheme();

  // General
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [timezone, setTimezone] = useState('utc-5');
  // Currency & Tax
  const [currency, setCurrencyLocal] = useState('USD');
  const [taxPercentage, setTaxPercentageLocal] = useState(10);
  // Stock
  const [stockAlertThreshold, setStockAlertThresholdLocal] = useState(10);
  // Invoice
  const [invoicePrefix, setInvoicePrefixLocal] = useState('INV');
  // Email
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEncryption, setSmtpEncryption] = useState('tls');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [loginNotify, setLoginNotify] = useState(false);

  const [savedMessage, setSavedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => {
    getSettings()
      .then((res) => {
        const d = res.data?.data || {};
        const g = d.general || {};
        const ct = d.currency_tax || {};
        const st = d.stock || {};
        const inv = d.invoice || {};
        const em = d.email || {};
        const sec = d.security || {};

        setCompanyName(g.company_name || '');
        setCompanyEmail(g.company_email || '');
        setCompanyPhone(g.company_phone || '');
        setCompanyAddress(g.company_address || '');
        setTimezone(g.timezone || 'utc-5');
        setCurrencyLocal(ct.currency || 'USD');
        setTaxPercentageLocal(Number(ct.tax_percentage) || 10);
        setStockAlertThresholdLocal(Number(st.stock_alert_threshold) || 10);
        setInvoicePrefixLocal(inv.invoice_prefix || 'INV');
        setSmtpHost(em.smtp_host || '');
        setSmtpPort(em.smtp_port || '587');
        setSmtpEncryption(em.smtp_encryption || 'tls');
        setSmtpUsername(em.smtp_username || '');
        setTwoFactor(sec.two_factor_auth === '1' || sec.two_factor_auth === true);
        setSessionTimeout(sec.session_timeout === '1' || sec.session_timeout === true);
        setLoginNotify(sec.login_notification === '1' || sec.login_notification === true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      await updateSettings({
        company_name: companyName,
        company_email: companyEmail,
        company_phone: companyPhone,
        company_address: companyAddress,
        timezone,
        currency: currency,
        tax_percentage: taxPercentage,
        stock_alert_threshold: stockAlertThreshold,
        invoice_prefix: invoicePrefix,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_encryption: smtpEncryption,
        smtp_username: smtpUsername,
        ...(smtpPassword ? { smtp_password: smtpPassword } : {}),
        primary_color: primaryColor,
      two_factor_auth: twoFactor,
        session_timeout: sessionTimeout,
        login_notification: loginNotify,
      });
      // Sync context
      setCurrency(currency);
      setTaxPercentage(taxPercentage);
      setStockAlertThreshold(stockAlertThreshold);
      setInvoicePrefix(invoicePrefix);
      setPrimaryColor(primaryColor);
      setSavedMessage('Settings saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch {
      setErrorMessage('Failed to save settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setErrorMessage('');
    try {
      const res = await testEmailConnection({ smtp_host: smtpHost, smtp_port: smtpPort, smtp_encryption: smtpEncryption, smtp_username: smtpUsername, smtp_password: smtpPassword });
      setSavedMessage(res.data?.message || 'SMTP connection successful!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'SMTP connection failed.';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h4>Settings</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Settings</span>
        </div>
      </div>

      {savedMessage && <div className="alert alert-success mb-4">{savedMessage}</div>}
      {errorMessage && <div className="alert alert-danger mb-4">{errorMessage}</div>}

      <div className="row g-4">
        {/* General Settings */}
        <div className="col-12 col-lg-6">
          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiSettings className="me-2" />General Settings</h5>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company Email</label>
              <input type="email" className="form-control" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-control" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-control" rows={3} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
            </div>
            <div className="form-group mb-0">
              <label>Timezone</label>
              <select className="form-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="utc-5">Eastern Time (UTC-5)</option>
                <option value="utc-6">Central Time (UTC-6)</option>
                <option value="utc-8">Pacific Time (UTC-8)</option>
                <option value="utc+0">GMT (UTC+0)</option>
                <option value="utc+5.5">India Standard Time (UTC+5:30)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Currency, Stock, Invoice */}
        <div className="col-12 col-lg-6">
          <div className="form-card mb-4">
            <h5 className="mb-4 d-flex align-items-center"><FiDollarSign className="me-2" />Currency & Tax</h5>
            <div className="row g-3">
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>Currency</label>
                  <select className="form-select" value={currency} onChange={(e) => setCurrencyLocal(e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>Tax Percentage (%)</label>
                  <input type="number" className="form-control" value={taxPercentage} onChange={(e) => setTaxPercentageLocal(Number(e.target.value))} min="0" max="100" step="0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-card mb-4">
            <h5 className="mb-4 d-flex align-items-center"><FiPackage className="me-2" />Stock Settings</h5>
            <div className="form-group mb-0">
              <label>Stock Alert Threshold</label>
              <input type="number" className="form-control" value={stockAlertThreshold} onChange={(e) => setStockAlertThresholdLocal(Number(e.target.value))} min="1" max="100" />
              <small className="text-muted">Alert when stock falls below this quantity</small>
            </div>
          </div>

          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiFileText className="me-2" />Invoice Settings</h5>
            <div className="form-group mb-0">
              <label>Invoice Prefix</label>
              <input type="text" className="form-control" value={invoicePrefix} onChange={(e) => setInvoicePrefixLocal(e.target.value.toUpperCase())} maxLength={5} placeholder="e.g., INV" />
              <small className="text-muted">Preview: {invoicePrefix}-001, {invoicePrefix}-002, etc.</small>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="col-12 col-lg-6">
          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiMail className="me-2" />Email Settings</h5>
            <div className="form-group">
              <label>SMTP Host</label>
              <input type="text" className="form-control" placeholder="smtp.example.com" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>SMTP Port</label>
                  <input type="text" className="form-control" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>Encryption</label>
                  <select className="form-select" value={smtpEncryption} onChange={(e) => setSmtpEncryption(e.target.value)}>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <label>SMTP Username</label>
              <input type="text" className="form-control" value={smtpUsername} onChange={(e) => setSmtpUsername(e.target.value)} />
            </div>
            <div className="form-group mb-0">
              <label>SMTP Password</label>
              <input type="password" className="form-control" placeholder="Leave blank to keep current" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} />
            </div>
            <button className="btn btn-outline-primary mt-4" onClick={handleTestEmail} disabled={testingEmail}>
              {testingEmail ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Appearance + Security */}
        <div className="col-12 col-lg-6">
          <div className="form-card mb-4">
            <h5 className="mb-4 d-flex align-items-center"><FiDroplet className="me-2" />Appearance</h5>
            <label className="form-label">Theme Color</label>
            <div className="d-flex flex-wrap gap-3 mt-2">
              {([
                { key: 'indigo',  hex: '#6366f1', label: 'Indigo'  },
                { key: 'violet',  hex: '#8b5cf6', label: 'Violet'  },
                { key: 'rose',    hex: '#f43f5e', label: 'Rose'    },
                { key: 'cyan',    hex: '#06b6d4', label: 'Cyan'    },
                { key: 'emerald', hex: '#10b981', label: 'Emerald' },
                { key: 'amber',   hex: '#f59e0b', label: 'Amber'   },
                { key: 'sky',     hex: '#0ea5e9', label: 'Sky'     },
                { key: 'fuchsia', hex: '#d946ef', label: 'Fuchsia' },
              ] as const).map(({ key, hex, label }) => (
                <button
                  key={key}
                  onClick={() => setPrimaryColor(key)}
                  title={label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: hex,
                    border: primaryColor === key ? '3px solid var(--text-primary)' : '3px solid transparent',
                    outline: primaryColor === key ? `3px solid ${hex}` : 'none',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.15s',
                    transform: primaryColor === key ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <small className="text-muted mt-3 d-block">Current: <strong>{primaryColor.charAt(0).toUpperCase() + primaryColor.slice(1)}</strong></small>
          </div>

          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiShield className="me-2" />Security Settings</h5>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="twoFactor" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
              <label className="form-check-label" htmlFor="twoFactor">Enable Two-Factor Authentication</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="sessionTimeout" checked={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.checked)} />
              <label className="form-check-label" htmlFor="sessionTimeout">Auto Logout After Inactivity</label>
            </div>
            <div className="form-check form-switch mb-0">
              <input className="form-check-input" type="checkbox" id="loginNotify" checked={loginNotify} onChange={(e) => setLoginNotify(e.target.checked)} />
              <label className="form-check-label" htmlFor="loginNotify">Email Login Notifications</label>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handleSave} disabled={saving}>
            <FiSave />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
