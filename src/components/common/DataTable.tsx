import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  itemsPerPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  filters?: React.ReactNode;
}

function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchKeys = [],
  itemsPerPage = 10,
  showSearch = true,
  showPagination = true,
  filters
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Search filter
    if (searchTerm && searchKeys.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(term);
        })
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="data-table-wrapper">
      {/* Search and Filters */}
      {(showSearch || filters) && (
        <div className="data-card mb-4">
          <div className="data-card-body">
            <div className="row g-3 align-items-center">
              {showSearch && (
                <div className="col-12 col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FiSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              )}
              {filters}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th 
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="ms-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft />
                </button>
              </li>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <li 
                    key={page} 
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default DataTable;
