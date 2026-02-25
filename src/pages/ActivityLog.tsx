import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Activity {
  id: string; user: string; action: 'Add' | 'Edit' | 'Delete' | 'View'; module: string; description: string; date: string; time: string;
}

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activities: Activity[] = [
    { id: '1', user: 'Admin User', action: 'Add', module: 'Products', description: 'Added new product "iPhone 15 Pro"', date: '2024-01-15', time: '14:32:00' },
    { id: '2', user: 'Staff Member', action: 'Edit', module: 'Sales', description: 'Updated sale INV-001', date: '2024-01-15', time: '14:15:00' },
    { id: '3', user: 'Admin User', action: 'Delete', module: 'Products', description: 'Deleted product "Old Item"', date: '2024-01-15', time: '13:45:00' },
    { id: '4', user: 'Admin User', action: 'Add', module: 'Purchases', description: 'Created purchase order PO-045', date: '2024-01-15', time: '12:30:00' },
    { id: '5', user: 'Staff Member', action: 'View', module: 'Reports', description: 'Viewed sales report', date: '2024-01-15', time: '11:20:00' },
    { id: '6', user: 'Admin User', action: 'Edit', module: 'Settings', description: 'Updated company settings', date: '2024-01-14', time: '16:45:00' },
    { id: '7', user: 'Staff Member', action: 'Add', module: 'Customers', description: 'Added new customer "John Doe"', date: '2024-01-14', time: '15:30:00' },
    { id: '8', user: 'Admin User', action: 'Edit', module: 'Products', description: 'Updated stock for "MacBook Pro"', date: '2024-01-14', time: '14:00:00' },
    { id: '9', user: 'Admin User', action: 'Delete', module: 'Expenses', description: 'Deleted expense entry #EXP-012', date: '2024-01-14', time: '11:15:00' },
    { id: '10', user: 'Staff Member', action: 'Add', module: 'Sales', description: 'Created new sale INV-002', date: '2024-01-13', time: '16:00:00' },
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || activity.action === actionFilter;
    const matchesModule = !moduleFilter || activity.module === moduleFilter;
    return matchesSearch && matchesAction && matchesModule;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, actionFilter, moduleFilter]);

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'Add': return 'activity-badge add';
      case 'Edit': return 'activity-badge edit';
      case 'Delete': return 'activity-badge delete';
      case 'View': return 'activity-badge view';
      default: return 'activity-badge';
    }
  };

  const modules = ['Products', 'Sales', 'Purchases', 'Customers', 'Suppliers', 'Expenses', 'Reports', 'Settings'];

  return (
    <div className="activity-log-page">
      <div className="page-header">
        <h4><FiActivity className="me-2" />Activity Log</h4>
        <div className="breadcrumb-wrapper"><Link to="/">Home</Link><span>/</span><span>Activity Log</span></div>
      </div>

      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group"><span className="input-group-text bg-white border-end-0"><FiSearch /></span><input type="text" className="form-control border-start-0" placeholder="Search activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="">All Actions</option><option value="Add">Add</option><option value="Edit">Edit</option><option value="Delete">Delete</option><option value="View">View</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select" value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                <option value="">All Modules</option>
                {modules.map(mod => <option key={mod} value={mod}>{mod}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setSearchTerm(''); setActionFilter(''); setModuleFilter(''); }}><FiFilter className="me-1" /> Clear</button>
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>User</th><th>Action</th><th>Module</th><th>Description</th><th>Date</th><th>Time</th></tr></thead>
              <tbody>
                {paginatedData.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user)}&background=2e3192&color=fff&size=32`} alt={activity.user} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <span>{activity.user}</span>
                      </div>
                    </td>
                    <td><span className={getActionBadgeClass(activity.action)}>{activity.action}</span></td>
                    <td>{activity.module}</td>
                    <td>{activity.description}</td>
                    <td>{activity.date}</td>
                    <td>{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing {filteredActivities.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredActivities.length)} of {filteredActivities.length} entries</div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FiChevronLeft /></button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><FiChevronRight /></button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
