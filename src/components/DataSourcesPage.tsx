import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  TableCellsIcon,
  PlusIcon,
  LinkIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import DashboardLayout from './DashboardLayout';
import { useDataSources } from '../hooks/useDataSources';
import LoadingSpinner from './LoadingSpinner';

const DataSourcesPage: React.FC = () => {
  const {
    datasets,
    googleSheets,
    isLoadingSheets,
    addGoogleSheet,
    addCsvDataset,
    removeDataset,
    refreshDataset,
    isAddingGoogleSheet,
  } = useDataSources();

  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV must have headers and at least one row of data');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(val => val !== ''));

      if (rows.length === 0) {
        toast.error('CSV file is empty');
        return;
      }

      addCsvDataset(file, rows);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleGoogleSheetConnect = (sheetId: string) => {
    addGoogleSheet({ spreadsheetId: sheetId });
    setShowGoogleSheetsModal(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <DocumentIcon className="h-4 w-4" />;
      case 'googleSheets':
        return <TableCellsIcon className="h-4 w-4" />;
      default:
        return <TableCellsIcon className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'csv':
        return 'CSV File';
      case 'googleSheets':
        return 'Google Sheets';
      default:
        return 'Unknown';
    }
  };

  const previewDataset = datasets.find(d => d.id === showDataPreview);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Sources</h1>
          <p className="text-gray-600">Connect and manage your data sources</p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CSV Upload */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your CSV file or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Choose File
            </button>
          </div>

          {/* Google Sheets */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <TableCellsIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Google Sheets</h3>
            <p className="text-sm text-gray-600 mb-4">
              Connect to your Google Sheets for real-time data
            </p>
            <button
              onClick={() => setShowGoogleSheetsModal(true)}
              disabled={isLoadingSheets}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {isLoadingSheets ? 'Loading...' : 'Connect'}
            </button>
          </div>
        </div>

        {/* Data Sources List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Connected Data Sources</h2>
          </div>
          
          {datasets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <TableCellsIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No data sources connected</h3>
              <p className="text-sm text-gray-600">
                Upload a CSV file or connect to Google Sheets to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(dataset.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{dataset.name}</h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{getTypeLabel(dataset.type)}</span>
                          <span>{dataset.rows.length} rows</span>
                          <span>{dataset.columns.length} columns</span>
                          <span>Updated {formatDate(dataset.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDataPreview(dataset.id)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Preview data"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {dataset.type === 'googleSheets' && (
                        <button
                          onClick={() => refreshDataset(dataset)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Refresh data"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeDataset(dataset.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Remove dataset"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Google Sheets Modal */}
        <AnimatePresence>
          {showGoogleSheetsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Connect Google Sheets</h2>
                </div>
                <div className="p-6">
                  {isLoadingSheets ? (
                    <div className="flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : googleSheets.length === 0 ? (
                    <div className="text-center py-4">
                      <TableCellsIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">
                        No Google Sheets found. Make sure you've granted access to your Google Drive.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {googleSheets.map((sheet) => (
                        <button
                          key={sheet.id}
                          onClick={() => handleGoogleSheetConnect(sheet.id)}
                          disabled={isAddingGoogleSheet}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50 border border-gray-200"
                        >
                          <div className="flex items-center space-x-2">
                            <TableCellsIcon className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{sheet.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowGoogleSheetsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Preview Modal */}
        <AnimatePresence>
          {showDataPreview && previewDataset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {previewDataset.name} - Data Preview
                  </h2>
                  <button
                    onClick={() => setShowDataPreview(null)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 overflow-auto">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {previewDataset.columns.map((column) => (
                            <th
                              key={column.name}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {column.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewDataset.rows.slice(0, 10).map((row, index) => (
                          <tr key={index}>
                            {previewDataset.columns.map((column) => (
                              <td
                                key={column.name}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {row[column.name]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {previewDataset.rows.length > 10 && (
                    <div className="mt-4 text-sm text-gray-500">
                      Showing first 10 rows of {previewDataset.rows.length} total rows
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default DataSourcesPage;
