import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TableCellsIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import GeminiChatPanel from './GeminiChatPanel';
import { useDataSources } from '../hooks/useDataSources';
import { useCharts } from '../hooks/useCharts';

export default function Dashboard() {
  const { datasets } = useDataSources();
  const { charts } = useCharts();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Generate recent activity based on datasets and charts
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      time: Date;
      status: string;
    }> = [];
    
    datasets.forEach((dataset, index) => {
      activities.push({
        id: `dataset-${index}`,
        type: 'data',
        title: `${dataset.name} connected`,
        time: new Date(dataset.lastUpdated),
        status: 'success'
      });
    });

    charts.forEach((chart, index) => {
      activities.push({
        id: `chart-${index}`,
        type: 'chart',
        title: `${chart.name} created`,
        time: new Date(chart.createdAt),
        status: 'success'
      });
    });

    // Sort by most recent and take top 5
    activities.sort((a, b) => b.time.getTime() - a.time.getTime());
    setRecentActivity(activities.slice(0, 5));
  }, [datasets, charts]);

  const stats = [
    {
      label: 'Data Sources',
      value: datasets.length.toString(),
      icon: TableCellsIcon,
      color: '#F8941F',
      href: '/data-sources',
      change: datasets.length > 0 ? '+' + datasets.length : '0',
      trend: 'up'
    },
    {
      label: 'Active Charts',
      value: charts.length.toString(),
      icon: ChartBarIcon,
      color: '#2E2C6E',
      href: '/charts',
      change: charts.length > 0 ? '+' + charts.length : '0',
      trend: 'up'
    },
    {
      label: 'Reports Available',
      value: '0',
      icon: DocumentArrowDownIcon,
      color: '#10B981',
      href: '/reports',
      change: '0',
      trend: 'up'
    },
    {
      label: 'Data Points',
      value: datasets.reduce((total, dataset) => total + dataset.rows.length, 0).toLocaleString(),
      icon: ArrowTrendingUpIcon,
      color: '#8B5CF6',
      href: '/data-sources',
      change: datasets.length > 0 ? '+' + datasets.reduce((total, dataset) => total + dataset.rows.length, 0) : '0',
      trend: 'up'
    },
  ];

  const insights = datasets.length > 0 ? [
    {
      title: 'Data Sources Connected',
      description: `You have ${datasets.length} active data source${datasets.length !== 1 ? 's' : ''} ready for analysis`,
      type: 'info',
      action: 'View Data'
    },
    ...(charts.length > 0 ? [{
      title: 'Charts Created',
      description: `${charts.length} chart${charts.length !== 1 ? 's' : ''} available for reporting`,
      type: 'positive',
      action: 'View Charts'
    }] : []),
    {
      title: 'AI Assistant Ready',
      description: 'Get insights and recommendations for your data',
      type: 'info',
      action: 'Open AI Chat'
    }
  ] : [
    {
      title: 'Get Started',
      description: 'Connect your first data source to begin analyzing your business data',
      type: 'warning',
      action: 'Connect Data'
    },
    {
      title: 'AI Assistant Available',
      description: 'Your AI assistant is ready to help with data analysis and insights',
      type: 'info',
      action: 'Open AI Chat'
    }
  ];

  return (
    <DashboardLayout currentPage="dashboard" onShowAIChat={() => setShowAIPanel(true)}>
      <div className="py-6 min-h-full">
        {/* Welcome Section with Real-time Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ability Center BI
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Business Intelligence Dashboard • {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="font-semibold text-sm text-gray-900">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              {/* Clean AI Chat Button */}
              {/* Attractive AI Chat Button */}
              <motion.button
                onClick={() => setShowAIPanel(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>AI Assistant</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </motion.button>
          </div>
        </motion.div>

        {/* Clean Stats Overview - Power BI Style */}
        {/* Beautiful Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.a
                key={stat.label}
                href={stat.href}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                    style={{ 
                      background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                      border: `2px solid ${stat.color}30`
                    }}
                  >
                    <Icon className="h-7 w-7" style={{ color: stat.color }} />
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
        {/* Beautiful Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -2, scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  {insight.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  insight.type === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                  insight.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {insight.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {insight.description}
              </p>
              <button 
                onClick={() => {
                  if (insight.action === 'Open AI Chat') {
                    setShowAIPanel(true);
                  }
                }}
                className="text-violet-600 hover:text-violet-800 font-semibold text-sm flex items-center space-x-1 hover:space-x-2 transition-all duration-200"
              >
                <span>{insight.action}</span>
                <span>→</span>
              </button>
            </motion.div>
          ))}
        </motion.div>ght.action} →
              </button>
            </div>
          ))}
        </motion.div>

        {/* Activity Feed & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-4">
              <ClockIcon className="h-6 w-6 mr-3" style={{ color: '#2E2C6E' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Recent Activity
              </h2>
            </div>
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 rounded-xl bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'data' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Enhanced Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#2E2C6E' }}>
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Connect Data */}
              <a
                href="/data-sources"
                className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                style={{
                  background: 'rgba(248, 148, 31, 0.05)',
                  textDecoration: 'none',
                  border: '2px solid rgba(248, 148, 31, 0.1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                  style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
                >
                  <TableCellsIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#2E2C6E' }}>
                    Connect Data Source
                  </h3>
                  <p className="text-xs text-gray-600">
                    Upload CSV or connect Google Sheets
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{datasets.length} connected</div>
                </div>
              </a>

              {/* Create Chart */}
              <a
                href="/charts"
                className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                style={{
                  background: 'rgba(46, 44, 110, 0.05)',
                  textDecoration: 'none',
                  border: '2px solid rgba(46, 44, 110, 0.1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                  style={{ background: 'linear-gradient(135deg, #2E2C6E, #667eea)' }}
                >
                  <ChartBarIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#2E2C6E' }}>
                    Create Visualization
                  </h3>
                  <p className="text-xs text-gray-600">
                    Build interactive charts and graphs
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{charts.length} created</div>
                </div>
              </a>

              {/* Generate Report */}
              <a
                href="/reports"
                className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  textDecoration: 'none',
                  border: '2px solid rgba(16, 185, 129, 0.1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                  style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}
                >
                  <DocumentArrowDownIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#2E2C6E' }}>
                    Generate Report
                  </h3>
                  <p className="text-xs text-gray-600">
                    Export insights as PDF or Excel
                  </p>
                </div>
              </a>

              {/* AI Assistant */}
              <button
                onClick={() => setShowAIPanel(true)}
                className="flex items-center p-4 rounded-xl transition-all duration-200 hover:transform hover:scale-105 w-full text-left"
                style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '2px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
                >
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#2E2C6E' }}>
                    AI Assistant
                  </h3>
                  <p className="text-xs text-gray-600">
                    Get AI-powered insights and recommendations
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

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
