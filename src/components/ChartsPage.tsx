import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';
import { useDataSources } from '../hooks/useDataSources';
import { useCharts } from '../hooks/useCharts';
import type { Chart, ChartType } from '../types';

const chartTypes: { 
  type: ChartType; 
  icon: any; 
  label: string; 
  color: string;
  description: string;
  useCase: string;
}[] = [
  { 
    type: 'bar', 
    icon: ChartBarIcon, 
    label: 'Bar Chart', 
    color: '#F8941F',
    description: 'Compare values across categories',
    useCase: 'Sales by region, revenue by product'
  },
  { 
    type: 'line', 
    icon: PresentationChartLineIcon, 
    label: 'Line Chart', 
    color: '#2E2C6E',
    description: 'Show trends over time',
    useCase: 'Revenue trends, user growth'
  },
  { 
    type: 'pie', 
    icon: ChartPieIcon, 
    label: 'Pie Chart', 
    color: '#10B981',
    description: 'Show proportions of a whole',
    useCase: 'Market share, expense breakdown'
  },
  { 
    type: 'area', 
    icon: ArrowTrendingUpIcon, 
    label: 'Area Chart', 
    color: '#8B5CF6',
    description: 'Cumulative values over time',
    useCase: 'Cumulative revenue, stacked metrics'
  },
  { 
    type: 'scatter', 
    icon: CircleStackIcon, 
    label: 'Scatter Plot', 
    color: '#EF4444',
    description: 'Show correlations between variables',
    useCase: 'Price vs demand, age vs income'
  },
  { 
    type: 'doughnut', 
    icon: ChartPieIcon, 
    label: 'Doughnut Chart', 
    color: '#06B6D4',
    description: 'Modern pie chart with center space',
    useCase: 'Category breakdown, KPI overview'
  },
];

const aggregationTypes = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
];

