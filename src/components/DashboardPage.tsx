import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  CogIcon,
  SparklesIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import DataTransformationPanel from '../components/DataTransformationPanel';
import GeminiChatPanel from '../components/GeminiChatPanel';
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
    const { datasets, charts, dashboard } = loadSampleData();
    setRecentDatasets(datasets);
    setRecentCharts(charts);
    setDashboards([dashboard]);
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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to AbilityCenterBI
          </h1>
          <p className="text-lg text-gray-600">
            Create powerful data visualizations and insights from your data sources.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-xl p-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <button
              onClick={handleLoadSampleData}
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-center"
            >
              <div className="bg-orange-100 rounded-xl p-4 mb-4 group-hover:bg-orange-200 transition-colors">
                <BeakerIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Load Sample Data</h3>
              <p className="text-sm text-gray-600">Financial demo data</p>
            </button>

            <a
              href="/data"
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-center"
            >
              <div className="bg-orange-100 rounded-xl p-4 mb-4 group-hover:bg-orange-200 transition-colors">
                <TableCellsIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Connect Data Source</h3>
              <p className="text-sm text-gray-600">Link Google Sheets or BigQuery</p>
            </a>

            <button
              onClick={() => setShowFilterPanel(true)}
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group text-center"
            >
              <div className="bg-blue-100 rounded-xl p-4 mb-4 group-hover:bg-blue-200 transition-colors">
                <FunnelIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Filters</h3>
              <p className="text-sm text-gray-600">Create complex data filters</p>
            </button>

            <button
              onClick={() => setShowTransformationPanel(true)}
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group text-center"
            >
              <div className="bg-green-100 rounded-xl p-4 mb-4 group-hover:bg-green-200 transition-colors">
                <CogIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Transformation</h3>
              <p className="text-sm text-gray-600">Transform and enrich data</p>
            </button>

            <button
              onClick={() => setShowAIPanel(true)}
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group text-center"
            >
              <div className="bg-purple-100 rounded-xl p-4 mb-4 group-hover:bg-purple-200 transition-colors">
                <SparklesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600">Chat with AI for insights</p>
            </button>
          </div>
        </motion.div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Dashboards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Dashboards</h2>
              <a href="/dashboards" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                View all
              </a>
            </div>
            {dashboards.length === 0 ? (
              <div className="text-center py-12">
                <DocumentChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">No dashboards created yet</p>
                <p className="text-sm text-gray-500">Create your first dashboard to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboards.slice(0, 3).map((dashboard) => (
                  <div key={dashboard.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dashboard.name}</h3>
                      <p className="text-sm text-gray-600">{dashboard.charts.length} charts</p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Data Sources</h2>
              <a href="/data" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                View all
              </a>
            </div>
            {recentDatasets.length === 0 ? (
              <div className="text-center py-12">
                <TableCellsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">No data sources connected</p>
                <p className="text-sm text-gray-500">Connect Google Sheets or BigQuery to start</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDatasets.map((dataset) => (
                  <div key={dataset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                      <p className="text-sm text-gray-600">
                        {dataset.type === 'googleSheets' ? 'Google Sheets' : 'BigQuery'} • {dataset.rows.length} rows
                      </p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Advanced Feature Panels */}
        <AdvancedFilterPanel
          isOpen={showFilterPanel}
          onClose={() => setShowFilterPanel(false)}
          columns={getAllColumns()}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <DataTransformationPanel
          isOpen={showTransformationPanel}
          onClose={() => setShowTransformationPanel(false)}
          columns={getAllColumns()}
          transformations={transformations}
          onTransformationsChange={setTransformations}
        />

        <GeminiChatPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          datasets={recentDatasets}
          onSuggestChart={handleSuggestChart}
          onGenerateReport={handleGenerateReport}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
