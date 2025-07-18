import type { Dataset, Column } from '../types';
import { getAccessToken } from './auth';

export const fetchGoogleSheetData = async (
  spreadsheetId: string,
  sheetName?: string
): Promise<Dataset> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Please sign in with Google to access your sheets');
    }

    // First, get sheet metadata
    const metadataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json();
      console.error('Metadata fetch error:', errorData);
      throw new Error(`Failed to fetch spreadsheet: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const metadata = await metadataResponse.json();
    const targetSheet = sheetName 
      ? metadata.sheets.find((sheet: any) => sheet.properties.title === sheetName)
      : metadata.sheets[0];
    
    if (!targetSheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }
    
    const range = `${targetSheet.properties.title}!A:ZZ`;
    
    // Fetch sheet data
    const dataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!dataResponse.ok) {
      const errorData = await dataResponse.json();
      console.error('Data fetch error:', errorData);
      throw new Error(`Failed to fetch sheet data: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await dataResponse.json();
    const rows = data.values || [];
    
    if (rows.length === 0) {
      throw new Error('Sheet is empty');
    }
    
    // Parse headers and data
    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    // Infer column types
    const columns: Column[] = headers.map((header: string, index: number) => {
      const sampleValues = dataRows
        .slice(0, 10)
        .map((row: any) => row[index])
        .filter((val: any) => val !== null && val !== undefined && val !== '');
      
      const type = inferColumnType(sampleValues);
      
      return {
        name: header,
        type,
        nullable: true,
      };
    });
    
    // Convert data rows to objects
    const processedRows = dataRows.map((row: any) => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });
    
    return {
      id: `sheets_${spreadsheetId}_${targetSheet.properties.title}`,
      name: metadata.properties.title,
      type: 'googleSheets',
      spreadsheetId,
      sheetName: targetSheet.properties.title,
      columns,
      rows: processedRows,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    throw error;
  }
};

export const listGoogleSheets = async (): Promise<Array<{ id: string; name: string }>> => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Please sign in with Google to access your sheets');
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('List sheets error:', errorData);
      throw new Error(`Failed to list Google Sheets: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
    }));
  } catch (error) {
    console.error('Error listing Google Sheets:', error);
    throw error;
  }
};

const inferColumnType = (values: any[]): 'string' | 'number' | 'date' | 'boolean' => {
  if (values.length === 0) return 'string';
  
  // Check if all values are numbers
  const numericValues = values.filter(val => !isNaN(Number(val)));
  if (numericValues.length === values.length) {
    return 'number';
  }
  
  // Check if all values are dates
  const dateValues = values.filter(val => !isNaN(Date.parse(val)));
  if (dateValues.length === values.length) {
    return 'date';
  }
  
  // Check if all values are booleans
  const booleanValues = values.filter(val => 
    val.toLowerCase() === 'true' || 
    val.toLowerCase() === 'false' ||
    val === '1' ||
    val === '0'
  );
  if (booleanValues.length === values.length) {
    return 'boolean';
  }
  
  return 'string';
};
