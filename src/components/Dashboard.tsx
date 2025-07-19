import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TableCellsIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
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
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Active Charts',
      value: charts.length.toString(),
      icon: ChartBarIcon,
      color: '#2E2C6E',
      href: '/charts',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Reports Generated',
      value: '3',
      icon: DocumentArrowDownIcon,
      color: '#10B981',
      href: '/reports',
      change: '+25%',
      trend: 'up'
    },
    {
      label: 'Data Points',
      value: datasets.reduce((total, dataset) => total + dataset.rows.length, 0).toLocaleString(),
      icon: ArrowTrendingUpIcon,
      color: '#8B5CF6',
      href: '/data-sources',
      change: '+15%',
      trend: 'up'
    },
  ];

  const insights = [
    {
      title: 'Revenue Trending Up',
      description: 'Monthly revenue increased by 15% compared to last period',
      type: 'positive',
      action: 'View Details'
    },
    {
      title: 'New Data Available',
      description: `${datasets.length} data sources ready for analysis`,
      type: 'info',
      action: 'Analyze Now'
    },
    {
      title: 'Report Due Soon',
      description: 'Quarterly business review report scheduled for tomorrow',
      type: 'warning',
      action: 'Generate Report'
    }
  ];

  return (
    <DashboardLayout currentPage="dashboard" onShowAIChat={() => setShowAIPanel(true)}>
      <div className="py-8 px-8 min-h-full">
        {/* Welcome Section with Real-time Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#2E2C6E' }}>
                Business Intelligence Dashboard
              </h1>
              <p className="text-gray-600 text-sm">
                Real-time insights and analytics • {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="font-semibold text-sm" style={{ color: '#2E2C6E' }}>
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
            return (
              <a
                key={stat.label}
                href={stat.href}
                className="bg-white p-4 rounded-xl transition-all duration-200 hover:transform hover:-translate-y-1 group"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  textDecoration: 'none',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`,
                    }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-xs text-green-600">
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="mb-1">
                  <span
                    className="text-xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                </div>
                <h3 className="font-medium text-xs" style={{ color: '#2E2C6E' }}>
                  {stat.label}
                </h3>
              </a>
            );
          })}
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {insights.map((insight, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold" style={{ color: '#2E2C6E' }}>
                  {insight.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.type === 'positive' ? 'bg-green-100 text-green-800' :
                  insight.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {insight.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{insight.description}</p>
              <button className="text-sm font-medium hover:underline" style={{ color: '#F8941F' }}>
                {insight.action} →
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
