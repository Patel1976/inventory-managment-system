import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportXLSX = (filename: string, rows: Record<string, any>[]) => {
  if (!rows.length) return;
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportPDF = (filename: string, rows: Record<string, any>[]) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });
  doc.setFontSize(13);
  doc.text(filename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), 14, 15);
  autoTable(doc, {
    head: [headers],
    body: rows.map(r => headers.map(h => r[h] ?? '')),
    startY: 22,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });
  doc.save(`${filename}.pdf`);
};

// keep old name as alias for backward compat
export const exportCSV = exportXLSX;
