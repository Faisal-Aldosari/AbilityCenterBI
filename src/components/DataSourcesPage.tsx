import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TableCellsIcon,
  PlusIcon,
  TrashIcon,
  CloudIcon,
  DocumentIcon,
  EyeIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import type { Dataset } from '../types';

const DataSourcesPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    // Load datasets from localStorage
    const loadDatasets = () => {
      try {
        const savedDatasets = localStorage.getItem('abi_datasets');
        if (savedDatasets) {
          setDatasets(JSON.parse(savedDatasets));
        }
      } catch (error) {
        console.error('Error loading datasets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const handleConnectGoogleSheets = () => {
    // TODO: Implement Google Sheets connection
    console.log('Connecting to Google Sheets...');
    // For now, add a sample dataset
    const sampleDataset: Dataset = {
      id: `gs_${Date.now()}`,
      name: 'Sample Google Sheet',
      type: 'googleSheets',
      url: 'https://docs.google.com/spreadsheets/d/sample',
      columns: [
        { id: 'date', name: 'Date', type: 'date' },
        { id: 'revenue', name: 'Revenue', type: 'number' },
        { id: 'category', name: 'Category', type: 'string' },
      ],
      rows: [
        { date: '2024-01-01', revenue: 10000, category: 'Sales' },
        { date: '2024-01-02', revenue: 12000, category: 'Marketing' },
      ],
      lastSync: new Date().toISOString(),
    };

    const updatedDatasets = [...datasets, sampleDataset];
    setDatasets(updatedDatasets);
    localStorage.setItem('abi_datasets', JSON.stringify(updatedDatasets));
    setShowConnectModal(false);
  };

  const handleConnectBigQuery = () => {
    // TODO: Implement BigQuery connection
    console.log('Connecting to BigQuery...');
    // For now, add a sample dataset
    const sampleDataset: Dataset = {
      id: `bq_${Date.now()}`,
      name: 'BigQuery Analytics',
      type: 'bigQuery',
      url: 'project.dataset.table',
      columns: [
        { id: 'timestamp', name: 'Timestamp', type: 'timestamp' },
        { id: 'users', name: 'Users', type: 'number' },
        { id: 'sessions', name: 'Sessions', type: 'number' },
      ],
      rows: [
        { timestamp: '2024-01-01T00:00:00Z', users: 1500, sessions: 2200 },
        { timestamp: '2024-01-02T00:00:00Z', users: 1600, sessions: 2400 },
      ],
      lastSync: new Date().toISOString(),
    };

    const updatedDatasets = [...datasets, sampleDataset];
    setDatasets(updatedDatasets);
    localStorage.setItem('abi_datasets', JSON.stringify(updatedDatasets));
    setShowConnectModal(false);
  };

  const handleDeleteDataset = (id: string) => {
    const updatedDatasets = datasets.filter(dataset => dataset.id !== id);
    setDatasets(updatedDatasets);
    localStorage.setItem('abi_datasets', JSON.stringify(updatedDatasets));
  };

  const handleSyncDataset = (id: string) => {
    // TODO: Implement data sync
    console.log('Syncing dataset:', id);
    const updatedDatasets = datasets.map(dataset =>
      dataset.id === id
        ? { ...dataset, lastSync: new Date().toISOString() }
        : dataset
    );
    setDatasets(updatedDatasets);
    localStorage.setItem('abi_datasets', JSON.stringify(updatedDatasets));
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="data">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading data sources...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="data">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Sources</h1>
              <p className="text-lg text-gray-600">
                Connect and manage your data sources for powerful analytics.
              </p>
            </div>
            <button
              onClick={() => setShowConnectModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Connect Data Source</span>
            </button>
          </div>
        </motion.div>

        {/* Data Sources Grid */}
        {datasets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-16"
          >
            <TableCellsIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Data Sources Connected</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by connecting your first data source. Support for Google Sheets and BigQuery.
            </p>
            <button
              onClick={() => setShowConnectModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Connect Your First Data Source</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl mr-4 ${
                      dataset.type === 'googleSheets' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {dataset.type === 'googleSheets' ? (
                        <DocumentIcon className="w-6 h-6" />
                      ) : (
                        <CloudIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                      <p className="text-sm text-gray-500">
                        {dataset.type === 'googleSheets' ? 'Google Sheets' : 'BigQuery'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDataset(dataset.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rows:</span>
                    <span className="font-medium">{dataset.rows.length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Columns:</span>
                    <span className="font-medium">{dataset.columns.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="font-medium">
                      {dataset.lastSync ? new Date(dataset.lastSync).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSyncDataset(dataset.id)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>Sync</span>
                  </button>
                  <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Connect Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect Data Source</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleConnectGoogleSheets}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group text-left"
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-lg p-3 mr-4 group-hover:bg-green-200 transition-colors">
                      <DocumentIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Google Sheets</h3>
                      <p className="text-sm text-gray-600">Connect spreadsheets from Google Drive</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleConnectBigQuery}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group text-left"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                      <CloudIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">BigQuery</h3>
                      <p className="text-sm text-gray-600">Connect to Google BigQuery datasets</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setShowConnectModal(false)}
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

export default DataSourcesPage;
