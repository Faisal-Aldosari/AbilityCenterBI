export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
}

export interface Dataset {
  id: string;
  name: string;
  type: 'googleSheets' | 'bigQuery';
  url?: string;
  spreadsheetId?: string;
  sheetName?: string;
  datasetId?: string;
  tableId?: string;
  columns: Column[];
  rows: any[];
  lastUpdated: Date;
}

export interface Column {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  nullable?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Chart {
  id: string;
  name: string;
  type: ChartType;
  datasetId: string;
  config: ChartConfig;
  position: Position;
  size: Size;
  createdAt: Date;
  updatedAt: Date;
}

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'scatter' 
  | 'area' 
  | 'doughnut' 
  | 'radar'
  | 'candlestick'
  | 'waterfall'
  | 'treemap'
  | 'heatmap'
  | 'gauge'
  | 'funnel'
  | 'sankey'
  | 'bubble'
  | 'histogram'
  | 'boxplot';

export interface ChartConfig {
  xAxis?: string;
  yAxis?: string | string[];
  groupBy?: string;
  filters?: Filter[];
  colors?: string[];
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  maxValue?: number; // For gauge charts
  chartType?: ChartType;
  dataColumns?: string[];
}

export interface Filter {
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between' | 'starts_with' | 'ends_with' | 'is_null' | 'is_not_null';
  value: any;
  secondValue?: any; // For between operations
}

export interface AdvancedFilter {
  id: string;
  name: string;
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
}

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  secondValue?: any;
}

export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null'
  | 'regex';

export interface DataTransformation {
  id: string;
  type: TransformationType;
  sourceColumn: string;
  targetColumn?: string;
  parameters: Record<string, any>;
}

export type TransformationType =
  | 'aggregate_sum'
  | 'aggregate_avg'
  | 'aggregate_count'
  | 'aggregate_min'
  | 'aggregate_max'
  | 'group_by'
  | 'sort'
  | 'pivot'
  | 'unpivot'
  | 'calculate_field'
  | 'date_extract'
  | 'string_manipulation'
  | 'number_format'
  | 'currency_convert';

export interface FinanceMetric {
  id: string;
  name: string;
  formula: string;
  category: FinanceCategory;
  description: string;
}

export type FinanceCategory =
  | 'profitability'
  | 'liquidity'
  | 'efficiency'
  | 'leverage'
  | 'market_value'
  | 'growth'
  | 'risk';

export interface GeminiIntegration {
  enabled: boolean;
  apiKey?: string;
  model: 'gemini-pro' | 'gemini-pro-vision';
  maxTokens: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'chart' | 'data' | 'report';
    id: string;
    name: string;
  }[];
}

export interface AIAnalysis {
  id: string;
  type: 'insight' | 'recommendation' | 'anomaly' | 'trend';
  title: string;
  description: string;
  confidence: number;
  data: any;
  suggestions?: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  charts: Chart[];
  datasets: Dataset[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  format: 'pdf' | 'excel';
  datasetIds: string[];
  chartIds: string[];
  config: ReportConfig;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportConfig {
  includeCharts: boolean;
  includeRawData: boolean;
  pageSize: 'A4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
}
