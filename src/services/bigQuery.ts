import type { Dataset, Column } from '../types';
import { getAccessToken } from './auth';

export const fetchBigQueryData = async (
  projectId: string,
  datasetId: string,
  tableId: string,
  query?: string
): Promise<Dataset> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('User not authenticated');
    }

    const sqlQuery = query || `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\` LIMIT 1000`;
    
    const response = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sqlQuery,
          useLegacySql: false,
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to execute BigQuery query');
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`BigQuery error: ${data.errors[0].message}`);
    }
    
    // Parse schema
    const columns: Column[] = data.schema.fields.map((field: any) => ({
      name: field.name,
      type: mapBigQueryType(field.type),
      nullable: field.mode !== 'REQUIRED',
    }));
    
    // Parse rows
    const rows = data.rows?.map((row: any) => {
      const obj: any = {};
      row.f.forEach((cell: any, index: number) => {
        const column = columns[index];
        obj[column.name] = parseValue(cell.v, column.type);
      });
      return obj;
    }) || [];
    
    return {
      id: `bigquery_${projectId}_${datasetId}_${tableId}`,
      name: `${datasetId}.${tableId}`,
      type: 'bigQuery',
      datasetId,
      tableId,
      columns,
      rows,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching BigQuery data:', error);
    throw error;
  }
};

export const listBigQueryDatasets = async (projectId: string): Promise<Array<{ id: string; name: string }>> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/datasets`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to list BigQuery datasets');
    }
    
    const data = await response.json();
    return data.datasets?.map((dataset: any) => ({
      id: dataset.datasetReference.datasetId,
      name: dataset.friendlyName || dataset.datasetReference.datasetId,
    })) || [];
  } catch (error) {
    console.error('Error listing BigQuery datasets:', error);
    throw error;
  }
};

export const listBigQueryTables = async (
  projectId: string,
  datasetId: string
): Promise<Array<{ id: string; name: string }>> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/datasets/${datasetId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to list BigQuery tables');
    }
    
    const data = await response.json();
    return data.tables?.map((table: any) => ({
      id: table.tableReference.tableId,
      name: table.friendlyName || table.tableReference.tableId,
    })) || [];
  } catch (error) {
    console.error('Error listing BigQuery tables:', error);
    throw error;
  }
};

const mapBigQueryType = (bigQueryType: string): 'string' | 'number' | 'date' | 'boolean' => {
  switch (bigQueryType) {
    case 'INTEGER':
    case 'FLOAT':
    case 'NUMERIC':
      return 'number';
    case 'BOOLEAN':
      return 'boolean';
    case 'DATE':
    case 'DATETIME':
    case 'TIMESTAMP':
      return 'date';
    default:
      return 'string';
  }
};

const parseValue = (value: any, type: 'string' | 'number' | 'date' | 'boolean' | 'timestamp'): any => {
  if (value === null || value === undefined) return null;
  
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'date':
    case 'timestamp':
      return new Date(value);
    default:
      return String(value);
  }
};
