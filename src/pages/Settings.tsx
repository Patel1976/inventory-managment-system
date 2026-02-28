import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSave, FiSettings, FiMail, FiShield, FiDatabase, FiDollarSign, FiPackage, FiFileText } from 'react-icons/fi';
import { useSettings } from '../contexts/SettingsContext';

const Settings = () => {
  const { 
    currency, setCurrency,
    taxPercentage, setTaxPercentage,
    stockAlertThreshold, setStockAlertThreshold,
    invoicePrefix, setInvoicePrefix
  } = useSettings();

  const [companyName, setCompanyName] = useState('Inventory Management System');
  const [companyEmail, setCompanyEmail] = useState('admin@inventory.com');
  const [companyPhone, setCompanyPhone] = useState('+1 234 567 890');
  const [companyAddress, setCompanyAddress] = useState('123 Main Street, New York, NY 10001');
  const [timezone, setTimezone] = useState('utc-5');
  
  // Email settings
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEncryption, setSmtpEncryption] = useState('tls');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  
  // Security settings
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [loginNotify, setLoginNotify] = useState(false);

  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-header">
        <h4>Settings</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Settings</span>
        </div>
      </div>

      {savedMessage && (
        <div className="alert alert-success mb-4" role="alert">
          {savedMessage}
        </div>
      )}

      <div className="row g-4">
        {/* General Settings */}
        <div className="col-12 col-lg-6">
          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiSettings className="me-2" />General Settings</h5>
            
            <div className="form-group">
              <label>Company Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Company Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea 
                className="form-control" 
                rows={3} 
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group mb-0">
              <label>Timezone</label>
              <select 
                className="form-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="utc-5">Eastern Time (UTC-5)</option>
                <option value="utc-6">Central Time (UTC-6)</option>
                <option value="utc-8">Pacific Time (UTC-8)</option>
                <option value="utc+0">GMT (UTC+0)</option>
                <option value="utc+5.5">India Standard Time (UTC+5:30)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory & Invoice Settings */}
        <div className="col-12 col-lg-6">
          <div className="form-card mb-4">
            <h5 className="mb-4 d-flex align-items-center"><FiDollarSign className="me-2" />Currency & Tax</h5>
            
            <div className="row g-3">
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>Currency</label>
                  <select 
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
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
                  <input 
                    type="number" 
                    className="form-control" 
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-card mb-4">
            <h5 className="mb-4 d-flex align-items-center"><FiPackage className="me-2" />Stock Settings</h5>
            
            <div className="form-group mb-0">
              <label>Stock Alert Threshold</label>
              <input 
                type="number" 
                className="form-control" 
                value={stockAlertThreshold}
                onChange={(e) => setStockAlertThreshold(Number(e.target.value))}
                min="1"
                max="100"
              />
              <small className="text-muted">Alert when stock falls below this quantity</small>
            </div>
          </div>

          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiFileText className="me-2" />Invoice Settings</h5>
            
            <div className="form-group mb-0">
              <label>Invoice Prefix</label>
              <input 
                type="text" 
                className="form-control" 
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                maxLength={5}
                placeholder="e.g., INV"
              />
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
              <input 
                type="text" 
                className="form-control" 
                placeholder="smtp.example.com"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>SMTP Port</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>Encryption</label>
                  <select 
                    className="form-select"
                    value={smtpEncryption}
                    onChange={(e) => setSmtpEncryption(e.target.value)}
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <label>SMTP Username</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="username"
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
              />
            </div>
            <div className="form-group mb-0">
              <label>SMTP Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-outline-primary mt-4">Test Connection</button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="col-12 col-lg-6">
          <div className="form-card">
            <h5 className="mb-4 d-flex align-items-center"><FiShield className="me-2" />Security Settings</h5>
            
            <div className="form-check form-switch mb-3">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="twoFactor" 
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="twoFactor">Enable Two-Factor Authentication</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="sessionTimeout" 
                checked={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="sessionTimeout">Auto Logout After Inactivity</label>
            </div>
            <div className="form-check form-switch mb-0">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="loginNotify"
                checked={loginNotify}
                onChange={(e) => setLoginNotify(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="loginNotify">Email Login Notifications</label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="row mt-4">
        <div className="col-12">
          <button className="btn btn-primary-custom" onClick={handleSave}>
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
