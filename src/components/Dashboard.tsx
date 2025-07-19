import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TableCellsIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import GeminiChatPanel from './GeminiChatPanel';
import { useDataSources } from '../hooks/useDataSources';

export default function Dashboard() {
  const { datasets } = useDataSources();
  const [showAIPanel, setShowAIPanel] = useState(false);

  const stats = [
    {
      label: 'Data Sources',
      value: datasets.length.toString(),
      icon: TableCellsIcon,
      color: '#F8941F',
      href: '/data-sources',
    },
    {
      label: 'Charts Created',
      value: '0',
      icon: ChartBarIcon,
      color: '#2E2C6E',
      href: '/charts',
    },
    {
      label: 'Reports Generated',
      value: '0',
      icon: DocumentArrowDownIcon,
      color: '#10B981',
      href: '/reports',
    },
  ];

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="py-8 px-8 min-h-full">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E2C6E' }}>
            Welcome to AbilityCenterBI
          </h1>
          <p className="text-gray-600 text-lg">
            Transform your data into actionable insights with AI-powered analytics
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <a
                key={stat.label}
                href={stat.href}
                className="bg-white p-6 rounded-2xl transition-all duration-200 hover:transform hover:-translate-y-1"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  textDecoration: 'none',
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`,
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                </div>
                <h3 className="font-semibold text-lg" style={{ color: '#2E2C6E' }}>
                  {stat.label}
                </h3>
              </a>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E2C6E' }}>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data Sources */}
            <a
              href="/data-sources"
              className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{
                background: 'rgba(248, 148, 31, 0.05)',
                textDecoration: 'none',
                border: '2px solid rgba(248, 148, 31, 0.1)',
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
                <TableCellsIcon className="h-4 w-4 text-white" />
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

            {/* Charts */}
            <a
              href="/charts"
              className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{
                background: 'rgba(46, 44, 110, 0.05)',
                textDecoration: 'none',
                border: '2px solid rgba(46, 44, 110, 0.1)',
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

            {/* Reports */}
            <a
              href="/reports"
              className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                textDecoration: 'none',
                border: '2px solid rgba(16, 185, 129, 0.1)',
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
                style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}
              >
                <DocumentArrowDownIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate" style={{ color: '#2E2C6E' }}>
                  3. Generate Reports
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  Export insights as PDF or Excel
                </p>
              </div>
            </a>

            {/* AI Assistant */}
            <button
              onClick={() => setShowAIPanel(true)}
              className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '2px solid rgba(139, 92, 246, 0.1)',
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

        {/* AI Assistant Panel */}
        <GeminiChatPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          datasets={datasets}
          onSuggestChart={(config: any) => {
            console.log('Chart suggestion:', config);
            window.location.href = '/charts';
          }}
          onGenerateReport={(config: any) => {
            console.log('Report generation:', config);
            window.location.href = '/reports';
          }}
        />
      </div>
    </DashboardLayout>
  );
}
