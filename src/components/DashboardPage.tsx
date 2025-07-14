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
      <div className="min-h-screen bg-gray-50">
        {/* Compact Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor your key metrics and manage your data analytics
                </p>
              </div>
              
              {/* Compact Stats */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-center bg-gray-50 rounded-lg px-4 py-3"
                  >
                    <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Quick Actions Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <button
                onClick={() => setShowAIPanel(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadSampleData}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 rounded-lg p-2 mr-3">
                    <BeakerIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Load Sample Data</h3>
                    <p className="text-sm text-gray-600">Get started with demo data</p>
                  </div>
                </div>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/data"
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group block"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
                    <CloudArrowUpIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Connect Data Source</h3>
                    <p className="text-sm text-gray-600">Add Google Sheets or BigQuery</p>
                  </div>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/charts"
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group block"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-600 rounded-lg p-2 mr-3">
                    <ChartBarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Create Visualization</h3>
                    <p className="text-sm text-gray-600">Build charts and graphs</p>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.section>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Charts */}
            {recentCharts.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Charts</h2>
                  <a
                    href="/charts"
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <EyeIcon className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentCharts.slice(0, 4).map((chart, index) => (
                    <motion.div
                      key={chart.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 text-sm">{chart.name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {chart.type}
                        </span>
                      </div>
                      <div className="h-32">
                        <ChartComponentSimple chart={chart} data={[]} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Data Sources */}
              {recentDatasets.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Data Sources</h3>
                    <a
                      href="/data"
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Manage
                    </a>
                  </div>
                  
                  <div className="space-y-3">
                    {recentDatasets.slice(0, 3).map((dataset) => (
                      <div
                        key={dataset.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className={`rounded-lg p-2 mr-3 ${
                          dataset.type === 'googleSheets' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <TableCellsIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{dataset.name}</p>
                          <p className="text-xs text-gray-500">{dataset.columns.length} columns</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Tools */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Advanced Tools</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setShowFilterPanel(true)}
                    className="w-full flex items-center p-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="bg-indigo-100 text-indigo-600 rounded-lg p-2 mr-3">
                      <FunnelIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Advanced Filters</p>
                      <p className="text-xs text-gray-600">Create complex filters</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowTransformationPanel(true)}
                    className="w-full flex items-center p-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="bg-green-100 text-green-600 rounded-lg p-2 mr-3">
                      <ArrowPathIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data Transformation</p>
                      <p className="text-xs text-gray-600">Clean and transform</p>
                    </div>
                  </button>

                  <a
                    href="/reports"
                    className="w-full flex items-center p-2 text-left hover:bg-gray-50 rounded-lg transition-colors group block"
                  >
                    <div className="bg-orange-100 text-orange-600 rounded-lg p-2 mr-3">
                      <DocumentChartBarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Generate Reports</p>
                      <p className="text-xs text-gray-600">Export and share</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
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
