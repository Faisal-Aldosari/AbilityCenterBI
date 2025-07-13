import type { Dataset, AIChatMessage, AIAnalysis, Dashboard } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class GeminiService {
  private conversationHistory: AIChatMessage[] = [];

  async analyzeData(dataset: Dataset, question: string): Promise<string> {
    const prompt = this.buildDataAnalysisPrompt(dataset, question);
    
    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error('Error analyzing data with Gemini:', error);
      throw new Error('Failed to analyze data');
    }
  }

  async generateInsights(datasets: Dataset[]): Promise<AIAnalysis[]> {
    const insights: AIAnalysis[] = [];
    
    for (const dataset of datasets) {
      const prompt = this.buildInsightPrompt(dataset);
      
      try {
        const response = await this.callGeminiAPI(prompt);
        const analysis = this.parseInsightResponse(response, dataset);
        insights.push(...analysis);
      } catch (error) {
        console.error(`Error generating insights for ${dataset.name}:`, error);
      }
    }
    
    return insights;
  }

  async suggestChartType(dataset: Dataset, userIntent?: string): Promise<{
    chartType: string;
    reasoning: string;
    config: any;
  }> {
    const prompt = this.buildChartSuggestionPrompt(dataset, userIntent);
    
    try {
      const response = await this.callGeminiAPI(prompt);
      return this.parseChartSuggestion(response);
    } catch (error) {
      console.error('Error suggesting chart type:', error);
      throw new Error('Failed to suggest chart type');
    }
  }

  async createFinancialReport(dashboard: Dashboard, reportType: string): Promise<string> {
    const prompt = this.buildFinancialReportPrompt(dashboard, reportType);
    
    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error('Error creating financial report:', error);
      throw new Error('Failed to create financial report');
    }
  }

  async chatWithData(
    message: string, 
    datasets: Dataset[], 
    context?: { charts?: any[]; dashboard?: Dashboard }
  ): Promise<AIChatMessage> {
    const prompt = this.buildChatPrompt(message, datasets, context);
    
    try {
      const response = await this.callGeminiAPI(prompt);
      
      const aiMessage: AIChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      this.conversationHistory.push(aiMessage);
      return aiMessage;
    } catch (error) {
      console.error('Error in chat:', error);
      throw new Error('Failed to process chat message');
    }
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  }

  private buildDataAnalysisPrompt(dataset: Dataset, question: string): string {
    const dataPreview = dataset.rows.slice(0, 5).map(row => 
      Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')
    ).join('\n');

    const columns = dataset.columns.map(col => `${col.name} (${col.type})`).join(', ');

    return `
You are a financial data analyst. Analyze the following dataset and answer the user's question.

Dataset: ${dataset.name}
Columns: ${columns}
Sample Data:
${dataPreview}

User Question: ${question}

Please provide a detailed analysis including:
1. Direct answer to the question
2. Key insights from the data
3. Recommendations for further analysis
4. Potential chart types that would visualize this analysis well

Format your response in a clear, professional manner.
`;
  }

  private buildInsightPrompt(dataset: Dataset): string {
    const stats = this.calculateBasicStats(dataset);
    
    return `
Analyze the following financial dataset and provide 3-5 key insights:

Dataset: ${dataset.name}
Columns: ${dataset.columns.map(col => `${col.name} (${col.type})`).join(', ')}
Total Records: ${dataset.rows.length}

Statistics: ${JSON.stringify(stats, null, 2)}

Please identify:
1. Trends and patterns
2. Anomalies or outliers
3. Correlations between variables
4. Business implications
5. Risk factors

Return insights in JSON format with fields: type, title, description, confidence, suggestions.
`;
  }

  private buildChartSuggestionPrompt(dataset: Dataset, userIntent?: string): string {
    return `
Suggest the best chart type for visualizing this financial data:

Dataset: ${dataset.name}
Columns: ${dataset.columns.map(col => `${col.name} (${col.type})`).join(', ')}
User Intent: ${userIntent || 'General visualization'}

Available chart types: bar, line, pie, scatter, area, doughnut, radar, candlestick, waterfall, treemap, heatmap, gauge, funnel, sankey, bubble, histogram, boxplot

Return a JSON response with:
{
  "chartType": "recommended_chart_type",
  "reasoning": "explanation of why this chart type is best",
  "config": {
    "xAxis": "recommended_x_column",
    "yAxis": "recommended_y_column",
    "additionalConfig": {}
  }
}
`;
  }

  private buildFinancialReportPrompt(dashboard: Dashboard, reportType: string): string {
    return `
Create a comprehensive ${reportType} financial report based on this dashboard:

Dashboard: ${dashboard.name}
Description: ${dashboard.description || 'No description'}
Charts: ${dashboard.charts.length}
Datasets: ${dashboard.datasets.map(d => d.name).join(', ')}

Include:
1. Executive Summary
2. Key Performance Indicators
3. Financial Metrics Analysis
4. Trends and Patterns
5. Risk Assessment
6. Recommendations
7. Appendix with data sources

Format as a professional financial report with clear sections and actionable insights.
`;
  }

  private buildChatPrompt(
    message: string, 
    datasets: Dataset[], 
    context?: { charts?: any[]; dashboard?: Dashboard }
  ): string {
    const datasetInfo = datasets.map(d => 
      `${d.name}: ${d.columns.map(c => c.name).join(', ')} (${d.rows.length} rows)`
    ).join('\n');

    const conversationContext = this.conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `
You are an AI financial analyst assistant. Help the user analyze their data and create reports.

Available Datasets:
${datasetInfo}

${context?.dashboard ? `Current Dashboard: ${context.dashboard.name}` : ''}
${context?.charts ? `Active Charts: ${context.charts.length}` : ''}

Recent Conversation:
${conversationContext}

User Message: ${message}

Provide helpful, accurate responses about data analysis, chart creation, financial insights, and reporting. If the user asks to create charts or reports, provide specific recommendations with technical details.
`;
  }

  private calculateBasicStats(dataset: Dataset): any {
    const numericColumns = dataset.columns.filter(col => col.type === 'number');
    const stats: any = {};

    numericColumns.forEach(col => {
      const values = dataset.rows
        .map(row => parseFloat(row[col.name]))
        .filter(val => !isNaN(val));

      if (values.length > 0) {
        stats[col.name] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
        };
      }
    });

    return stats;
  }

  private parseInsightResponse(response: string, dataset: Dataset): AIAnalysis[] {
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Fallback if response isn't valid JSON
      return [{
        id: Date.now().toString(),
        type: 'insight',
        title: 'AI Analysis',
        description: response,
        confidence: 0.8,
        data: dataset.id,
      }];
    }
  }

  private parseChartSuggestion(response: string): any {
    try {
      return JSON.parse(response);
    } catch {
      return {
        chartType: 'bar',
        reasoning: 'Default recommendation due to parsing error',
        config: {},
      };
    }
  }

  getConversationHistory(): AIChatMessage[] {
    return this.conversationHistory;
  }

  clearConversationHistory(): void {
    this.conversationHistory = [];
  }
}

export const geminiService = new GeminiService();
