import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { Chart, Dataset, ChartType, ChartConfig } from '../types';

export const useCharts = (datasets: Dataset[]) => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Create a new chart
  const createChart = useCallback(async (config: {
    name: string;
    type: ChartType;
    datasetId: string;
    chartConfig: ChartConfig;
  }) => {
    setIsCreating(true);
    
    try {
      const { name, type, datasetId, chartConfig } = config;
      const dataset = datasets.find(d => d.id === datasetId);
      
      if (!dataset) {
        throw new Error('Dataset not found');
      }
      
      // Validate chart configuration
      if (type === 'line' || type === 'bar' || type === 'area') {
        if (!chartConfig.xAxis || !chartConfig.yAxis) {
          throw new Error('X and Y axes are required for this chart type');
        }
      }
      
      const newChart: Chart = {
        id: `chart_${Date.now()}`,
        name,
        type,
        datasetId,
        config: chartConfig,
        position: { x: 0, y: 0 },
        size: { width: 400, height: 300 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setCharts(prev => [...prev, newChart]);
      toast.success('Chart created successfully!');
      
      return newChart;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create chart');
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [datasets]);

  // Update chart
  const updateChart = useCallback((chartId: string, updates: Partial<Chart>) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? { ...chart, ...updates, updatedAt: new Date() }
        : chart
    ));
    toast.success('Chart updated successfully!');
  }, []);

  // Delete chart
  const deleteChart = useCallback((chartId: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== chartId));
    toast.success('Chart deleted successfully!');
  }, []);

  // Duplicate chart
  const duplicateChart = useCallback((chartId: string) => {
    const originalChart = charts.find(c => c.id === chartId);
    if (!originalChart) return;
    
    const newChart: Chart = {
      ...originalChart,
      id: `chart_${Date.now()}`,
      name: `${originalChart.name} (Copy)`,
      position: { 
        x: originalChart.position.x + 20, 
        y: originalChart.position.y + 20 
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCharts(prev => [...prev, newChart]);
    toast.success('Chart duplicated successfully!');
  }, [charts]);

  // Get charts for a specific dataset
  const getChartsByDataset = useCallback((datasetId: string) => {
    return charts.filter(chart => chart.datasetId === datasetId);
  }, [charts]);

  // Get chart data with processed values
  const getChartData = useCallback((chartId: string) => {
    const chart = charts.find(c => c.id === chartId);
    if (!chart) return null;
    
    const dataset = datasets.find(d => d.id === chart.datasetId);
    if (!dataset) return null;
    
    const { config } = chart;
    
    // Process data based on chart type
    if (chart.type === 'pie' || chart.type === 'doughnut') {
      if (!config.categoryColumn || !config.valueColumn) return null;
      
      const grouped = dataset.rows.reduce((acc: any, row) => {
        const category = row[config.categoryColumn!];
        const value = parseFloat(row[config.valueColumn!]) || 0;
        
        if (acc[category]) {
          acc[category] += value;
        } else {
          acc[category] = value;
        }
        
        return acc;
      }, {});
      
      return Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));
    }
    
    if (chart.type === 'line' || chart.type === 'bar' || chart.type === 'area') {
      if (!config.xAxis || !config.yAxis) return null;
      
      const xAxisField = config.xAxis;
      const yAxisField = Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis;
      
      return dataset.rows.map(row => ({
        [xAxisField]: row[xAxisField],
        [yAxisField]: parseFloat(row[yAxisField]) || 0,
      }));
    }
    
    return dataset.rows;
  }, [charts, datasets]);

  return {
    charts,
    createChart,
    updateChart,
    deleteChart,
    duplicateChart,
    getChartsByDataset,
    getChartData,
    isCreating,
  };
};
