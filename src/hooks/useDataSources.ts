import { useState, useEffect } from 'react';
import type { Dataset } from '../types';

export function useDataSources() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load datasets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('abi_datasets');
      if (stored) {
        const parsedDatasets = JSON.parse(stored);
        setDatasets(parsedDatasets);
      }
    } catch (err) {
      console.error('Error loading datasets:', err);
      setError('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save datasets to localStorage whenever they change
  const saveDatasets = (newDatasets: Dataset[]) => {
    try {
      localStorage.setItem('abi_datasets', JSON.stringify(newDatasets));
      setDatasets(newDatasets);
    } catch (err) {
      console.error('Error saving datasets:', err);
      setError('Failed to save datasets');
    }
  };

  const addDataset = (dataset: Dataset) => {
    const newDatasets = [...datasets, dataset];
    saveDatasets(newDatasets);
  };

  const updateDataset = (id: string, updatedDataset: Partial<Dataset>) => {
    const newDatasets = datasets.map(dataset =>
      dataset.id === id ? { ...dataset, ...updatedDataset } : dataset
    );
    saveDatasets(newDatasets);
  };

  const removeDataset = (id: string) => {
    const newDatasets = datasets.filter(dataset => dataset.id !== id);
    saveDatasets(newDatasets);
  };

  const getDatasetById = (id: string) => {
    return datasets.find(dataset => dataset.id === id);
  };

  return {
    datasets,
    loading,
    error,
    addDataset,
    updateDataset,
    removeDataset,
    getDatasetById,
    refetch: () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem('abi_datasets');
        if (stored) {
          const parsedDatasets = JSON.parse(stored);
          setDatasets(parsedDatasets);
        }
      } catch (err) {
        console.error('Error refreshing datasets:', err);
        setError('Failed to refresh datasets');
      } finally {
        setLoading(false);
      }
    }
  };
}
