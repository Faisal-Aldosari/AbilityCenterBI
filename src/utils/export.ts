import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Dashboard, ReportSettings } from '../types';

export const exportToPDF = async (
  dashboard: Dashboard,
  settings: ReportSettings
): Promise<void> => {
  try {
    const pdf = new jsPDF({
      orientation: settings.orientation,
      unit: 'mm',
      format: settings.pageSize,
    });

    // Add title page
    pdf.setFontSize(24);
    pdf.text(dashboard.name, 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
    
    if (dashboard.description) {
      pdf.text(dashboard.description, 20, 70);
    }

    // If including charts, capture dashboard content
    if (settings.includeCharts) {
      const dashboardElement = document.getElementById('dashboard-content');
      if (dashboardElement) {
        const canvas = await html2canvas(dashboardElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
    }

    // If including data, add data tables
    if (settings.includeData) {
      dashboard.datasets.forEach((dataset) => {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text(`Dataset: ${dataset.name}`, 20, 20);
        
        pdf.setFontSize(10);
        let yPosition = 40;
        
        // Add column headers
        const headers = dataset.columns.map(col => col.name);
        headers.forEach((header, i) => {
          pdf.text(header, 20 + (i * 30), yPosition);
        });
        
        yPosition += 10;
        
        // Add data rows (limit to first 50 rows)
        dataset.rows.slice(0, 50).forEach((row) => {
          headers.forEach((header, colIndex) => {
            const cellValue = String(row[header] || '');
            pdf.text(cellValue.substring(0, 15), 20 + (colIndex * 30), yPosition);
          });
          yPosition += 6;
          
          // Add new page if needed
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = 20;
          }
        });
      });
    }

    // Save the PDF
    pdf.save(`${dashboard.name}_report.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
