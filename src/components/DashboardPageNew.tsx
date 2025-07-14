import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  CogIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import DataTransformationPanel from '../components/DataTransformationPanel';
import GeminiChatPanel from '../components/GeminiChatPanel';
import type { Dashboard, Dataset, Chart, AdvancedFilter, DataTransformation } from '../types';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="p-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to AbilityCenterBI
          </h1>
          <p className="text-gray-600">
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
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
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
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/data"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
            >
              <div className="bg-orange-100 rounded-lg p-3 mr-4 group-hover:bg-orange-200 transition-colors">
                <TableCellsIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Connect Data Source</h3>
                <p className="text-sm text-gray-600">Link Google Sheets or BigQuery</p>
              </div>
            </a>

            <button
              onClick={() => setShowFilterPanel(true)}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-left"
            >
              <div className="bg-blue-100 rounded-lg p-3 mr-4 group-hover:bg-blue-200 transition-colors">
                <FunnelIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Advanced Filters</h3>
                <p className="text-sm text-gray-600">Create complex data filters</p>
              </div>
            </button>

            <button
              onClick={() => setShowTransformationPanel(true)}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-left"
            >
              <div className="bg-green-100 rounded-lg p-3 mr-4 group-hover:bg-green-200 transition-colors">
                <CogIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Data Transformation</h3>
                <p className="text-sm text-gray-600">Transform and enrich data</p>
              </div>
            </button>

            <button
              onClick={() => setShowAIPanel(true)}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group text-left"
            >
              <div className="bg-purple-100 rounded-lg p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-600">Chat with AI for insights</p>
              </div>
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Dashboards</h2>
              <a href="/dashboards" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                View all
              </a>
            </div>
            {dashboards.length === 0 ? (
              <div className="text-center py-8">
                <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No dashboards created yet</p>
                <p className="text-sm text-gray-500">Create your first dashboard to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboards.slice(0, 3).map((dashboard) => (
                  <div key={dashboard.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{dashboard.name}</h3>
                      <p className="text-sm text-gray-600">{dashboard.charts.length} charts</p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Data Sources</h2>
              <a href="/data" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                View all
              </a>
            </div>
            {recentDatasets.length === 0 ? (
              <div className="text-center py-8">
                <TableCellsIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No data sources connected</p>
                <p className="text-sm text-gray-500">Connect Google Sheets or BigQuery to start</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDatasets.map((dataset) => (
                  <div key={dataset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                      <p className="text-sm text-gray-600">
                        {dataset.type === 'googleSheets' ? 'Google Sheets' : 'BigQuery'} • {dataset.rows.length} rows
                      </p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
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
