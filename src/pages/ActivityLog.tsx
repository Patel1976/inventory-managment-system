import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common/Toast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { getActivityLogs, clearActivityLogs } from '../services/userService';

interface Activity {
  id: number;
  user: string;
  action: 'Add' | 'Edit' | 'Delete' | 'View';
  module: string;
  description: string;
  date: string;
  time: string;
}

const MODULES = ['Products', 'Sales', 'Purchases', 'Customers', 'Suppliers',
  'Expenses', 'Adjustments', 'Users', 'Settings', 'Reports'];

const ActivityLog = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const itemsPerPage = 15;

  const fetchLogs = (params?: object) => {
    getActivityLogs(params)
      .then(r => { setActivities(r.data.data); setCurrentPage(1); })
      .catch(() => {});
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleFilter = () => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (actionFilter) params.action = actionFilter;
    if (moduleFilter) params.module = moduleFilter;
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    fetchLogs(params);
  };

  const handleClear = () => {
    setSearchTerm(''); setActionFilter(''); setModuleFilter('');
    setFromDate(''); setToDate('');
    fetchLogs();
  };

  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      await clearActivityLogs();
      setActivities([]);
      showToast({ type: 'success', title: 'Cleared', message: 'Activity logs cleared successfully!' });
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Failed to clear logs!' });
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activities.slice(startIndex, startIndex + itemsPerPage);

  const actionBadge = (action: string) => {
    switch (action) {
      case 'Add':    return 'activity-badge add';
      case 'Edit':   return 'activity-badge edit';
      case 'Delete': return 'activity-badge delete';
      case 'View':   return 'activity-badge view';
      default:       return 'activity-badge';
    }
  };

  return (
    <div className="activity-log-page">
      <div className="page-header">
        <h4>Activity Log</h4>
        <div className="breadcrumb-wrapper">
          <Link to="/">Home</Link><span>/</span><span>Activity Log</span>
        </div>
      </div>

      {/* Filters */}
      <div className="data-card mb-4">
        <div className="data-card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FiSearch /></span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search user or description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFilter()}
                />
              </div>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Action</label>
              <select className="form-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
                <option value="">All Actions</option>
                <option value="Add">Add</option>
                <option value="Edit">Edit</option>
                <option value="Delete">Delete</option>
                <option value="View">View</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Module</label>
              <select className="form-select" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
                <option value="">All Modules</option>
                {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">From Date</label>
              <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">To Date</label>
              <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div className="col-12 col-md-1 d-flex gap-2 align-items-end">
              <button className="btn btn-primary-custom flex-fill d-flex align-items-center justify-content-center" onClick={handleFilter}>
                <FiFilter className="me-1" /> Filter
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleClear} title="Reset filters">
                <FiRefreshCw />
              </button>
              {isAdmin && (
                <button className="btn btn-outline-danger d-flex align-items-center" onClick={() => setShowClearDialog(true)} title="Clear all logs">
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-card">
        <div className="data-card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted">No activity logs found</td></tr>
                ) : paginatedData.map((activity, index) => (
                  <tr key={activity.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user)}&background=2e3192&color=fff&size=32`}
                          alt={activity.user}
                          style={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                        <span>{activity.user}</span>
                      </div>
                    </td>
                    <td><span className={actionBadge(activity.action)}>{activity.action}</span></td>
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
            <div className="text-muted">
              Showing {activities.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, activities.length)} of {activities.length} entries
            </div>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear All Logs"
        message="Are you sure you want to permanently delete all activity logs? This cannot be undone."
        confirmLabel="Clear All"
        onConfirm={handleClearLogs}
        onCancel={() => setShowClearDialog(false)}
        isLoading={isClearing}
        variant="danger"
      />
    </div>
  );
};

export default ActivityLog;