export default function ChartsPage() {
  const { datasets } = useDataSources();
  const { charts, addChart, removeChart, loading } = useCharts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [chartName, setChartName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [xAxisColumn, setXAxisColumn] = useState('');
  const [yAxisColumn, setYAxisColumn] = useState('');
  const [aggregationType, setAggregationType] = useState('sum');
  const [chartColors, setChartColors] = useState(['#F8941F', '#2E2C6E', '#10B981', '#8B5CF6']);
  const [filterValues, setFilterValues] = useState<{[key: string]: string}>({});

  const handleCreateChart = () => {
    if (!chartName.trim() || !selectedDataset || !xAxisColumn || !yAxisColumn) {
      alert('Please fill in all required fields');
      return;
    }

    const dataset = datasets.find(d => d.id === selectedDataset);
    if (!dataset) return;

    const newChart: Chart = {
      id: `chart_${Date.now()}`,
      name: chartName,
      type: selectedChartType,
      datasetId: selectedDataset,
      config: {
        title: chartName,
        xAxis: xAxisColumn,
        yAxis: yAxisColumn,
        dataColumns: [xAxisColumn, yAxisColumn, ...selectedColumns],
        chartType: selectedChartType,
        colors: chartColors,
        showLegend: true,
        showGrid: true,
        aggregation: aggregationType,
        filters: Object.entries(filterValues).map(([key, value]) => ({
          column: key,
          operator: 'contains' as const,
          value: value
        }))
      },
      position: { x: 0, y: 0 },
      size: { width: 500, height: 350 } as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addChart(newChart);
    
    // Reset form
    setChartName('');
    setSelectedDataset('');
    setSelectedColumns([]);
    setXAxisColumn('');
    setYAxisColumn('');
    setFilterValues({});
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="charts">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="charts">
      <div className="py-8 px-8 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E2C6E' }}>
                Charts & Visualizations
              </h1>
              <p className="text-gray-600">
                Create powerful visualizations from your connected data sources
              </p>
            </div>
            
            {datasets.length > 0 && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Chart
              </button>
            )}
          </div>
        </motion.div>

        {datasets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ChartBarIcon className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-600">
              No Data Sources Connected
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You need to connect data sources before creating charts. Upload a CSV file or connect Google Sheets to get started.
            </p>
            <a
              href="/data-sources"
              className="inline-flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #F8941F, #ff6b35)' }}
            >
              Connect Data Sources
            </a>
          </motion.div>
        ) : (
          <>
            {/* Chart Type Options - Enhanced BI Style */}
            {!showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E2C6E' }}>
                  Choose Visualization Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {chartTypes.map((chart) => {
                    const Icon = chart.icon;
                    return (
                      <button
                        key={chart.type}
                        onClick={() => {
                          setSelectedChartType(chart.type);
                          setShowCreateForm(true);
                        }}
                        className="p-6 rounded-2xl transition-all duration-200 hover:transform hover:-translate-y-1 text-left group"
                        style={{
                          background: `rgba(${parseInt(chart.color.slice(1, 3), 16)}, ${parseInt(chart.color.slice(3, 5), 16)}, ${parseInt(chart.color.slice(5, 7), 16)}, 0.05)`,
                          border: `2px solid rgba(${parseInt(chart.color.slice(1, 3), 16)}, ${parseInt(chart.color.slice(3, 5), 16)}, ${parseInt(chart.color.slice(5, 7), 16)}, 0.1)`,
                        }}
                      >
                        <div className="flex items-center mb-4">
                          <Icon className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" style={{ color: chart.color }} />
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold" style={{ color: '#2E2C6E' }}>
                              {chart.label}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{chart.description}</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 font-medium">Best for:</p>
                          <p className="text-xs text-gray-600">{chart.useCase}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Enhanced Chart Creation Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 mb-8"
                style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <AdjustmentsHorizontalIcon className="h-6 w-6 mr-3" style={{ color: '#2E2C6E' }} />
                    <h3 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                      Configure {chartTypes.find(c => c.type === selectedChartType)?.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    {/* Basic Settings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chart Name *
                      </label>
                      <input
                        type="text"
                        value={chartName}
                        onChange={(e) => setChartName(e.target.value)}
                        placeholder="Enter descriptive chart name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Source *
                      </label>
                      <select
                        value={selectedDataset}
                        onChange={(e) => {
                          setSelectedDataset(e.target.value);
                          setXAxisColumn('');
                          setYAxisColumn('');
                          setSelectedColumns([]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select a dataset</option>
                        {datasets.map((dataset) => (
                          <option key={dataset.id} value={dataset.id}>
                            {dataset.name} ({dataset.rows.length} rows)
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedDataset && (
                      <>
                        {/* Axis Configuration */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              X-Axis (Categories) *
                            </label>
                            <select
                              value={xAxisColumn}
                              onChange={(e) => setXAxisColumn(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">Select column</option>
                              {datasets
                                .find(d => d.id === selectedDataset)
                                ?.columns.map((column) => (
                                  <option key={column.name} value={column.name}>
                                    {column.name} ({column.type})
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Y-Axis (Values) *
                            </label>
                            <select
                              value={yAxisColumn}
                              onChange={(e) => setYAxisColumn(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option value="">Select column</option>
                              {datasets
                                .find(d => d.id === selectedDataset)
                                ?.columns.filter(col => col.type === 'number')
                                .map((column) => (
                                  <option key={column.name} value={column.name}>
                                    {column.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        {/* Aggregation */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Aggregation
                          </label>
                          <select
                            value={aggregationType}
                            onChange={(e) => setAggregationType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            {aggregationTypes.map((agg) => (
                              <option key={agg.value} value={agg.value}>
                                {agg.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Color Customization */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chart Colors
                          </label>
                          <div className="flex gap-2">
                            {chartColors.map((color, index) => (
                              <input
                                key={index}
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [...chartColors];
                                  newColors[index] = e.target.value;
                                  setChartColors(newColors);
                                }}
                                className="w-12 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Preview Panel */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold mb-4" style={{ color: '#2E2C6E' }}>
                      Chart Preview
                    </h4>
                    {chartName && selectedDataset && xAxisColumn && yAxisColumn ? (
                      <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                        <div className="h-48 flex items-center justify-center">
                          <div className="text-center">
                            <ChartBarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 font-medium">{chartName}</p>
                            <p className="text-sm text-gray-500">
                              {chartTypes.find(c => c.type === selectedChartType)?.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {xAxisColumn} vs {yAxisColumn}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                        <p className="text-gray-500">Configure chart settings to see preview</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleCreateChart}
                    disabled={!chartName || !selectedDataset || !xAxisColumn || !yAxisColumn}
                    className="flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #2E2C6E, #667eea)' }}
                  >
                    Create Chart
                  </button>
                  
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Charts List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#2E2C6E' }}>
                Your Charts ({charts.length})
              </h2>

              {charts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ChartBarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No charts created yet</p>
                  <p>Create your first chart to visualize your data</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charts.map((chart: Chart) => {
                    const chartType = chartTypes.find(ct => ct.type === chart.type);
                    const Icon = chartType?.icon || ChartBarIcon;
                    const color = chartType?.color || '#2E2C6E';
                    const dataset = datasets.find(d => d.id === chart.datasetId);

                    return (
                      <motion.div
                        key={chart.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1"
                        style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeChart(chart.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg mb-2" style={{ color: '#2E2C6E' }}>
                          {chart.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {chartType?.label} • {dataset?.name || 'Unknown Dataset'}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {chart.config.dataColumns?.slice(0, 3).map((col: string) => (
                            <span
                              key={col}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {col}
                            </span>
                          ))}
                          {(chart.config.dataColumns?.length || 0) > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{(chart.config.dataColumns?.length || 0) - 3}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-500 text-xs mt-3">
                          Created {new Date(chart.createdAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
