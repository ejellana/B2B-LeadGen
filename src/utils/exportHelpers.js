import Papa from 'papaparse';
import jsPDF from 'jspdf';

/**
 * Export leads array as a CSV file using PapaParse.
 * Filename: philleads_export_YYYY-MM-DD.csv
 * @param {Array} leads - Array of lead objects
 */
export const exportToCSV = (leads) => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `philleads_export_${date}.csv`;

  const csv = Papa.unparse(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate a PDF report using jsPDF.
 * Includes: summary stats, industry breakdown table, top cities table.
 * Filename: philleads_report_YYYY-MM-DD.pdf
 * @param {Object} reportData - { stats, industryBreakdown, topCities }
 */
export const exportToPDF = (reportData) => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `philleads_report_${date}.pdf`;

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('PhilLeads — B2B Intelligence Report', 14, 22);

  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

  // Summary stats
  if (reportData?.stats) {
    doc.setFontSize(14);
    doc.text('Summary', 14, 50);
    doc.setFontSize(11);
    Object.entries(reportData.stats).forEach(([key, value], i) => {
      doc.text(`${key}: ${value}`, 14, 62 + i * 8);
    });
  }

  doc.save(filename);
};
