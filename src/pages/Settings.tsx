import { Link } from 'react-router-dom';
import { FiSave, FiSettings, FiMail, FiShield, FiDatabase } from 'react-icons/fi';

const Settings = () => {
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

      <div className="row g-4">
        {/* General Settings */}
        <div className="col-12 col-lg-6">
          <div className="form-card">
            <h5 className="mb-4"><FiSettings className="me-2" />General Settings</h5>
            
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" className="form-control" defaultValue="Inventory Management System" />
            </div>
            <div className="form-group">
              <label>Company Email</label>
              <input type="email" className="form-control" defaultValue="admin@inventory.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-control" defaultValue="+1 234 567 890" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea className="form-control" rows={3} defaultValue="123 Main Street, New York, NY 10001"></textarea>
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select className="form-select">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label>Timezone</label>
              <select className="form-select">
                <option value="utc-5">Eastern Time (UTC-5)</option>
                <option value="utc-6">Central Time (UTC-6)</option>
                <option value="utc-8">Pacific Time (UTC-8)</option>
              </select>
            </div>
            <button className="btn btn-primary-custom mt-4">
              <FiSave className="me-2" /> Save Changes
            </button>
          </div>
        </div>

        {/* Email & Notifications */}
        <div className="col-12 col-lg-6">
          <div className="form-card mb-4">
            <h5 className="mb-4"><FiMail className="me-2" />Email Settings</h5>
            
            <div className="form-group">
              <label>SMTP Host</label>
              <input type="text" className="form-control" placeholder="smtp.example.com" />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>SMTP Port</label>
                  <input type="text" className="form-control" placeholder="587" />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group mb-0">
                  <label>Encryption</label>
                  <select className="form-select">
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <label>SMTP Username</label>
              <input type="text" className="form-control" placeholder="username" />
            </div>
            <div className="form-group mb-0">
              <label>SMTP Password</label>
              <input type="password" className="form-control" placeholder="password" />
            </div>
            <button className="btn btn-outline-primary mt-4">Test Connection</button>
          </div>

          <div className="form-card">
            <h5 className="mb-4"><FiShield className="me-2" />Security Settings</h5>
            
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="twoFactor" defaultChecked />
              <label className="form-check-label" htmlFor="twoFactor">Enable Two-Factor Authentication</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="sessionTimeout" defaultChecked />
              <label className="form-check-label" htmlFor="sessionTimeout">Auto Logout After Inactivity</label>
            </div>
            <div className="form-check form-switch mb-0">
              <input className="form-check-input" type="checkbox" id="loginNotify" />
              <label className="form-check-label" htmlFor="loginNotify">Email Login Notifications</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
