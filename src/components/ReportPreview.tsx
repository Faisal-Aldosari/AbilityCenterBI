import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import type { Report, Dataset, Chart } from '../types';

interface ReportPreviewProps {
  report: Report;
  datasets: Dataset[];
  charts: Chart[];
  onClose: () => void;
  onDownload: (format: 'pdf' | 'excel') => void;
}

export default function ReportPreview({ 
  report, 
  datasets, 
  charts, 
  onClose, 
  onDownload 
}: ReportPreviewProps) {
  const reportDatasets = datasets.filter(d => report.datasetIds.includes(d.id));
  const reportCharts = charts.filter(c => report.chartIds.includes(c.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <EyeIcon className="h-6 w-6 mr-3" style={{ color: '#2E2C6E' }} />
            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Report Preview
              </h2>
              <p className="text-sm text-gray-600">{report.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownload('pdf')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              PDF
            </button>
            
            <button
              onClick={() => onDownload('excel')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Excel
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 bg-white" style={{ minHeight: '297mm' }}>
            {/* Report Header */}
            <div className="mb-8 text-center border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E2C6E' }}>
                {report.name}
              </h1>
              {report.description && (
                <p className="text-gray-600 text-lg mb-4">{report.description}</p>
              )}
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                <span>Format: {report.format.toUpperCase()}</span>
                <span>Pages: 1-3</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Executive Summary
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  This report provides comprehensive insights from {reportDatasets.length} data source(s) 
                  and includes {reportCharts.length} visualization(s). The analysis covers key performance 
                  indicators, trends, and actionable insights to support strategic decision-making.
                </p>
              </div>
            </div>

            {/* Data Sources Section */}
            {report.config.includeRawData && reportDatasets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                  Data Sources Overview
                </h2>
                <div className="grid gap-4">
                  {reportDatasets.map((dataset) => (
                    <div key={dataset.id} className="border border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-3" style={{ color: '#2E2C6E' }}>
                        {dataset.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: '#F8941F' }}>
                            {dataset.rows.length}
                          </div>
                          <div className="text-sm text-gray-600">Records</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: '#2E2C6E' }}>
                            {dataset.columns.length}
                          </div>
                          <div className="text-sm text-gray-600">Columns</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: '#10B981' }}>
                            {dataset.type === 'googleSheets' ? 'Sheets' : 'CSV'}
                          </div>
                          <div className="text-sm text-gray-600">Type</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                            {new Date(dataset.lastUpdated).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">Last Updated</div>
                        </div>
                      </div>
                      
                      {/* Sample Data Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              {dataset.columns.slice(0, 5).map((column) => (
                                <th key={column.name} className="text-left py-2 px-3 font-medium text-gray-900">
                                  {column.name}
                                </th>
                              ))}
                              {dataset.columns.length > 5 && (
                                <th className="text-left py-2 px-3 font-medium text-gray-500">
                                  +{dataset.columns.length - 5} more
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {dataset.rows.slice(0, 3).map((row, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                {dataset.columns.slice(0, 5).map((column) => (
                                  <td key={column.name} className="py-2 px-3 text-gray-700">
                                    {String(row[column.name] || '').slice(0, 20)}
                                    {String(row[column.name] || '').length > 20 ? '...' : ''}
                                  </td>
                                ))}
                                {dataset.columns.length > 5 && (
                                  <td className="py-2 px-3 text-gray-500">...</td>
                                )}
                              </tr>
                            ))}
                            {dataset.rows.length > 3 && (
                              <tr>
                                <td colSpan={Math.min(dataset.columns.length, 6)} className="py-2 px-3 text-gray-500 text-center">
                                  ... and {dataset.rows.length - 3} more rows
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Section */}
            {report.config.includeCharts && reportCharts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                  Visualizations & Insights
                </h2>
                <div className="grid gap-6">
                  {reportCharts.map((chart) => {
                    const dataset = datasets.find(d => d.id === chart.datasetId);
                    return (
                      <div key={chart.id} className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-lg mb-3" style={{ color: '#2E2C6E' }}>
                          {chart.name}
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl text-gray-400">📊</span>
                              </div>
                              <p className="text-lg font-medium text-gray-600 mb-2">{chart.name}</p>
                              <p className="text-sm text-gray-500">
                                {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Data: {dataset?.name || 'Unknown Source'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <p><strong>Visualization Type:</strong> {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)}</p>
                          <p><strong>Data Source:</strong> {dataset?.name || 'Unknown'}</p>
                          <p><strong>Created:</strong> {new Date(chart.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Key Insights & Recommendations
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Data Quality Assessment</h4>
                  <p className="text-blue-800">
                    All connected data sources show high data quality with minimal missing values. 
                    Recommendation: Continue current data validation processes.
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                  <h4 className="font-semibold text-green-900 mb-2">Performance Trends</h4>
                  <p className="text-green-800">
                    Positive growth trends identified across key metrics. 
                    Recommendation: Expand successful strategies to other business areas.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                  <h4 className="font-semibold text-yellow-900 mb-2">Areas for Improvement</h4>
                  <p className="text-yellow-800">
                    Some metrics show potential for optimization. 
                    Recommendation: Implement targeted improvement initiatives in Q2.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>This report was generated by AbilityCenterBI</p>
              <p>Created by Faisal Aldosari '26</p>
              <p className="mt-2">
                Generated on {new Date(report.generatedAt).toLocaleDateString()} at {new Date(report.generatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
