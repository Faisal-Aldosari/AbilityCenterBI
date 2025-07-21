import type { Dataset, AIChatMessage, AIAnalysis, Dashboard } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
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
    datasets: Dataset[]
  ): Promise<AIChatMessage> {
    // Try real Gemini API first, fallback to intelligent responses
    try {
      if (GEMINI_API_KEY) {
        const response = await this.callGeminiAPI(this.buildChatPrompt(message, datasets));
        const aiMessage: AIChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        this.conversationHistory.push(aiMessage);
        return aiMessage;
      }
    } catch (error) {
      console.warn('Gemini API unavailable, using fallback responses');
    }

    // Fallback to intelligent pre-programmed responses
    const lowerMessage = message.toLowerCase();
    let responseContent = '';
    
    if (lowerMessage.includes('chart') || lowerMessage.includes('visualization')) {
      if (datasets.length === 0) {
        responseContent = "I'd love to help you create charts! However, I don't see any data sources connected yet. Please connect a data source first by going to the Data Sources page.";
      } else {
        const dataset = datasets[0];
        const columns = Object.keys(dataset.rows[0] || {});
        const numericColumns = columns.filter(col => 
          dataset.rows.some(row => !isNaN(Number(row[col])))
        );
        
        responseContent = `Based on your data "${dataset.name}", I suggest these chart options:
        
• **Bar Chart**: Great for comparing ${numericColumns.slice(0, 2).join(', ')} across different categories
• **Line Chart**: Perfect for showing trends over time if you have date columns
• **Pie Chart**: Ideal for showing proportions and percentages
• **Scatter Plot**: Excellent for finding correlations between numeric variables

Your data has ${dataset.rows.length} rows with columns: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? '...' : ''}. 

Would you like me to help you create a specific chart type?`;
      }
    } else if (lowerMessage.includes('report') || lowerMessage.includes('summary')) {
      if (datasets.length === 0) {
        responseContent = "I can help generate comprehensive reports! First, please connect your data sources, then I can create detailed analysis reports with insights and recommendations.";
      } else {
        const totalRows = datasets.reduce((sum, ds) => sum + ds.rows.length, 0);
        responseContent = `I can generate several types of reports for your ${datasets.length} data source(s) containing ${totalRows} total records:

• **Executive Summary**: High-level overview with key metrics
• **Detailed Analysis**: In-depth breakdown of trends and patterns  
• **Performance Report**: KPI tracking and goal comparisons
• **Financial Report**: Revenue, costs, and profitability analysis

Would you like me to create a specific type of report?`;
      }
    } else if (lowerMessage.includes('insight') || lowerMessage.includes('analyze')) {
      if (datasets.length === 0) {
        responseContent = "I'm ready to analyze your data and provide insights! Please connect a data source first, and I'll help you discover patterns, trends, and opportunities in your data.";
      } else {
        responseContent = `I can provide several types of analysis for your data:

• **Trend Analysis**: Identify patterns over time
• **Statistical Summary**: Key metrics and distributions  
• **Outlier Detection**: Find unusual data points
• **Correlation Analysis**: Discover relationships between variables
• **Performance Metrics**: Calculate KPIs and benchmarks

What specific aspect would you like me to analyze?`;
      }
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      responseContent = `I'm your AI Business Intelligence assistant! Here's what I can help you with:

🔍 **Data Analysis**: Ask questions about your data and get instant insights
📊 **Chart Recommendations**: Get suggestions for the best visualizations
📈 **Report Generation**: Create comprehensive business reports
💡 **Data Insights**: Discover patterns and trends automatically
🎯 **KPI Tracking**: Monitor key performance indicators
📋 **Data Summaries**: Quick overviews of your datasets

Just ask me anything about your data in plain English! For example:
- "What charts work best for my sales data?"
- "Generate a monthly performance report"
- "Show me trends in my revenue data"`;
    } else {
      // Default response for general questions
      responseContent = `I understand you're asking about "${message}". I'm here to help with your business intelligence needs! 

I can assist with data analysis, chart creation, report generation, and finding insights in your data. 

${datasets.length > 0 
        ? `I can see you have ${datasets.length} data source(s) connected. Feel free to ask me about trends, patterns, or what visualizations might work best for your data.`
        : 'To get started, try connecting a data source, then ask me to analyze it or suggest charts!'
      }

What would you like to explore?`;
    }
    
    const aiMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };
    
    this.conversationHistory.push(aiMessage);
    return aiMessage;
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

  private buildChatPrompt(message: string, datasets: Dataset[]): string {
    const datasetInfo = datasets.map(d => 
      `${d.name}: ${d.columns.map(c => c.name).join(', ')} (${d.rows.length} rows)`
    ).join('\n');

    const conversationContext = this.conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `You are an AI business intelligence assistant for Ability Center BI. Help the user analyze their data and create reports.

Available Datasets:
${datasetInfo}

Recent Conversation:
${conversationContext}

User Message: ${message}

Provide helpful, accurate responses about data analysis, chart creation, business insights, and reporting. Keep responses concise and actionable.`;
  }

  getConversationHistory(): AIChatMessage[] {
    return this.conversationHistory;
  }

  clearConversationHistory(): void {
    this.conversationHistory = [];
  }
}

export const geminiService = new GeminiService();
