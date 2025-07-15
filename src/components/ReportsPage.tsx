import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentArrowDownIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import { exportToCSV } from '../utils/export';


interface Report {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'excel';
  description: string;
  createdAt: Date;
  size: string;
  status: 'ready' | 'generating' | 'failed';
  data?: any[];
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    // Load reports from localStorage
    const loadReports = () => {
      try {
        const savedReports = localStorage.getItem('abi_reports');
        if (savedReports) {
          setReports(JSON.parse(savedReports));
        }
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleGenerateReport = async (type: 'pdf' | 'csv' | 'excel') => {
    setShowGenerateModal(false);
    
    // Get real data from uploaded datasets
    const datasets = JSON.parse(localStorage.getItem('abi_datasets') || '[]');
    let reportData: any[] = [];
    
    if (datasets.length > 0) {
      // Combine data from all datasets for the report
      reportData = datasets.reduce((acc: any[], dataset: any) => {
        return acc.concat(dataset.rows.map((row: any) => ({
          ...row,
          dataset: dataset.name,
          source: dataset.type
        })));
      }, []);
    }
    
    // If no real data, create a message indicating this
    if (reportData.length === 0) {
      reportData = [
        { 
          message: 'No data sources connected', 
          instruction: 'Please upload data from Google Sheets or CSV files to generate reports',
          timestamp: new Date().toISOString()
        }
      ];
    }

    const newReport: Report = {
      id: `report_${Date.now()}`,
      name: `Analytics Report - ${new Date().toLocaleDateString()}`,
      type,
      description: reportData.length > 1 ? 
        `Generated ${type.toUpperCase()} report with ${reportData.length} data points from ${datasets.length} dataset(s)` :
        `Generated ${type.toUpperCase()} report - No data sources connected`,
      createdAt: new Date(),
      size: reportData.length > 1 ? `${Math.round(reportData.length * 0.5)}KB` : '1KB',
      status: 'generating',
      data: reportData,
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('abi_reports', JSON.stringify(updatedReports));

    // Simulate report generation delay
    setTimeout(() => {
      const completedReport = { ...newReport, status: 'ready' as const };
      const finalReports = updatedReports.map(r => r.id === newReport.id ? completedReport : r);
      setReports(finalReports);
      localStorage.setItem('abi_reports', JSON.stringify(finalReports));
    }, 2000);
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('abi_reports', JSON.stringify(updatedReports));
  };

  const handleDownloadReport = (report: Report) => {
    try {
      const reportData = report.data || [];

      if (report.type === 'csv') {
        exportToCSV(reportData, report.name);
      } else if (report.type === 'excel') {
        // Use CSV export for now (Excel functionality can be enhanced)
        exportToCSV(reportData, `${report.name}_Excel`);
      } else if (report.type === 'pdf') {
        // Generate PDF with real data
        generateSimplePDF(reportData, report.name);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report. Please try again.');
    }
  };

  const generateSimplePDF = async (data: any[], filename: string) => {
    try {
      // Create a simple PDF with the data
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text(filename, 20, 20);
      
      // Add generation date
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Add data summary
      pdf.setFontSize(14);
      pdf.text('Data Summary:', 20, 55);
      
      let yPosition = 70;
      const pageHeight = 280;
      
      // Add data rows
      data.slice(0, 50).forEach((item) => {
        if (yPosition > pageHeight) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const entries = Object.entries(item);
        entries.forEach(([key, value]) => {
          if (yPosition > pageHeight) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.setFontSize(10);
          pdf.text(`${key}: ${String(value)}`, 20, yPosition);
          yPosition += 8;
        });
        
        yPosition += 5; // Space between records
      });
      
      // Save the PDF
      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const reportTypes = [
    { 
      type: 'pdf' as const, 
      name: 'PDF Report', 
      description: 'Complete dashboard with charts and data',
      icon: '📄'
    },
    { 
      type: 'csv' as const, 
      name: 'CSV Export', 
      description: 'Raw data in spreadsheet format',
      icon: '📊'
    },
    { 
      type: 'excel' as const, 
      name: 'Excel Workbook', 
      description: 'Multi-sheet workbook with analysis',
      icon: '📈'
    },
  ];

  if (loading) {
    return (
      <DashboardLayout currentPage="reports">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="reports">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
              <p className="text-lg text-gray-600">
                Generate and download reports from your data.
              </p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </motion.div>

        {/* Reports Grid */}
        {reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-16"
          >
            <DocumentArrowDownIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Reports Generated</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create comprehensive reports from your dashboards and data sources.
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Generate Your First Report</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-xl mr-4">
                      <DocumentArrowDownIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{report.name}</h3>
                      <p className="text-sm text-gray-500">
                        {report.type.toUpperCase()} Report
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{report.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{report.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      report.status === 'ready' ? 'text-green-600' :
                      report.status === 'generating' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {report.status === 'ready' ? '✅ Ready' :
                       report.status === 'generating' ? '⏳ Generating' :
                       '❌ Failed'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Generate Report Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Report</h2>
              
              <div className="space-y-4">
                {reportTypes.map((reportType) => (
                  <button
                    key={reportType.type}
                    onClick={() => handleGenerateReport(reportType.type)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{reportType.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{reportType.name}</h3>
                        <p className="text-sm text-gray-600">{reportType.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex space-x-4 mt-8">
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
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
