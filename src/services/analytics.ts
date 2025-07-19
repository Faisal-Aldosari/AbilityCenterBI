import type { Dataset } from '../types';

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

export interface DataAnalytics {
  totalDatasets: number;
  totalRows: number;
  averageColumns: number;
  dataSourceTypes: Record<string, number>;
  lastUpdated: Date;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  
  track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date(),
      userId: this.getCurrentUserId()
    };
    
    this.events.push(analyticsEvent);
    
    // In production, you would send this to your analytics service
    console.log('Analytics Event:', analyticsEvent);
  }
  
  trackDatasetCreated(dataset: Dataset) {
    this.track('dataset_created', {
      type: dataset.type,
      columns: dataset.columns.length,
      rows: dataset.rows.length,
      name: dataset.name
    });
  }
  
  trackChartCreated(chartType: string, datasetId: string) {
    this.track('chart_created', {
      chartType,
      datasetId
    });
  }
  
  trackReportGenerated(reportType: string, datasetIds: string[]) {
    this.track('report_generated', {
      reportType,
      datasetCount: datasetIds.length
    });
  }
  
  trackAIInteraction(query: string, responseLength: number) {
    this.track('ai_interaction', {
      queryLength: query.length,
      responseLength
    });
  }
  
  getDataAnalytics(datasets: Dataset[]): DataAnalytics {
    const totalRows = datasets.reduce((sum, dataset) => sum + dataset.rows.length, 0);
    const totalColumns = datasets.reduce((sum, dataset) => sum + dataset.columns.length, 0);
    const dataSourceTypes = datasets.reduce((acc, dataset) => {
      acc[dataset.type] = (acc[dataset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalDatasets: datasets.length,
      totalRows,
      averageColumns: datasets.length > 0 ? Math.round(totalColumns / datasets.length) : 0,
      dataSourceTypes,
      lastUpdated: new Date()
    };
  }
  
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
  
  clearEvents() {
    this.events = [];
  }
  
  private getCurrentUserId(): string | undefined {
    // In a real app, this would get the current user ID
    return 'anonymous';
  }
}

export const analytics = new AnalyticsService();
