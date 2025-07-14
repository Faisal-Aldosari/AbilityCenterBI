import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  SparklesIcon,
  BeakerIcon,
  PlusIcon,
  EyeIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import DataTransformationPanel from '../components/DataTransformationPanel';
import GeminiChatPanel from '../components/GeminiChatPanel';
import ChartComponentSimple from '../components/ChartComponentSimple';
import type { Dashboard, Dataset, Chart, AdvancedFilter, DataTransformation } from '../types';
import { loadSampleData } from '../utils/sampleData';

const DashboardPage: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([]);
  const [recentCharts, setRecentCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New states for advanced features
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showTransformationPanel, setShowTransformationPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilter[]>([]);
  const [transformations, setTransformations] = useState<DataTransformation[]>([]);

  useEffect(() => {
    // Load saved data from localStorage or API
    const loadDashboardData = async () => {
      try {
        // For now, we'll use mock data
        const savedDashboards = localStorage.getItem('abi_dashboards');
        const savedDatasets = localStorage.getItem('abi_datasets');
        const savedCharts = localStorage.getItem('abi_charts');

        if (savedDashboards) {
          setDashboards(JSON.parse(savedDashboards));
        }
        if (savedDatasets) {
          setRecentDatasets(JSON.parse(savedDatasets).slice(0, 3));
        }
        if (savedCharts) {
          setRecentCharts(JSON.parse(savedCharts).slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Handlers for new features
  const handleSuggestChart = (suggestion: any) => {
    console.log('Chart suggestion:', suggestion);
    // TODO: Implement chart creation from AI suggestion
  };

  const handleGenerateReport = (report: any) => {
    console.log('Generated report:', report);
    // TODO: Implement report display/download
  };

  const getAllColumns = () => {
    const allColumns = recentDatasets.reduce((cols, dataset) => {
      return [...cols, ...dataset.columns];
    }, [] as any[]);
    return allColumns;
  };

  const handleLoadSampleData = () => {
    try {
      const { datasets, charts, dashboard } = loadSampleData();
      setRecentDatasets(datasets);
      setRecentCharts(charts);
      setDashboards([dashboard]);
      
      // Save to localStorage
      localStorage.setItem('abi_datasets', JSON.stringify(datasets));
      localStorage.setItem('abi_charts', JSON.stringify(charts));
      localStorage.setItem('abi_dashboards', JSON.stringify([dashboard]));
      
      alert('Sample data loaded successfully!');
    } catch (error) {
      console.error('Error loading sample data:', error);
      alert('Failed to load sample data');
    }
  };

  const stats = [
    {
      name: 'Total Dashboards',
      value: dashboards.length,
      icon: DocumentChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Data Sources',
      value: recentDatasets.length,
      icon: TableCellsIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Charts Created',
      value: recentCharts.length,
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Reports Generated',
      value: 0, // TODO: Add reports count
      icon: ArrowTrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">
                Welcome to <span className="text-orange-400">AbilityCenterBI</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Transform your data into powerful insights with our enterprise-grade analytics platform
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl p-3">
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-blue-100 font-medium">{stat.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Quick Actions Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <p className="text-lg text-gray-600">Get started with these common tasks</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoadSampleData}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 mb-6 mx-auto w-fit">
                  <BeakerIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Load Sample Data</h3>
                <p className="text-gray-600">Get started with demo financial data</p>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/data"
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group block text-center"
              >
                <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl p-4 mb-6 mx-auto w-fit">
                  <CloudArrowUpIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Data</h3>
                <p className="text-gray-600">Link Google Sheets or BigQuery</p>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/charts"
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group block text-center"
              >
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-4 mb-6 mx-auto w-fit">
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Charts</h3>
                <p className="text-gray-600">Build beautiful visualizations</p>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAIPanel(true)}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 mb-6 mx-auto w-fit">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
                <p className="text-gray-600">Get help with data analysis</p>
              </motion.button>
            </div>
          </motion.section>

          {/* Recent Charts */}
          {recentCharts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Charts</h2>
                  <p className="text-lg text-gray-600">Your latest data visualizations</p>
                </div>
                <a
                  href="/charts"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <EyeIcon className="w-5 h-5" />
                  View All
                </a>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recentCharts.slice(0, 4).map((chart, index) => (
                  <motion.div
                    key={chart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{chart.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {chart.type}
                      </span>
                    </div>
                    <div className="h-64">
                      <ChartComponentSimple chart={chart} data={[]} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Recent Datasets */}
          {recentDatasets.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Sources</h2>
                  <p className="text-lg text-gray-600">Your connected data sources</p>
                </div>
                <a
                  href="/data"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add New
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentDatasets.map((dataset, index) => (
                  <motion.div
                    key={dataset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`rounded-xl p-3 ${
                        dataset.type === 'googleSheets' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <TableCellsIcon className={`w-6 h-6 ${
                          dataset.type === 'googleSheets' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{dataset.type}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Columns:</span>
                        <span className="font-medium">{dataset.columns.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rows:</span>
                        <span className="font-medium">{dataset.rows.length}</span>
                      </div>
                      {dataset.lastSync && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Sync:</span>
                          <span className="font-medium">{dataset.lastSync}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Advanced Tools */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Tools</h2>
              <p className="text-lg text-gray-600">Powerful features for data professionals</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilterPanel(true)}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FunnelIcon className="w-12 h-12 text-indigo-200 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Advanced Filters</h3>
                <p className="text-indigo-100">Create complex data filters with multiple conditions</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTransformationPanel(true)}
                className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowPathIcon className="w-12 h-12 text-green-200 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Data Transformation</h3>
                <p className="text-green-100">Clean and transform your data for better insights</p>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/reports"
                className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 block text-center"
              >
                <DocumentChartBarIcon className="w-12 h-12 text-orange-200 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Report Builder</h3>
                <p className="text-orange-100">Generate comprehensive reports with export options</p>
              </motion.a>
            </div>
          </motion.section>
        </div>

        {/* Panels */}
        {showFilterPanel && (
          <AdvancedFilterPanel
            isOpen={showFilterPanel}
            onClose={() => setShowFilterPanel(false)}
            columns={getAllColumns()}
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters);
              console.log('Applied filters:', newFilters);
            }}
          />
        )}

        {showTransformationPanel && (
          <DataTransformationPanel
            isOpen={showTransformationPanel}
            onClose={() => setShowTransformationPanel(false)}
            columns={getAllColumns()}
            transformations={transformations}
            onTransformationsChange={(newTransformations) => {
              setTransformations(newTransformations);
              console.log('Applied transformations:', newTransformations);
            }}
          />
        )}

        {showAIPanel && (
          <GeminiChatPanel
            isOpen={showAIPanel}
            onClose={() => setShowAIPanel(false)}
            onSuggestChart={handleSuggestChart}
            onGenerateReport={handleGenerateReport}
            datasets={recentDatasets}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
