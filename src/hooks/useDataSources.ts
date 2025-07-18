import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { Dataset } from '../types';
import { fetchGoogleSheetData, listGoogleSheets } from '../services/googleSheets';

export const useDataSources = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const queryClient = useQueryClient();

  // Query for Google Sheets list
  const { data: googleSheets, isLoading: isLoadingSheets } = useQuery({
    queryKey: ['googleSheets'],
    queryFn: listGoogleSheets,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for adding Google Sheet data
  const addGoogleSheetMutation = useMutation({
    mutationFn: async ({ spreadsheetId, sheetName }: { spreadsheetId: string; sheetName?: string }) => {
      return await fetchGoogleSheetData(spreadsheetId, sheetName);
    },
    onSuccess: (data) => {
      setDatasets(prev => [...prev.filter(d => d.id !== data.id), data]);
      toast.success('Google Sheet connected successfully!');
      queryClient.invalidateQueries({ queryKey: ['googleSheets'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to connect Google Sheet');
    },
  });

  // Add CSV dataset
  const addCsvDataset = useCallback((file: File, data: any[]) => {
    const headers = Object.keys(data[0] || {});
    const columns = headers.map(header => ({
      name: header,
      type: inferColumnType(data.map(row => row[header])),
      nullable: true,
    }));

    const dataset: Dataset = {
      id: `csv_${Date.now()}`,
      name: file.name.replace('.csv', ''),
      type: 'csv',
      file,
      columns,
      rows: data,
      lastUpdated: new Date(),
    };

    setDatasets(prev => [...prev, dataset]);
    toast.success('CSV file uploaded successfully!');
  }, []);

  // Remove dataset
  const removeDataset = useCallback((id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    toast.success('Dataset removed successfully!');
  }, []);

  // Refresh dataset
  const refreshDataset = useCallback(async (dataset: Dataset) => {
    if (dataset.type === 'googleSheets' && dataset.spreadsheetId) {
      addGoogleSheetMutation.mutate({
        spreadsheetId: dataset.spreadsheetId,
        sheetName: dataset.sheetName,
      });
    }
  }, [addGoogleSheetMutation]);

  return {
    datasets,
    googleSheets: googleSheets || [],
    isLoadingSheets,
    addGoogleSheet: addGoogleSheetMutation.mutate,
    addCsvDataset,
    removeDataset,
    refreshDataset,
    isAddingGoogleSheet: addGoogleSheetMutation.isPending,
  };
};

const inferColumnType = (values: any[]): 'string' | 'number' | 'date' | 'boolean' => {
  if (values.length === 0) return 'string';
  
  const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
  if (nonNullValues.length === 0) return 'string';
  
  // Check if all values are numbers
  const numericValues = nonNullValues.filter(val => !isNaN(Number(val)));
  if (numericValues.length === nonNullValues.length) {
    return 'number';
  }
  
  // Check if all values are dates
  const dateValues = nonNullValues.filter(val => !isNaN(Date.parse(val)));
  if (dateValues.length === nonNullValues.length) {
    return 'date';
  }
  
  // Check if all values are booleans
  const booleanValues = nonNullValues.filter(val => 
    val.toString().toLowerCase() === 'true' || 
    val.toString().toLowerCase() === 'false' ||
    val === '1' ||
    val === '0'
  );
  if (booleanValues.length === nonNullValues.length) {
    return 'boolean';
  }
  
  return 'string';
};
