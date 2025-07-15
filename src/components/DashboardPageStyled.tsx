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
  
  // Advanced features state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showTransformationPanel, setShowTransformationPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilter[]>([]);
  const [transformations, setTransformations] = useState<DataTransformation[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load sample data
        const { dashboards: sampleDashboards, datasets: sampleDatasets, charts: sampleCharts } = loadSampleData();
        
        setDashboards(sampleDashboards);
        setRecentDatasets(sampleDatasets.slice(0, 3));
        setRecentCharts(sampleCharts.slice(0, 3));
        
        // Save to localStorage
        localStorage.setItem('abi_dashboards', JSON.stringify(sampleDashboards));
        localStorage.setItem('abi_datasets', JSON.stringify(sampleDatasets));
        localStorage.setItem('abi_charts', JSON.stringify(sampleCharts));
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="space-y-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2E2C6E' }}>
            Transform Your Data Into <span style={{ color: '#F8941F' }}>Actionable Insights</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to your enterprise analytics dashboard. Monitor performance, analyze trends, and make data-driven decisions with powerful visualizations and AI-powered insights.
          </p>
        </div>

        {/* Key Metrics - Homepage Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '$2.4M', change: '+15.3%', icon: ArrowTrendingUpIcon, color: '#F8941F' },
            { label: 'Active Users', value: '12.5K', change: '+8.7%', icon: EyeIcon, color: '#2E2C6E' },
            { label: 'Conversion Rate', value: '89.2%', change: '+3.1%', icon: ChartBarIcon, color: '#F8941F' },
            { label: 'Data Sources', value: '24', change: '+12', icon: TableCellsIcon, color: '#2E2C6E' },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${metric.color}, ${metric.color === '#F8941F' ? '#ff6b35' : '#667eea'})`
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: '#2E2C6E' }}>
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                  Performance Analytics
                </h2>
                <button 
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#F8941F' }}
                >
                  View All Charts
                </button>
              </div>
              
              {recentCharts.length > 0 ? (
                <div className="space-y-4">
                  {recentCharts.slice(0, 2).map((chart) => (
                    <div key={chart.id} className="h-64">
                      <ChartComponentSimple chart={chart} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-3" style={{ color: '#F8941F' }} />
                    <p className="text-gray-600">No charts available yet</p>
                    <button 
                      className="mt-2 text-sm font-medium hover:underline"
                      style={{ color: '#F8941F' }}
                    >
                      Create Your First Chart
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Connect Data', href: '/data', icon: CloudArrowUpIcon, color: '#F8941F' },
                  { name: 'Create Chart', href: '/charts', icon: ChartBarIcon, color: '#2E2C6E' },
                  { name: 'Generate Report', href: '/reports', icon: DocumentChartBarIcon, color: '#F8941F' },
                  { name: 'View Analytics', href: '/', icon: ArrowTrendingUpIcon, color: '#2E2C6E' },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.name}
                      href={action.href}
                      className="flex flex-col items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
                      style={{
                        background: 'rgba(248, 148, 31, 0.05)',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(248, 148, 31, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(248, 148, 31, 0.05)';
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                        style={{
                          background: `linear-gradient(135deg, ${action.color}, ${action.color === '#F8941F' ? '#ff6b35' : '#667eea'})`
                        }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-center" style={{ color: '#2E2C6E' }}>
                        {action.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Advanced Tools */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: '#2E2C6E' }}>
                  AI Assistant
                </h3>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
                >
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Get instant insights and recommendations powered by AI
              </p>
              <button
                onClick={() => setShowAIPanel(true)}
                className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(248, 148, 31, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Open AI Assistant
              </button>
            </motion.div>

            {/* Advanced Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Advanced Tools
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowFilterPanel(true)}
                  className="w-full flex items-center p-3 rounded-xl transition-all duration-200 text-left"
                  style={{
                    background: 'rgba(248, 148, 31, 0.05)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(248, 148, 31, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(248, 148, 31, 0.05)';
                  }}
                >
                  <FunnelIcon className="h-5 w-5 mr-3" style={{ color: '#F8941F' }} />
                  <span className="font-medium" style={{ color: '#2E2C6E' }}>Advanced Filters</span>
                </button>
                
                <button
                  onClick={() => setShowTransformationPanel(true)}
                  className="w-full flex items-center p-3 rounded-xl transition-all duration-200 text-left"
                  style={{
                    background: 'rgba(46, 44, 110, 0.05)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(46, 44, 110, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(46, 44, 110, 0.05)';
                  }}
                >
                  <BeakerIcon className="h-5 w-5 mr-3" style={{ color: '#2E2C6E' }} />
                  <span className="font-medium" style={{ color: '#2E2C6E' }}>Data Transformation</span>
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Created Sales Dashboard', time: '2 hours ago', icon: ChartBarIcon },
                  { action: 'Connected BigQuery', time: '1 day ago', icon: TableCellsIcon },
                  { action: 'Generated Report', time: '2 days ago', icon: DocumentChartBarIcon },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(248, 148, 31, 0.1)' }}
                      >
                        <Icon className="h-4 w-4" style={{ color: '#F8941F' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#2E2C6E' }}>
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Advanced Panels */}
        <AdvancedFilterPanel
          isOpen={showFilterPanel}
          onClose={() => setShowFilterPanel(false)}
          columns={[]}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <DataTransformationPanel
          isOpen={showTransformationPanel}
          onClose={() => setShowTransformationPanel(false)}
          columns={[]}
          transformations={transformations}
          onTransformationsChange={setTransformations}
        />

        <GeminiChatPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
