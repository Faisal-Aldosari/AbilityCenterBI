import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import GeminiChatPanel from './GeminiChatPanel';
import ReportPreview from './ReportPreview';
import { useDataSources } from '../hooks/useDataSources';
import { useCharts } from '../hooks/useCharts';
import type { Report } from '../types';

const reportFormats = [
  { type: 'pdf', label: 'PDF Document', icon: DocumentTextIcon, color: '#DC2626' },
  { type: 'excel', label: 'Excel Spreadsheet', icon: TableCellsIcon, color: '#059669' },
];

export default function ReportsPage() {
  const { datasets } = useDataSources();
  const { charts } = useCharts();
  const [reports, setReports] = useState<Report[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const handleCreateReport = async () => {
    if (!reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newReport: Report = {
        id: `report_${Date.now()}`,
        name: reportName,
        description: reportDescription,
        format: selectedFormat,
        datasetIds: selectedDatasets,
        chartIds: selectedCharts,
        config: {
          includeCharts: selectedCharts.length > 0,
          includeRawData: selectedDatasets.length > 0,
          pageSize: 'A4',
          orientation: 'portrait',
        },
        status: 'completed',
        fileUrl: '#', // In a real app, this would be the actual file URL
        generatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Show preview instead of immediately adding to reports
      setPreviewReport(newReport);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmReport = (report: Report) => {
    setReports([...reports, report]);
    setShowPreview(false);
    setPreviewReport(null);
    
    // Reset form
    setReportName('');
    setReportDescription('');
    setSelectedDatasets([]);
    setSelectedCharts([]);
    setShowCreateForm(false);
  };

  const handleDownloadReport = (report: Report) => {
    // Show better download prompt
    const confirmed = confirm(`Ready to download "${report.name}"?\n\nFormat: ${report.format.toUpperCase()}\nIncludes: ${report.config.includeCharts ? 'Charts, ' : ''}${report.config.includeRawData ? 'Data Tables' : ''}\n\nClick OK to download now.`);
    
    if (confirmed) {
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${report.name}.${report.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert(`✅ "${report.name}.${report.format}" download started!`);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  const handlePreviewReport = (report: Report) => {
    setPreviewReport(report);
    setShowPreview(true);
  };

  const handleDownloadFromPreview = (format: 'pdf' | 'excel') => {
    if (previewReport) {
      // Update the report format if different
      const updatedReport = { ...previewReport, format };
      
      // If this is a new report (not in the list yet), add it
      if (!reports.find(r => r.id === previewReport.id)) {
        handleConfirmReport(updatedReport);
      }
      
      // Download the report
      alert(`Downloading ${previewReport.name}.${format}...`);
      setShowPreview(false);
    }
  };

  return (
    <DashboardLayout currentPage="reports" onShowAIChat={() => setShowAIPanel(true)}>
      <div className="py-8 px-8 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E2C6E' }}>
                Reports & Exports
              </h1>
              <p className="text-gray-600">
                Generate comprehensive reports from your data and visualizations
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* AI Chat Button */}
              <button
                onClick={() => setShowAIPanel(true)}
                className="px-4 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                }}
              >
                🤖 AI CHAT
              </button>

              {(datasets.length > 0 || charts.length > 0) && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center px-8 py-4 rounded-xl text-white font-bold transition-all duration-200 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-xl animate-pulse text-lg"
                  style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}
                >
                  <PlusIcon className="h-6 w-6 mr-3" />
                  📄 CREATE REPORT
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {datasets.length === 0 && charts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <DocumentArrowDownIcon className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-600">
              No Data or Charts Available
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You need data sources and charts before generating reports. Start by connecting your data and creating visualizations.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/data-sources"
                className="inline-flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
              >
                Connect Data
              </a>
              <a
                href="/charts"
                className="inline-flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #2E2C6E, #667eea)' }}
              >
                Create Charts
              </a>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Report Format Options */}
            {!showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {reportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.type}
                      onClick={() => {
                        setSelectedFormat(format.type as 'pdf' | 'excel');
                        setShowCreateForm(true);
                      }}
                      className="p-8 rounded-2xl transition-all duration-200 hover:transform hover:-translate-y-1"
                      style={{
                        background: `rgba(${parseInt(format.color.slice(1, 3), 16)}, ${parseInt(format.color.slice(3, 5), 16)}, ${parseInt(format.color.slice(5, 7), 16)}, 0.05)`,
                        border: `2px solid rgba(${parseInt(format.color.slice(1, 3), 16)}, ${parseInt(format.color.slice(3, 5), 16)}, ${parseInt(format.color.slice(5, 7), 16)}, 0.1)`,
                      }}
                    >
                      <Icon className="h-12 w-12 mx-auto mb-4" style={{ color: format.color }} />
                      <h3 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                        {format.label}
                      </h3>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* Create Report Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 mb-8"
                style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                    Generate New Report
                  </h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Name
                    </label>
                    <input
                      type="text"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Enter report description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format
                    </label>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'excel')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {reportFormats.map((format) => (
                        <option key={format.type} value={format.type}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {datasets.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Sources
                      </label>
                      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-3">
                        {datasets.map((dataset) => (
                          <label key={dataset.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={selectedDatasets.includes(dataset.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDatasets([...selectedDatasets, dataset.id]);
                                } else {
                                  setSelectedDatasets(selectedDatasets.filter(id => id !== dataset.id));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{dataset.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {charts.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Charts to Include
                      </label>
                      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-3">
                        {charts.map((chart) => (
                          <label key={chart.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={selectedCharts.includes(chart.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCharts([...selectedCharts, chart.id]);
                                } else {
                                  setSelectedCharts(selectedCharts.filter(id => id !== chart.id));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{chart.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleCreateReport}
                    disabled={isGenerating}
                    className="flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}
                  >
                    {isGenerating ? 'Generating Preview...' : 'Preview Report'}
                  </button>
                  
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Reports List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E2C6E' }}>
                Generated Reports ({reports.length})
              </h2>

              {reports.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <DocumentArrowDownIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No reports generated yet</p>
                  <p>Create your first report to export your insights</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reports.map((report) => {
                    const format = reportFormats.find(f => f.type === report.format);
                    const Icon = format?.icon || DocumentTextIcon;
                    const color = format?.color || '#2E2C6E';

                    return (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1"
                        style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                              style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg" style={{ color: '#2E2C6E' }}>
                                {report.name}
                              </h3>
                              {report.description && (
                                <p className="text-gray-600 text-sm mb-1">
                                  {report.description}
                                </p>
                              )}
                              <p className="text-gray-500 text-xs">
                                Generated {new Date(report.generatedAt).toLocaleDateString()} • {format?.label}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {report.datasetIds.length} datasets, {report.chartIds.length} charts
                              </p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {report.status}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handlePreviewReport(report)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Preview Report"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDownloadReport(report)}
                                className="text-gray-400 hover:text-green-600 transition-colors"
                                title="Download Report"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Report"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Report Preview Modal */}
        {showPreview && previewReport && (
          <ReportPreview
            report={previewReport}
            datasets={datasets}
            charts={charts}
            onClose={() => {
              setShowPreview(false);
              setPreviewReport(null);
            }}
            onDownload={handleDownloadFromPreview}
          />
        )}
      </div>

      {/* AI Assistant Panel */}
      <GeminiChatPanel
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
        datasets={datasets}
        onSuggestChart={(config: any) => {
          console.log('Chart suggestion:', config);
          window.location.href = '/charts';
        }}
        onGenerateReport={(config: any) => {
          console.log('Report generation:', config);
          // Auto-fill report form with AI suggestions
          if (config.name) setReportName(config.name);
          if (config.description) setReportDescription(config.description);
          setShowCreateForm(true);
        }}
      />
    </DashboardLayout>
  );
}
