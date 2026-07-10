import Papa from 'papaparse';
import jsPDF from 'jspdf';

/**
 * Export leads array as a CSV file using PapaParse.
 * Filename: philleads_export_YYYY-MM-DD.csv
 * Includes specified fields only.
 * @param {Array} leads - Array of lead objects
 */
export const exportToCSV = (leads) => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `philleads_export_${date}.csv`;

  // Map to the requested B2B CSV columns
  const csvData = leads.map(lead => ({
    'Company Name': lead.company_name || '',
    'Industry': lead.industry || 'Other',
    'City': lead.city || '',
    'Size Tier': lead.size_tier || 'SMB (<50)',
    'Funding Stage': lead.funding_stage || 'Unknown',
    'Website': lead.domain || '',
    'Email': lead.email_contact || '',
    'Headcount': lead.headcount !== undefined && lead.headcount !== null ? Number(lead.headcount) : 0,
    'Created Date': lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''
  }));

  const csv = Papa.unparse(csvData);
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
 * Includes: Title, date, detailed summary statistics, top 5 industries, top 5 cities, and footer.
 * Filename: philleads_report_YYYY-MM-DD.pdf
 * @param {Array} leads - Array of lead objects
 */
export const exportToPDF = (leads) => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `philleads_report_${date}.pdf`;

  const doc = new jsPDF('p', 'mm', 'a4');

  // ── COMPUTE STATS ──
  const totalLeads = leads.length;
  
  const industries = leads.map(l => l.industry || 'Other');
  const uniqueIndustries = new Set(industries).size;
  
  const cities = leads.map(l => l.city).filter(c => c && c.trim() !== '');
  const uniqueCities = new Set(cities).size;

  const leadsWithHeadcount = leads.filter(l => l.headcount && l.headcount > 0);
  const avgHeadcount = leadsWithHeadcount.length > 0
    ? Math.round(leadsWithHeadcount.reduce((acc, l) => acc + Number(l.headcount), 0) / leadsWithHeadcount.length)
    : 0;

  // Counts per industry
  const industryCounts = {};
  industries.forEach(ind => {
    industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  });
  const sortedIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1]);
  const largestIndustry = sortedIndustries[0]?.[0] || 'None';
  const top5Industries = sortedIndustries.slice(0, 5);

  // Counts per city
  const cityCounts = {};
  cities.forEach(city => {
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });
  const sortedCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1]);
  const largestCity = sortedCities[0]?.[0] || 'None';
  const top5Cities = sortedCities.slice(0, 5);

  // ── DRAWING THE PDF ──
  // Decorative top bar (blue theme)
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 0, 210, 8, 'F');

  // Header Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Philippine B2B Lead Report', 20, 25);

  // Subheader
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  const generatedTime = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  doc.text(`Generated on: ${generatedTime}`, 20, 31);
  doc.text('PhilLeads B2B Intelligence Platform', 20, 36);

  // Line separator
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);

  // Section 1: Summary Statistics
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Summary Statistics', 20, 52);

  // Grid for stats box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(20, 57, 170, 55, 'F');
  doc.setDrawColor(241, 245, 249); // slate-100
  doc.rect(20, 57, 170, 55, 'S');

  // Stats Text Grid Layout
  doc.setFontSize(10);
  
  // Left Column
  doc.setFont('Helvetica', 'bold');
  doc.text('Total Leads:', 25, 66);
  doc.setFont('Helvetica', 'normal');
  doc.text(totalLeads.toLocaleString(), 65, 66);

  doc.setFont('Helvetica', 'bold');
  doc.text('Unique Sectors:', 25, 74);
  doc.setFont('Helvetica', 'normal');
  doc.text(uniqueIndustries.toLocaleString(), 65, 74);

  doc.setFont('Helvetica', 'bold');
  doc.text('Cities Covered:', 25, 82);
  doc.setFont('Helvetica', 'normal');
  doc.text(uniqueCities.toLocaleString(), 65, 82);

  doc.setFont('Helvetica', 'bold');
  doc.text('Average Headcount:', 25, 90);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${avgHeadcount.toLocaleString()} employees`, 65, 90);

  // Right Column
  doc.setFont('Helvetica', 'bold');
  doc.text('Largest Sector:', 110, 66);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${largestIndustry} (${industryCounts[largestIndustry] || 0} leads)`, 145, 66);

  doc.setFont('Helvetica', 'bold');
  doc.text('Largest City:', 110, 74);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${largestCity} (${cityCounts[largestCity] || 0} leads)`, 145, 74);

  // Line separator
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(20, 122, 190, 122);

  // Section 2: Top Industries & Top Cities Table/Layout
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Top 5 Industry Sectors', 20, 134);

  doc.setFontSize(10);
  doc.setFont('Helvetica', 'bold');
  doc.text('Sector Name', 25, 142);
  doc.text('Leads Count', 85, 142);
  doc.text('Percentage Share', 125, 142);
  
  doc.setLineWidth(0.3);
  doc.line(20, 145, 190, 145);

  doc.setFont('Helvetica', 'normal');
  top5Industries.forEach(([name, count], idx) => {
    const yPos = 152 + idx * 8;
    const share = ((count / totalLeads) * 100).toFixed(1);
    doc.text(name, 25, yPos);
    doc.text(count.toLocaleString(), 85, yPos);
    doc.text(`${share}%`, 125, yPos);
  });

  // Top Cities
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Top 5 Municipalities / Cities', 20, 204);

  doc.setFontSize(10);
  doc.text('City / Municipality', 25, 212);
  doc.text('Leads Count', 85, 212);
  doc.text('Percentage Share', 125, 212);
  
  doc.line(20, 215, 190, 215);

  doc.setFont('Helvetica', 'normal');
  top5Cities.forEach(([name, count], idx) => {
    const yPos = 222 + idx * 8;
    const share = ((count / totalLeads) * 100).toFixed(1);
    doc.text(name, 25, yPos);
    doc.text(count.toLocaleString(), 85, yPos);
    doc.text(`${share}%`, 125, yPos);
  });

  // Divider
  doc.line(20, 268, 190, 268);

  // Footer
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Generated by Philippine B2B Lead Generation Dashboard', 105, 278, { align: 'center' });
  doc.text('Confidential · For Internal Use Only', 105, 283, { align: 'center' });

  doc.save(filename);
};
