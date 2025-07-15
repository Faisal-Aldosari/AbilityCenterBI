import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import type { AIChatMessage, AIAnalysis, Dataset } from '../types';
import { GeminiService } from '../services/gemini';

interface GeminiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  datasets: Dataset[];
  onSuggestChart: (suggestion: any) => void;
  onGenerateReport: (report: any) => void;
}

const GeminiChatPanel: React.FC<GeminiChatPanelProps> = ({
  isOpen,
  onClose,
  datasets,
  onSuggestChart,
  onGenerateReport,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<AIAnalysis[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = new GeminiService();

  // Initialize welcome message based on user's data
  useEffect(() => {
    const initializeChat = () => {
      const datasetCount = datasets.length;
      const totalRows = datasets.reduce((sum, dataset) => sum + dataset.rows.length, 0);
      
      let welcomeContent = `Hello! I'm your AI assistant for data analysis. `;
      
      if (datasetCount > 0) {
        welcomeContent += `I can see you have ${datasetCount} dataset(s) with ${totalRows} total records. `;
      } else {
        welcomeContent += `I notice you haven't connected any data sources yet. `;
      }
      
      welcomeContent += `I can help you with:

• Creating charts and visualizations from your data
• Generating comprehensive reports (PDF, CSV, Excel)
• Setting up data filters and transformations
• Analyzing your connected datasets
• Providing insights and recommendations
• Connecting new data sources (Google Sheets, BigQuery, CSV)

What would you like to explore today?`;

      const welcomeMessage: AIChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
    };

    initializeChat();
  }, [datasets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Generate intelligent response based on keywords
      let responseContent = '';
      
      if (currentInput.toLowerCase().includes('chart') || currentInput.toLowerCase().includes('visualization')) {
        responseContent = generateChartResponse(currentInput, datasets);
        // Suggest chart creation
        const chartSuggestion = {
          type: getChartTypeFromInput(currentInput),
          title: `${datasets.length > 0 ? datasets[0].name : 'Data'} Visualization`,
          datasetId: datasets.length > 0 ? datasets[0].id : null,
          columns: datasets.length > 0 ? datasets[0].columns.slice(0, 2) : []
        };
        onSuggestChart(chartSuggestion);
      } else if (currentInput.toLowerCase().includes('report') || currentInput.toLowerCase().includes('analysis')) {
        responseContent = generateReportResponse(currentInput, datasets);
        // Suggest report generation
        const reportSuggestion = {
          type: 'comprehensive',
          title: 'Data Analysis Report',
          datasets: datasets,
          timestamp: new Date()
        };
        onGenerateReport(reportSuggestion);
      } else if (currentInput.toLowerCase().includes('filter') || currentInput.toLowerCase().includes('search')) {
        responseContent = generateFilterResponse(currentInput, datasets);
      } else if (currentInput.toLowerCase().includes('data') || currentInput.toLowerCase().includes('source')) {
        responseContent = generateDataResponse(currentInput, datasets);
      } else {
        responseContent = generateGeneralResponse(currentInput, datasets);
      }
      
      const assistantMessage: AIChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: AIChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or check your connection.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartResponse = (input: string, datasets: Dataset[]): string => {
    const chartType = getChartTypeFromInput(input);
    
    if (datasets.length === 0) {
      return `I'd love to help you create a ${chartType} chart! However, you'll need to connect some data sources first. Please visit the Data Sources page to upload a CSV file or connect Google Sheets/BigQuery data.`;
    }
    
    const datasetInfo = ` using your "${datasets[0].name}" dataset`;
    const availableColumns = datasets[0].columns.map(col => col.name).join(', ');
    
    return `Perfect! I can help you create a ${chartType} chart${datasetInfo}. 

**Available columns**: ${availableColumns}

I've prepared a chart suggestion for you. You can customize the chart type, select different columns, and adjust styling in the Charts section. Which columns would you like to visualize?`;
  };

  const generateReportResponse = (input: string, datasets: Dataset[]): string => {
    const reportType = input.toLowerCase().includes('financial') ? 'financial' : 
                     input.toLowerCase().includes('summary') ? 'summary' : 'comprehensive';
    
    if (datasets.length === 0) {
      return `I can help you generate a ${reportType} report, but you'll need to connect data sources first. Once you have data uploaded, I can create detailed reports in PDF, CSV, or Excel format.`;
    }
    
    const totalRows = datasets.reduce((sum, dataset) => sum + dataset.rows.length, 0);
    
    return `Excellent! I'll help you generate a ${reportType} report using your ${datasets.length} data source(s) with ${totalRows} total records. 

The report will include:
• Key metrics and statistics
• Data trends and patterns  
• Visual charts and graphs
• Export options (PDF, CSV, Excel)

You can find generated reports in the Reports section. Would you like me to create this report now?`;
  };

  const generateFilterResponse = (_input: string, datasets: Dataset[]): string => {
    if (datasets.length === 0) {
      return `I can help you with data filtering once you have data sources connected. Filters allow you to narrow down your data based on specific criteria and conditions.`;
    }
    
    let availableColumns = '';
    
    datasets.forEach((dataset) => {
      availableColumns += `\n**${dataset.name}**: ${dataset.columns.map(col => col.name).join(', ')}`;
    });
    
    return `I can help you filter your data! You can use the Advanced Filters panel to create complex conditions.

**Available columns for filtering**:${availableColumns}

**Filter options**:
• Equals, not equals, contains
• Greater than, less than (for numbers)
• Date ranges
• Multiple conditions with AND/OR logic

Which columns would you like to filter on?`;
  };

  const generateDataResponse = (_input: string, datasets: Dataset[]): string => {
    if (datasets.length === 0) {
      return `You don't have any data sources connected yet. I recommend:

• **Google Sheets**: Connect your spreadsheets directly
• **CSV Files**: Upload local data files  
• **BigQuery**: Connect to your data warehouse

Visit the Data Sources page to get started with uploading your data.`;
    }
    
    const totalRows = datasets.reduce((total, dataset) => total + dataset.rows.length, 0);
    const totalColumns = datasets.reduce((total, dataset) => total + dataset.columns.length, 0);
    
    let response = `You currently have ${datasets.length} data source(s) connected:\n\n`;
    
    datasets.forEach((dataset, index) => {
      response += `${index + 1}. **${dataset.name}** (${dataset.rows.length} rows, ${dataset.columns.length} columns)\n`;
    });
    
    response += `\n**Total**: ${totalRows} rows across ${totalColumns} columns.\n\nWould you like me to analyze any specific dataset or help you create visualizations from this data?`;
    
    return response;
  };

  const generateGeneralResponse = (_input: string, datasets: Dataset[]): string => {
    const responses = [
      `I'm here to help you analyze your data and create insights. You can ask me about creating charts, generating reports, filtering data, or connecting new data sources.`,
      `Let me help you explore your data! With ${datasets.length} dataset(s) connected, we can create visualizations, apply filters, or generate comprehensive reports.`,
      `I can assist you with data analysis tasks like creating charts, building reports, setting up filters, or connecting new data sources. What would you like to work on?`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getChartTypeFromInput = (input: string): string => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('bar') || lowerInput.includes('column')) return 'bar';
    if (lowerInput.includes('line') || lowerInput.includes('trend')) return 'line';
    if (lowerInput.includes('pie') || lowerInput.includes('donut')) return 'pie';
    if (lowerInput.includes('area')) return 'area';
    if (lowerInput.includes('scatter')) return 'scatter';
    return 'bar'; // default
  };

  const generateInsights = async () => {
    if (datasets.length === 0) return;

    setIsLoading(true);
    try {
      const dataInsights = await geminiService.generateInsights(datasets);
      setInsights(dataInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      icon: ChartBarIcon,
      label: 'Suggest Charts',
      prompt: 'What are the best chart types for my data?',
    },
    {
      icon: DocumentTextIcon,
      label: 'Generate Report',
      prompt: 'Generate a comprehensive financial report for my data.',
    },
    {
      icon: LightBulbIcon,
      label: 'Data Insights',
      prompt: 'What insights can you find in my data?',
    },
    {
      icon: SparklesIcon,
      label: 'Optimize Dashboard',
      prompt: 'How can I optimize my dashboard for better insights?',
    },
  ];

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-xs text-gray-600">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <action.icon className="w-5 h-5 text-orange-600 mb-1" />
                  <div className="text-sm font-medium text-gray-900">{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Data Insights</h3>
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      insight.confidence > 0.8 ? 'bg-green-500' : 
                      insight.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900">{insight.title}</span>
                  </div>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to AI Assistant</h3>
              <p className="text-gray-600 text-sm">
                Ask me anything about your data, request chart suggestions, or generate reports.
              </p>
              {datasets.length > 0 && (
                <button
                  onClick={generateInsights}
                  className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  Analyze My Data
                </button>
              )}
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about your data..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GeminiChatPanel;
