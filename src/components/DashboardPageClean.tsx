import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  FunnelIcon,
  SparklesIcon,
  BeakerIcon,
  EyeIcon,
  CloudArrowUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import DataTransformationPanel from '../components/DataTransformationPanel';
import GeminiChatPanel from '../components/GeminiChatPanel';
import type { Dataset, Chart, AdvancedFilter, DataTransformation } from '../types';

const DashboardPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  
  // Advanced features state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showTransformationPanel, setShowTransformationPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilter[]>([]);
  const [transformations, setTransformations] = useState<DataTransformation[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedDatasets = localStorage.getItem('abi_datasets');
    const savedCharts = localStorage.getItem('abi_charts');
    
    if (savedDatasets) {
      setDatasets(JSON.parse(savedDatasets));
    }
    if (savedCharts) {
      setCharts(JSON.parse(savedCharts));
    }
  }, []);

  return (
    <DashboardLayout currentPage="dashboard" onAIToggle={() => setShowAIPanel(!showAIPanel)}>
      <div className="space-y-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 truncate" style={{ color: '#2E2C6E' }}>
            Your Analytics <span style={{ color: '#F8941F' }}>Dashboard</span>
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect your data sources, create visualizations, and generate insights with our powerful analytics platform.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Data Sources', value: datasets.length.toString(), icon: TableCellsIcon, color: '#F8941F' },
            { label: 'Charts Created', value: charts.length.toString(), icon: ChartBarIcon, color: '#2E2C6E' },
            { label: 'Reports Generated', value: '0', icon: DocumentChartBarIcon, color: '#F8941F' },
            { label: 'Active Filters', value: filters.length.toString(), icon: FunnelIcon, color: '#2E2C6E' },
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
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${metric.color}, ${metric.color === '#F8941F' ? '#ff6b35' : '#667eea'})`
                    }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
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
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Get Started Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Analytics Workflow
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Follow these steps to analyze your data effectively.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/data"
                  className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
                  style={{
                    background: 'rgba(248, 148, 31, 0.05)',
                    textDecoration: 'none',
                    border: '2px solid rgba(248, 148, 31, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(248, 148, 31, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(248, 148, 31, 0.05)';
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
                  >
                    <CloudArrowUpIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate" style={{ color: '#2E2C6E' }}>
                      1. Connect Data
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      Upload CSV or connect Google Sheets
                    </p>
                  </div>
                </a>

                <a
                  href="/charts"
                  className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
                  style={{
                    background: 'rgba(46, 44, 110, 0.05)',
                    textDecoration: 'none',
                    border: '2px solid rgba(46, 44, 110, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(46, 44, 110, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(46, 44, 110, 0.05)';
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ background: 'linear-gradient(135deg, #2E2C6E, #667eea)' }}
                  >
                    <ChartBarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate" style={{ color: '#2E2C6E' }}>
                      2. Create Charts
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      Build visualizations from your data
                    </p>
                  </div>
                </a>
              </div>
              
              {/* Additional Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <a
                  href="/reports"
                  className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
                  style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    textDecoration: 'none',
                    border: '2px solid rgba(16, 185, 129, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    <DocumentChartBarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate" style={{ color: '#2E2C6E' }}>
                      3. Generate Reports
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      Create professional PDF reports
                    </p>
                  </div>
                </a>

                <button
                  onClick={() => setShowAIPanel(true)}
                  className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
                  style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: '2px solid rgba(139, 92, 246, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
                  >
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate" style={{ color: '#2E2C6E' }}>
                      4. AI Assistant
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      Get insights and recommendations
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Recent Data Sources
              </h3>
              
              {datasets.length > 0 ? (
                <div className="space-y-3">
                  {datasets.slice(0, 3).map((dataset) => (
                    <div key={dataset.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(248, 148, 31, 0.1)' }}
                      >
                        <TableCellsIcon className="h-4 w-4" style={{ color: '#F8941F' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#2E2C6E' }}>
                          {dataset.name}
                        </p>
                        <p className="text-xs text-gray-500">{dataset.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TableCellsIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-4">No data sources connected yet</p>
                  <a
                    href="/data"
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
                      color: 'white',
                      textDecoration: 'none'
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
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Connect Your First Data Source
                  </a>
                </div>
              )}
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
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
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
                  <FunnelIcon className="h-4 w-4 mr-3" style={{ color: '#F8941F' }} />
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
                  <BeakerIcon className="h-4 w-4 mr-3" style={{ color: '#2E2C6E' }} />
                  <span className="font-medium" style={{ color: '#2E2C6E' }}>Data Transformation</span>
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/reports"
                  className="flex items-center p-3 rounded-xl transition-all duration-200"
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
                  <DocumentChartBarIcon className="h-4 w-4 mr-3" style={{ color: '#F8941F' }} />
                  <span className="font-medium" style={{ color: '#2E2C6E' }}>Generate Report</span>
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center p-3 rounded-xl transition-all duration-200"
                  style={{
                    background: 'rgba(46, 44, 110, 0.05)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(46, 44, 110, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(46, 44, 110, 0.05)';
                  }}
                >
                  <EyeIcon className="h-4 w-4 mr-3" style={{ color: '#2E2C6E' }} />
                  <span className="font-medium" style={{ color: '#2E2C6E' }}>View Settings</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Advanced Panels */}
        <AdvancedFilterPanel
          isOpen={showFilterPanel}
          onClose={() => setShowFilterPanel(false)}
          columns={datasets.length > 0 ? datasets[0].columns : []}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <DataTransformationPanel
          isOpen={showTransformationPanel}
          onClose={() => setShowTransformationPanel(false)}
          columns={datasets.length > 0 ? datasets[0].columns : []}
          transformations={transformations}
          onTransformationsChange={setTransformations}
        />

        <GeminiChatPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          datasets={datasets}
          onSuggestChart={(config) => {
            console.log('Chart suggestion:', config);
            window.location.href = '/charts';
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

export default DashboardPage;
