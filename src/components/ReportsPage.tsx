import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  DocumentArrowDownIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import GeminiChatPanel from './GeminiChatPanel';
import type { Dataset } from '../types';

interface Report {
  id: string;
  name: string;
  type: 'pdf' | 'csv';
  description: string;
  createdAt: Date;
  size: string;
  status: 'ready' | 'generating' | 'failed';
  data?: any[];
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
    const loadReports = () => {
      try {
        const savedReports = localStorage.getItem('abi_reports');
        const savedDatasets = localStorage.getItem('abi_datasets');
        
        if (savedReports) {
          const parsedReports = JSON.parse(savedReports);
          // Convert date strings back to Date objects
          const reportsWithDates = parsedReports.map((report: any) => ({
            ...report,
            createdAt: new Date(report.createdAt)
          }));
          setReports(reportsWithDates);
        }
        if (savedDatasets) {
          setDatasets(JSON.parse(savedDatasets));
        }
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const saveReports = (newReports: Report[]) => {
    setReports(newReports);
    localStorage.setItem('abi_reports', JSON.stringify(newReports));
  };

  const handleGenerateReport = async (type: 'pdf' | 'csv') => {
    setShowGenerateModal(false);
    
    if (datasets.length === 0) {
      toast.error('Please connect at least one data source to generate reports');
      return;
    }

    const newReport: Report = {
      id: `report_${Date.now()}`,
      name: `${type.toUpperCase()} Report - ${new Date().toLocaleDateString()}`,
      type,
      description: `Generated ${type.toUpperCase()} report from ${datasets.length} dataset(s)`,
      createdAt: new Date(),
      size: `${Math.round(datasets.reduce((sum, d) => sum + d.rows.length, 0) * 0.5)}KB`,
      status: 'generating',
      data: [],
    };

    const updatedReports = [...reports, newReport];
    saveReports(updatedReports);

    try {
      // Generate the actual report
      if (type === 'pdf') {
        await generatePDFReport(datasets, newReport);
      } else {
        await generateCSVReport(datasets, newReport);
      }
      
      // Mark as completed
      const completedReport = { ...newReport, status: 'ready' as const };
      const finalReports = updatedReports.map(r => r.id === newReport.id ? completedReport : r);
      saveReports(finalReports);
      toast.success(`${type.toUpperCase()} report generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      // Mark as failed
      const failedReport = { ...newReport, status: 'failed' as const };
      const finalReports = updatedReports.map(r => r.id === newReport.id ? failedReport : r);
      saveReports(finalReports);
      toast.error(`Failed to generate ${type} report`);
    }
  };

  const generatePDFReport = async (datasets: any[], report: Report) => {
    const { exportToPDF } = await import('../utils/export');
    
    // Create a dashboard object for PDF export
    const dashboard = {
      id: report.id,
      name: report.name,
      description: report.description,
      datasets: datasets,
      charts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user'
    };

    const settings = {
      includeCharts: true,
      includeData: true,
      orientation: 'portrait' as const,
      pageSize: 'A4' as const,
    };

    await exportToPDF(dashboard, settings);
  };

  const generateCSVReport = async (datasets: any[], report: Report) => {
    const { exportToCSV } = await import('../utils/export');
    
    // Combine all datasets into one CSV
    const combinedData = datasets.reduce((acc: any[], dataset: any) => {
      return acc.concat(dataset.rows.map((row: any) => ({
        ...row,
        source_dataset: dataset.name,
      })));
    }, []);

    await exportToCSV(combinedData, report.name);
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    saveReports(updatedReports);
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      const reportData = report.data || [];

      if (report.type === 'csv') {
        // Generate CSV
        if (reportData.length === 0) {
          alert('No data to export');
          return;
        }

        const headers = Object.keys(reportData[0]);
        const csvContent = [
          headers.join(','),
          ...reportData.map(row => 
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
        link.download = `${report.name}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else if (report.type === 'pdf') {
        // Generate simple PDF using dynamic import
        const jsPDF = (await import('jspdf')).default;
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFontSize(20);
        pdf.text(report.name, 20, 30);
        
        // Add date
        pdf.setFontSize(12);
        pdf.text(`Generated: ${report.createdAt.toLocaleDateString()}`, 20, 45);
        
        // Add description
        pdf.setFontSize(14);
        pdf.text('Report Summary:', 20, 65);
        pdf.setFontSize(10);
        pdf.text(report.description, 20, 75);
        
        // Add data summary
        let yPosition = 95;
        pdf.text(`Total Records: ${reportData.length}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Datasets: ${datasets.length}`, 20, yPosition);
        
        // Add sample data if available
        if (reportData.length > 0) {
          yPosition += 20;
          pdf.setFontSize(12);
          pdf.text('Sample Data:', 20, yPosition);
          yPosition += 10;
          
          const sampleData = reportData.slice(0, 5);
          sampleData.forEach((item, index) => {
            if (yPosition > 250) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.setFontSize(8);
            pdf.text(`Record ${index + 1}:`, 20, yPosition);
            yPosition += 8;
            
            Object.entries(item).forEach(([key, value]) => {
              if (yPosition > 280) {
                pdf.addPage();
                yPosition = 20;
              }
              pdf.text(`  ${key}: ${String(value)}`, 25, yPosition);
              yPosition += 6;
            });
            yPosition += 5;
          });
        }
        
        pdf.save(`${report.name}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="reports">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="reports" onAIToggle={() => setShowAIPanel(!showAIPanel)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#2E2C6E' }}>
            Analytics <span style={{ color: '#F8941F' }}>Reports</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Generate and download comprehensive reports from your data
          </p>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
              color: 'white',
              border: 'none',
            }}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <DocumentArrowDownIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No reports generated</h3>
            <p className="text-gray-600">Create your first report to analyze your data</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
                      <DocumentArrowDownIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.type.toUpperCase()} Report</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{report.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span>Created: {report.createdAt.toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Size: {report.size}</span>
                    <span className="mx-2">•</span>
                    <span className={report.status === 'ready' ? 'text-green-600' : 'text-yellow-600'}>
                      {report.status === 'ready' ? '✅ Ready' : '⏳ Generating'}
                    </span>
                  </div>
                  {report.status === 'ready' && (
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
                      style={{ background: 'linear-gradient(135deg, #F8941F, #2E2C6E)' }}
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Report Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Report</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleGenerateReport('pdf')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📄</div>
                    <div>
                      <h3 className="font-medium text-gray-900">PDF Report</h3>
                      <p className="text-sm text-gray-600">Comprehensive report with charts and data</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleGenerateReport('csv')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">📊</div>
                    <div>
                      <h3 className="font-medium text-gray-900">CSV Export</h3>
                      <p className="text-sm text-gray-600">Raw data in spreadsheet format</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* AI Assistant Panel */}
        <GeminiChatPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          datasets={datasets}
          onSuggestChart={() => {}}
          onGenerateReport={() => setShowGenerateModal(true)}
        />
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;


