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
  XMarkIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import GeminiChatPanel from './GeminiChatPanel';
import type { Dataset } from '../types';
import { fetchGoogleSheetData } from '../services/googleSheets';
import { fetchBigQueryData } from '../services/bigQuery';

const DataSourcesPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
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
  const [csvPreview, setCsvPreview] = useState<{data: any[], columns: any[]} | null>(null);

  useEffect(() => {
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
    setSelectedType('googleSheets');
    setError(null);
    setCsvPreview(null);
  };

  const previewCSVFile = async (file: File) => {
    try {
      const preview = await new Promise<{data: any[], columns: any[]}>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const csv = e.target?.result as string;
            const lines = csv.split('\n').filter(line => line.trim()).slice(0, 6); // First 5 rows + header
            
            if (lines.length < 2) {
              reject(new Error('CSV preview failed'));
              return;
            }

            const parseCSVLine = (line: string): string[] => {
              const result: string[] = [];
              let current = '';
              let inQuotes = false;
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = line[i + 1];
                
                if (char === '"') {
                  if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                  } else {
                    inQuotes = !inQuotes;
                  }
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              
              result.push(current.trim());
              return result;
            };

            const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
            const rows = lines.slice(1).map(line => {
              const values = parseCSVLine(line);
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
              });
              return row;
            });

            const columns = headers.map(header => ({ name: header, type: 'string' }));
            resolve({ data: rows, columns });
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
      
      setCsvPreview(preview);
    } catch (error) {
      console.error('Error previewing CSV:', error);
    }
  };

  const processCSVFile = async (file: File, name: string): Promise<Dataset> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          if (!csv || csv.trim().length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }

          // Enhanced CSV parsing with better quote handling
          const parseCSVLine = (line: string): string[] => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              const nextChar = line[i + 1];
              
              if (char === '"') {
                if (inQuotes && nextChar === '"') {
                  current += '"';
                  i++; // Skip next quote
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            
            result.push(current.trim());
            return result;
          };

          const lines = csv.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            reject(new Error('CSV file must have headers and at least one data row'));
            return;
          }

          const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
          
          if (headers.length === 0 || headers.every(h => !h)) {
            reject(new Error('CSV file must have valid column headers'));
            return;
          }

          const rows = lines.slice(1)
            .map(line => parseCSVLine(line))
            .filter(values => values.length > 0 && values.some(val => val.trim()))
            .map(values => {
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
              });
              return row;
            });

          if (rows.length === 0) {
            reject(new Error('CSV file contains no valid data rows'));
            return;
          }

          // Auto-detect column types
          const columns = headers.map(header => {
            const sampleValues = rows.slice(0, 10).map(row => row[header]).filter(val => val);
            
            // Check if numeric
            const isNumeric = sampleValues.length > 0 && sampleValues.every(val => !isNaN(Number(val)) && val !== '');
            
            // Check if date
            const isDate = sampleValues.length > 0 && sampleValues.every(val => !isNaN(Date.parse(val)));
            
            let type: 'string' | 'number' | 'date' = 'string';
            if (isNumeric) {
              type = 'number';
            } else if (isDate && !isNumeric) {
              type = 'date';
            }

            return {
              name: header,
              type,
            };
          });

          const dataset: Dataset = {
            id: `csv_${Date.now()}`,
            name: name || file.name.replace('.csv', ''),
            type: 'googleSheets',
            columns,
            rows,
            lastUpdated: new Date(),
          };

          resolve(dataset);
        } catch (error) {
          reject(new Error(`Error parsing CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
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
          throw new Error('All BigQuery fields are required');
        }
        newDataset = await fetchBigQueryData(formData.projectId, formData.datasetId, formData.tableId);
        newDataset.name = formData.name || newDataset.name;
      } else {
        if (!formData.csvFile) {
          throw new Error('Please select a CSV file');
        }
        newDataset = await processCSVFile(formData.csvFile, formData.name);
      }

      const updatedDatasets = [...datasets, newDataset];
      saveDatasets(updatedDatasets);
      setShowAddModal(false);
      resetForm();
      console.log('Dataset added successfully:', newDataset);
    } catch (error) {
      console.error('Error adding dataset:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteDataset = (id: string) => {
    const updatedDatasets = datasets.filter(dataset => dataset.id !== id);
    saveDatasets(updatedDatasets);
  };

  return (
    <DashboardLayout currentPage="data" onAIToggle={() => setShowAIPanel(!showAIPanel)}>
      <div className="space-y-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2E2C6E' }}>
            Data <span style={{ color: '#F8941F' }}>Sources</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Connect your data from Google Sheets, upload CSV files, or connect to BigQuery for powerful analytics.
          </p>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
              color: 'white',
              border: 'none',
              boxShadow: '0 10px 30px rgba(248, 148, 31, 0.3)'
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Data Source
          </button>
        </motion.div>

        {/* Quick Connect Options */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#2E2C6E' }}>Quick Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedType('googleSheets');
                setShowAddModal(true);
              }}
              className="bg-white p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #34D399, #10B981)' }}>
                <TableCellsIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2E2C6E' }}>Google Sheets</h3>
              <p className="text-gray-600">Connect spreadsheets from Google Drive</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedType('bigQuery');
                setShowAddModal(true);
              }}
              className="bg-white p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}>
                <ServerIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2E2C6E' }}>BigQuery</h3>
              <p className="text-gray-600">Connect to Google BigQuery datasets</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedType('csv');
                setShowAddModal(true);
              }}
              className="bg-white p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}>
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2E2C6E' }}>CSV Upload</h3>
              <p className="text-gray-600">Upload CSV files from your computer</p>
            </motion.button>
          </div>
        </motion.section>

        {/* Connected Datasets */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#2E2C6E' }}>Connected Data Sources</h2>
          
          {datasets.length === 0 ? (
            <div className="text-center py-12">
              <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Sources Connected</h3>
              <p className="text-gray-600 mb-6">Start by connecting your first data source to begin analyzing your data.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {datasets.map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl"
                  style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                           style={{ background: 'linear-gradient(135deg, #F8941F, #2E2C6E)' }}>
                        <TableCellsIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#2E2C6E' }}>{dataset.name}</h3>
                        <p className="text-sm text-gray-600">
                          {dataset.rows.length} rows • {dataset.columns.length} columns
                        </p>
                        <p className="text-xs text-gray-500">
                          Last updated: {dataset.lastUpdated ? new Date(dataset.lastUpdated).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <button
                        onClick={() => deleteDataset(dataset.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Data Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold" style={{ color: '#2E2C6E' }}>
                        {dataset.columns.filter(col => col.type === 'number').length}
                      </div>
                      <div className="text-xs text-gray-600">Numeric</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold" style={{ color: '#2E2C6E' }}>
                        {dataset.columns.filter(col => col.type === 'date').length}
                      </div>
                      <div className="text-xs text-gray-600">Date</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-semibold" style={{ color: '#2E2C6E' }}>
                        {dataset.columns.filter(col => col.type === 'string').length}
                      </div>
                      <div className="text-xs text-gray-600">Text</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Add Data Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" style={{ color: '#2E2C6E' }}>Add Data Source</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

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
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedType === type
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Give your data source a name"
                  />
                </div>

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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Sheet1"
                      />
                    </div>
                  </>
                )}

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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="events"
                        required
                      />
                    </div>
                  </>
                )}

                {selectedType === 'csv' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CSV File *
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, csvFile: file });
                        if (file) {
                          previewCSVFile(file);
                        } else {
                          setCsvPreview(null);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a CSV file with headers in the first row
                    </p>

                    {/* CSV Preview */}
                    {csvPreview && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <h4 className="text-sm font-semibold mb-2" style={{ color: '#2E2C6E' }}>
                          Preview ({csvPreview.data.length} rows shown)
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b">
                                {csvPreview.columns.slice(0, 4).map((col, index) => (
                                  <th key={index} className="text-left p-2 font-medium text-gray-700">
                                    {col.name}
                                  </th>
                                ))}
                                {csvPreview.columns.length > 4 && (
                                  <th className="text-left p-2 font-medium text-gray-700">...</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {csvPreview.data.slice(0, 3).map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b">
                                  {csvPreview.columns.slice(0, 4).map((col, colIndex) => (
                                    <td key={colIndex} className="p-2 text-gray-600">
                                      {String(row[col.name] || '').slice(0, 20)}
                                      {String(row[col.name] || '').length > 20 && '...'}
                                    </td>
                                  ))}
                                  {csvPreview.columns.length > 4 && (
                                    <td className="p-2 text-gray-600">...</td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
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
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    {loading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      {/* AI Assistant Panel */}
      <GeminiChatPanel
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
        datasets={datasets}
        onSuggestChart={() => {}}
        onGenerateReport={() => {}}
      />
    </DashboardLayout>
  );
};

export default DataSourcesPage;
