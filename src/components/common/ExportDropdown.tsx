import { useState, useRef, useEffect } from 'react';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import { exportXLSX, exportPDF } from '../../lib/exportCSV';

interface Props {
  filename: string;
  rows: Record<string, any>[];
}

const ExportDropdown = ({ filename, rows }: Props) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }
    setOpen(o => !o);
  };

  return (
    <div className="me-2" ref={ref} style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        className="btn btn-outline-secondary d-flex align-items-center"
        onClick={handleToggle}
        type="button"
      >
        <FiDownload className="me-1" /> Export <FiChevronDown className="ms-1" size={14} />
      </button>
      {open && (
        <ul
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
            background: 'var(--card-bg, #fff)',
            border: '1px solid var(--border-color, #dee2e6)',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            minWidth: '140px',
            padding: '4px 0',
            margin: 0,
            listStyle: 'none',
          }}
        >
          <li>
            <button
              className="dropdown-item"
              style={{ width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              onClick={() => { exportXLSX(filename, rows); setOpen(false); }}
            >
              📊 Excel (.xlsx)
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              style={{ width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              onClick={() => { exportPDF(filename, rows); setOpen(false); }}
            >
              📄 PDF (.pdf)
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ExportDropdown;
