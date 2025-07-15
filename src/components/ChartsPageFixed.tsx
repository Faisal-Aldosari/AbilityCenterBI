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
import GeminiChatPanel from './GeminiChatPanel';
import type { Chart, Dataset } from '../types';

const ChartsPageFixed: React.FC = () => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
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
    { type: 'bar', name: 'Bar Chart', icon: '📊', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
    { type: 'line', name: 'Line Chart', icon: '📈', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { type: 'pie', name: 'Pie Chart', icon: '🥧', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
    { type: 'area', name: 'Area Chart', icon: '📊', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
    { type: 'scatter', name: 'Scatter Plot', icon: '⚪', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)' },
    { type: 'doughnut', name: 'Doughnut Chart', icon: '🍩', gradient: 'linear-gradient(135deg, #F8941F, #2E2C6E)' },
  ];

  if (loading) {
    return (
      <DashboardLayout currentPage="charts">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: '#F8941F' }}></div>
            <p className="text-gray-600 text-lg mt-4">Loading charts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="charts" onAIToggle={() => setShowAIPanel(!showAIPanel)}>
      <div className="space-y-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2E2C6E' }}>
            Data <span style={{ color: '#F8941F' }}>Visualizations</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Create stunning charts and visualizations from your connected data sources.
          </p>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
              color: 'white',
              border: 'none',
              boxShadow: '0 10px 30px rgba(248, 148, 31, 0.3)'
            }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Chart
          </button>
        </motion.div>

        {/* Charts Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {charts.length === 0 ? (
            <div className="text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Charts Created</h3>
              <p className="text-gray-600 mb-6">Start by creating your first chart from your data.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(248, 148, 31, 0.3)'
                }}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Chart
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {charts.map((chart, index) => (
                <motion.div
                  key={chart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
                  style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                           style={{ background: 'linear-gradient(135deg, #F8941F, #2E2C6E)' }}>
                        <ChartBarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{chart.name}</h3>
                        <p className="text-sm text-gray-500">{chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteChart(chart.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Chart Preview</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors">
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
            </div>
          )}
        </motion.section>

        {/* Create Chart Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold" style={{ color: '#2E2C6E' }}>Create New Chart</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PlusIcon className="w-6 h-6 transform rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {chartTypes.map((chartType) => (
                  <button
                    key={chartType.type}
                    onClick={() => handleCreateChart(chartType.type)}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-200 group text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                         style={{ background: chartType.gradient }}>
                      <span className="text-2xl">{chartType.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{chartType.name}</h3>
                  </button>
                ))}
              </div>

              {datasets.length === 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-yellow-800 text-sm">
                    📌 You need to connect a data source first before creating charts. 
                    <a href="/data" className="underline ml-1">Go to Data Sources</a>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* AI Assistant Panel */}
        <GeminiChatPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          datasets={datasets}
          onSuggestChart={(config) => {
            console.log('Chart suggestion:', config);
            setShowCreateModal(true);
          }}
          onGenerateReport={(config) => {
            console.log('Report generation:', config);
            window.location.href = '/reports';
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default ChartsPageFixed;
