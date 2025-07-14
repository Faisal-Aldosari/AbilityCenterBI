import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import type { Chart, Dataset } from '../types';

const ChartsPage: React.FC = () => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null);

  useEffect(() => {
    // Load charts and datasets from localStorage
    const loadData = () => {
      try {
        const savedCharts = localStorage.getItem('abi_charts');
        const savedDatasets = localStorage.getItem('abi_datasets');
        
        if (savedCharts) {
          setCharts(JSON.parse(savedCharts));
        }
        if (savedDatasets) {
          setDatasets(JSON.parse(savedDatasets));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateChart = (type: string) => {
    if (datasets.length === 0) {
      alert('Please connect a data source first');
      return;
    }

    const newChart: Chart = {
      id: `chart_${Date.now()}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      type: type as any,
      datasetId: datasets[0].id,
      config: {
        title: `New ${type} Chart`,
        showLegend: true,
        showGrid: true,
      },
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedCharts = [...charts, newChart];
    setCharts(updatedCharts);
    localStorage.setItem('abi_charts', JSON.stringify(updatedCharts));
    setShowCreateModal(false);
  };

  const handleDeleteChart = (id: string) => {
    const updatedCharts = charts.filter(chart => chart.id !== id);
    setCharts(updatedCharts);
    localStorage.setItem('abi_charts', JSON.stringify(updatedCharts));
  };

  const chartTypes = [
    { type: 'bar', name: 'Bar Chart', icon: '📊' },
    { type: 'line', name: 'Line Chart', icon: '📈' },
    { type: 'pie', name: 'Pie Chart', icon: '🥧' },
    { type: 'area', name: 'Area Chart', icon: '📊' },
    { type: 'scatter', name: 'Scatter Plot', icon: '⚪' },
    { type: 'doughnut', name: 'Doughnut Chart', icon: '🍩' },
  ];

  if (loading) {
    return (
      <DashboardLayout currentPage="charts">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading charts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="charts">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Charts</h1>
              <p className="text-lg text-gray-600">
                Create and manage your data visualizations.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Chart</span>
            </button>
          </div>
        </motion.div>

        {/* Charts Grid */}
        {charts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-16"
          >
            <ChartBarIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Charts Created</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start creating beautiful visualizations from your data sources.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Chart</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {charts.map((chart, index) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{chart.name}</h3>
                    <p className="text-sm text-gray-500">
                      {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteChart(chart.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Chart Preview */}
                <div className="mb-4 h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Chart Preview</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Data Source:</span>
                    <span className="font-medium">
                      {datasets.find(d => d.id === chart.datasetId)?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(chart.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedChart(chart)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create Chart Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Chart</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {chartTypes.map((chartType) => (
                  <button
                    key={chartType.type}
                    onClick={() => handleCreateChart(chartType.type)}
                    className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-center"
                  >
                    <div className="text-4xl mb-3">{chartType.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm">{chartType.name}</h3>
                  </button>
                ))}
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Chart View Modal */}
        {selectedChart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedChart.name}</h2>
                <button
                  onClick={() => setSelectedChart(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <DocumentChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chart Preview</p>
                  <p className="text-sm text-gray-500 mt-2">{selectedChart.name}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChartsPage;
