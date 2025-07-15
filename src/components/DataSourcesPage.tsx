import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  CloudArrowUpIcon,
  TableCellsIcon,
  ServerIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import type { Dataset } from '../types';
import { fetchGoogleSheetData } from '../services/googleSheets';
import { fetchBigQueryData } from '../services/bigQuery';

const DataSourcesPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'googleSheets' | 'bigQuery' | 'csv'>('googleSheets');
  const [formData, setFormData] = useState({
    name: '',
    spreadsheetId: '',
    sheetName: '',
    projectId: '',
    datasetId: '',
    tableId: '',
    csvFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved datasets from localStorage
    const savedDatasets = localStorage.getItem('abi_datasets');
    if (savedDatasets) {
      try {
        setDatasets(JSON.parse(savedDatasets));
      } catch (error) {
        console.error('Error loading datasets:', error);
      }
    }
  }, []);

  const saveDatasets = (newDatasets: Dataset[]) => {
    setDatasets(newDatasets);
    localStorage.setItem('abi_datasets', JSON.stringify(newDatasets));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let newDataset: Dataset;

      if (selectedType === 'googleSheets') {
        if (!formData.spreadsheetId) {
          throw new Error('Spreadsheet ID is required');
        }
        newDataset = await fetchGoogleSheetData(formData.spreadsheetId, formData.sheetName);
        newDataset.name = formData.name || newDataset.name;
      } else if (selectedType === 'bigQuery') {
        if (!formData.projectId || !formData.datasetId || !formData.tableId) {
          throw new Error('Project ID, Dataset ID, and Table ID are required');
        }
        newDataset = await fetchBigQueryData(formData.projectId, formData.datasetId, formData.tableId);
        newDataset.name = formData.name || newDataset.name;
      } else {
        // CSV handling
        if (!formData.csvFile) {
          throw new Error('CSV file is required');
        }
        newDataset = await processCSVFile(formData.csvFile, formData.name);
      }

      const updatedDatasets = [...datasets, newDataset];
      saveDatasets(updatedDatasets);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const processCSVFile = async (file: File, name: string): Promise<Dataset> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim());
          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
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
          });

          const columns = headers.map(header => ({
            name: header,
            type: inferColumnType(rows, header),
          }));

          const dataset: Dataset = {
            id: `csv_${Date.now()}`,
            name: name || file.name.replace('.csv', ''),
            type: 'googleSheets', // Use googleSheets type for CSV
            columns,
            rows,
            lastUpdated: new Date(),
          };

          resolve(dataset);
        } catch (error) {
          reject(new Error('Error parsing CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const inferColumnType = (rows: any[], columnName: string): 'string' | 'number' | 'date' | 'boolean' => {
    const sample = rows.slice(0, 10).map(row => row[columnName]).filter(val => val);
    
    // Check if all values are numbers
    if (sample.every(val => !isNaN(Number(val)) && val !== '')) {
      return 'number';
    }
    
    // Check if all values are dates
    if (sample.every(val => !isNaN(Date.parse(val)))) {
      return 'date';
    }
    
    // Check if all values are booleans
    if (sample.every(val => val.toLowerCase() === 'true' || val.toLowerCase() === 'false')) {
      return 'boolean';
    }
    
    return 'string';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      spreadsheetId: '',
      sheetName: '',
      projectId: '',
      datasetId: '',
      tableId: '',
      csvFile: null,
    });
    setError(null);
  };

  const deleteDataset = (id: string) => {
    const updatedDatasets = datasets.filter(dataset => dataset.id !== id);
    saveDatasets(updatedDatasets);
  };

  const refreshDataset = async (dataset: Dataset) => {
    setLoading(true);
    try {
      let refreshedDataset: Dataset;
      
      if (dataset.type === 'googleSheets' && dataset.spreadsheetId) {
        refreshedDataset = await fetchGoogleSheetData(dataset.spreadsheetId, dataset.sheetName);
        refreshedDataset.name = dataset.name;
        refreshedDataset.id = dataset.id;
      } else if (dataset.type === 'bigQuery' && dataset.datasetId && dataset.tableId) {
        refreshedDataset = await fetchBigQueryData(
          dataset.spreadsheetId || 'default-project',
          dataset.datasetId,
          dataset.tableId
        );
        refreshedDataset.name = dataset.name;
        refreshedDataset.id = dataset.id;
      } else {
        throw new Error('Cannot refresh this data source');
      }

      const updatedDatasets = datasets.map(d => d.id === dataset.id ? refreshedDataset : d);
      saveDatasets(updatedDatasets);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to refresh dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout currentPage="data">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Sources</h1>
                <p className="text-lg text-gray-600 mt-2">Connect and manage your data sources</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Add Data Source
              </motion.button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Connection Types */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Connect</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType('googleSheets');
                  setShowAddModal(true);
                }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center hover:bg-green-100 hover:border-green-300 transition-all duration-200"
              >
                <div className="bg-green-500 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TableCellsIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Google Sheets</h3>
                <p className="text-gray-600">Connect spreadsheets from Google Drive</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType('bigQuery');
                  setShowAddModal(true);
                }}
                className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
              >
                <div className="bg-blue-500 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ServerIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">BigQuery</h3>
                <p className="text-gray-600">Connect to Google BigQuery datasets</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType('csv');
                  setShowAddModal(true);
                }}
                className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center hover:bg-orange-100 hover:border-orange-300 transition-all duration-200"
              >
                <div className="bg-orange-500 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">CSV Upload</h3>
                <p className="text-gray-600">Upload CSV files from your computer</p>
              </motion.button>
            </div>
          </motion.section>

          {/* Datasets List */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Connected Sources</h2>
              <span className="text-sm text-gray-500">{datasets.length} sources connected</span>
            </div>

            {datasets.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No data sources connected</h3>
                <p className="text-gray-600 mb-6">Get started by connecting your first data source</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Add Data Source
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {datasets.map((dataset, index) => (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`rounded-xl p-3 ${
                          dataset.type === 'googleSheets' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {dataset.type === 'googleSheets' ? (
                            <TableCellsIcon className={`w-6 h-6 ${
                              dataset.type === 'googleSheets' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          ) : (
                            <ServerIcon className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{dataset.type.replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Columns</p>
                        <p className="text-lg font-semibold text-gray-900">{dataset.columns.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rows</p>
                        <p className="text-lg font-semibold text-gray-900">{dataset.rows.length}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {dataset.lastUpdated ? `Updated ${new Date(dataset.lastUpdated).toLocaleDateString()}` : 'Never synced'}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => refreshDataset(dataset)}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Refresh data"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteDataset(dataset.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete dataset"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>

        {/* Add Data Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add Data Source</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Data Source Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Data Source Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'googleSheets', label: 'Google Sheets', icon: TableCellsIcon },
                    { type: 'bigQuery', label: 'BigQuery', icon: ServerIcon },
                    { type: 'csv', label: 'CSV', icon: DocumentTextIcon },
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as any)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Give your data source a name"
                  />
                </div>

                {/* Google Sheets fields */}
                {selectedType === 'googleSheets' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Spreadsheet ID *
                      </label>
                      <input
                        type="text"
                        value={formData.spreadsheetId}
                        onChange={(e) => setFormData({ ...formData, spreadsheetId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Found in the Google Sheets URL after /d/
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sheet Name (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.sheetName}
                        onChange={(e) => setFormData({ ...formData, sheetName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Sheet1"
                      />
                    </div>
                  </>
                )}

                {/* BigQuery fields */}
                {selectedType === 'bigQuery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project ID *
                      </label>
                      <input
                        type="text"
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="my-project-id"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dataset ID *
                      </label>
                      <input
                        type="text"
                        value={formData.datasetId}
                        onChange={(e) => setFormData({ ...formData, datasetId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="analytics"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table ID *
                      </label>
                      <input
                        type="text"
                        value={formData.tableId}
                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="events"
                        required
                      />
                    </div>
                  </>
                )}

                {/* CSV fields */}
                {selectedType === 'csv' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CSV File *
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setFormData({ ...formData, csvFile: e.target.files?.[0] || null })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a CSV file with headers in the first row
                    </p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl">
                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DataSourcesPage;
