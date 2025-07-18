import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import type { AIChatMessage, Dataset } from '../types';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = new GeminiService();

  // Initialize welcome message based on user's data
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const datasetCount = datasets.length;
      const totalRows = datasets.reduce((sum, dataset) => sum + dataset.rows.length, 0);
      
      let welcomeContent = `Hello! I'm your AI assistant for data analysis. `;
      
      if (datasetCount > 0) {
        welcomeContent += `I can see you have ${datasetCount} dataset(s) with ${totalRows} total records. `;
      } else {
        welcomeContent += `I notice you haven't connected any data sources yet. `;
      }
      
      welcomeContent += `I can help you with:

📊 **Creating Charts & Visualizations**
• Suggest the best chart types for your data
• Help design interactive dashboards
• Analyze trends and patterns

📋 **Generating Reports**
• Create comprehensive PDF reports
• Export data in multiple formats
• Generate summary insights

🔗 **Data Management**
• Connect new data sources (Google Sheets, CSV)
• Transform and filter your data
• Combine multiple datasets

💡 **Analysis & Insights**
• Identify trends and anomalies
• Provide data-driven recommendations
• Answer questions about your data

What would you like to explore today?`;

      const welcomeMessage: AIChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
    }
  }, [isOpen, datasets, messages.length]);

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
      // Get AI response
      const responseContent = await geminiService.generateResponse(currentInput, datasets);
      
      const aiMessage: AIChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle specific actions based on keywords
      if (currentInput.toLowerCase().includes('chart') || currentInput.toLowerCase().includes('visualization')) {
        const chartSuggestion = {
          type: 'bar',
          message: 'I recommend creating a bar chart for this data analysis.'
        };
        onSuggestChart(chartSuggestion);
      }

      if (currentInput.toLowerCase().includes('report') || currentInput.toLowerCase().includes('export')) {
        const reportSuggestion = {
          type: 'pdf',
          message: 'I can help you generate a comprehensive report from your data.'
        };
        onGenerateReport(reportSuggestion);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: AIChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      icon: ChartBarIcon,
      label: 'Create Chart',
      message: 'Help me create a chart from my data',
    },
    {
      icon: DocumentTextIcon,
      label: 'Generate Report',
      message: 'Generate a comprehensive report from my datasets',
    },
    {
      icon: LightBulbIcon,
      label: 'Get Insights',
      message: 'What insights can you provide about my data?',
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col"
          style={{ boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
              >
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: '#2E2C6E' }}>
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-600">
                  Powered by Gemini AI
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl p-4 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => setInput(action.message)}
                      className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="h-5 w-5 mb-1" style={{ color: '#8B5CF6' }} />
                      <span className="text-xs text-gray-700">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your data..."
                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !isLoading 
                    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                    : '#E5E7EB',
                  color: input.trim() && !isLoading ? 'white' : '#9CA3AF',
                }}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GeminiChatPanel;