import { useState, useEffect } from 'react';
import type { Chart } from '../types';

export function useCharts() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load charts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('abi_charts');
      if (stored) {
        const parsedCharts = JSON.parse(stored);
        // Ensure dates are properly parsed
        const chartsWithDates = parsedCharts.map((chart: any) => ({
          ...chart,
          createdAt: new Date(chart.createdAt),
          updatedAt: new Date(chart.updatedAt),
        }));
        setCharts(chartsWithDates);
      }
    } catch (err) {
      console.error('Error loading charts:', err);
      setError('Failed to load charts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save charts to localStorage whenever they change
  const saveCharts = (newCharts: Chart[]) => {
    try {
      localStorage.setItem('abi_charts', JSON.stringify(newCharts));
      setCharts(newCharts);
    } catch (err) {
      console.error('Error saving charts:', err);
      setError('Failed to save charts');
    }
  };

  const addChart = (chart: Chart) => {
    const newCharts = [...charts, chart];
    saveCharts(newCharts);
  };

  const updateChart = (id: string, updatedChart: Partial<Chart>) => {
    const newCharts = charts.map(chart =>
      chart.id === id ? { ...chart, ...updatedChart, updatedAt: new Date() } : chart
    );
    saveCharts(newCharts);
  };

  const removeChart = (id: string) => {
    const newCharts = charts.filter(chart => chart.id !== id);
    saveCharts(newCharts);
  };

  const getChartById = (id: string) => {
    return charts.find(chart => chart.id === id);
  };

  const getChartsByDataset = (datasetId: string) => {
    return charts.filter(chart => chart.datasetId === datasetId);
  };

  return {
    charts,
    loading,
    error,
    addChart,
    updateChart,
    removeChart,
    getChartById,
    getChartsByDataset,
    refetch: () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem('abi_charts');
        if (stored) {
          const parsedCharts = JSON.parse(stored);
          const chartsWithDates = parsedCharts.map((chart: any) => ({
            ...chart,
            createdAt: new Date(chart.createdAt),
            updatedAt: new Date(chart.updatedAt),
          }));
          setCharts(chartsWithDates);
        }
      } catch (err) {
        console.error('Error refreshing charts:', err);
        setError('Failed to refresh charts');
      } finally {
        setLoading(false);
      }
    }
  };
}
