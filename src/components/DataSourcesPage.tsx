import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  TableCellsIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import GeminiChatPanel from './GeminiChatPanel';
import { useDataSources } from '../hooks/useDataSources';
import { fetchGoogleSheetData } from '../services/googleSheets';
import type { Dataset } from '../types';

export default function DataSourcesPage() {
  const { datasets, addDataset, removeDataset, loading } = useDataSources();
  const [uploadMode, setUploadMode] = useState<'csv' | 'sheets' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      // Progress simulation
      for (let i = 0; i <= 100; i += 20) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          const value = values[index] || '';
          // Try to parse as number
          const numValue = parseFloat(value);
          row[header] = !isNaN(numValue) && value !== '' ? numValue : value;
        });
        return row;
      });

      const columns = headers.map(header => ({
        name: header,
        type: inferColumnType(rows.map(row => row[header])) as 'string' | 'number' | 'date' | 'boolean',
      }));

      const dataset: Dataset = {
        id: `csv_${Date.now()}`,
        name: file.name.replace('.csv', ''),
        type: 'googleSheets',
        columns,
        rows,
        lastUpdated: new Date(),
      };

      addDataset(dataset);
      setUploadMode(null);
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Error uploading CSV file. Please check the format and try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSheetsConnect = async () => {
    if (!sheetsUrl.trim()) return;

    setIsUploading(true);
    try {
      // Extract spreadsheet ID from URL
      const urlMatch = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!urlMatch) {
        throw new Error('Invalid Google Sheets URL');
      }
      
      const spreadsheetId = urlMatch[1];
      const dataset = await fetchGoogleSheetData(spreadsheetId);
      addDataset(dataset);
      setSheetsUrl('');
      setUploadMode(null);
    } catch (error) {
      console.error('Error connecting to Google Sheets:', error);
      alert('Error connecting to Google Sheets. Please check the URL and permissions.');
    } finally {
      setIsUploading(false);
    }
  };

  const inferColumnType = (values: any[]): string => {
    const nonEmptyValues = values.filter(v => v !== '' && v != null);
    if (nonEmptyValues.length === 0) return 'string';

    const numericCount = nonEmptyValues.filter(v => !isNaN(parseFloat(v))).length;
    const dateCount = nonEmptyValues.filter(v => !isNaN(Date.parse(v))).length;

    if (numericCount / nonEmptyValues.length > 0.8) return 'number';
    if (dateCount / nonEmptyValues.length > 0.8) return 'date';
    return 'string';
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="data-sources" onShowAIChat={() => setShowAIPanel(true)}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="data-sources" onShowAIChat={() => setShowAIPanel(true)}>
      <div className="py-8 px-8 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E2C6E' }}>
            Data Sources
          </h1>
          <p className="text-gray-600">
            Connect your data from CSV files or Google Sheets to start creating insights
          </p>
        </motion.div>

        {/* Upload Options */}
        {!uploadMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <button
              onClick={() => setUploadMode('csv')}
              className="p-8 rounded-2xl transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{
                background: 'rgba(248, 148, 31, 0.05)',
                border: '2px solid rgba(248, 148, 31, 0.1)',
              }}
            >
              <CloudArrowUpIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#F8941F' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2E2C6E' }}>
                Upload CSV File
              </h3>
              <p className="text-gray-600">
                Upload a CSV file from your computer to import data
              </p>
            </button>

            <button
              onClick={() => setUploadMode('sheets')}
              className="p-8 rounded-2xl transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '2px solid rgba(16, 185, 129, 0.1)',
              }}
            >
              <TableCellsIcon className="h-12 w-12 mx-auto mb-4" style={{ color: '#10B981' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2E2C6E' }}>
                Connect Google Sheets
              </h3>
              <p className="text-gray-600">
                Import data directly from your Google Sheets
              </p>
            </button>
          </motion.div>
        )}

        {/* CSV Upload */}
        {uploadMode === 'csv' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 mb-8"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Upload CSV File
              </h3>
              <button
                onClick={() => setUploadMode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              {!isUploading ? (
                <div>
                  <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-4 text-gray-600">
                    Drop your CSV file here or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center px-6 py-3 rounded-xl text-white font-medium cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1"
                    style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Choose File
                  </label>
                </div>
              ) : (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-lg mb-4 text-gray-600">Uploading...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Google Sheets Connect */}
        {uploadMode === 'sheets' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 mb-8"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Connect Google Sheets
              </h3>
              <button
                onClick={() => setUploadMode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Sheets URL
                </label>
                <input
                  type="url"
                  value={sheetsUrl}
                  onChange={(e) => setSheetsUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleSheetsConnect}
                  disabled={!sheetsUrl.trim() || isUploading}
                  className="flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}
                >
                  {isUploading ? 'Connecting...' : 'Connect'}
                </button>
                
                <button
                  onClick={() => setUploadMode(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connected Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E2C6E' }}>
            Connected Sources ({datasets.length})
          </h2>

          {datasets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <TableCellsIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No data sources connected yet</p>
              <p>Upload a CSV file or connect Google Sheets to get started</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {datasets.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1"
                  style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                        style={{ background: 'linear-gradient(135deg, #2E2C6E, #667eea)' }}
                      >
                        <TableCellsIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: '#2E2C6E' }}>
                          {dataset.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {dataset.rows.length} rows, {dataset.columns.length} columns
                        </p>
                        <p className="text-gray-500 text-xs">
                          Updated {new Date(dataset.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this data source?')) {
                            removeDataset(dataset.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                        title="Delete data source"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {dataset.columns.slice(0, 5).map((column) => (
                      <span
                        key={column.name}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {column.name} ({column.type})
                      </span>
                    ))}
                    {dataset.columns.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{dataset.columns.length - 5} more
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
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
          window.location.href = '/reports';
        }}
      />
    </DashboardLayout>
  );
}
