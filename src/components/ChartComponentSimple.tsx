import type { Chart as ChartType } from '../types';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale
);

interface ChartComponentProps {
  chart: ChartType;
  data: any[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chart, data }) => {
  const generateChartData = () => {
    const { config } = chart;
    
    if (!config.xAxis || !config.yAxis || !data.length) {
      return {
        labels: [],
        datasets: []
      };
    }

    const yAxisColumn = Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis;
    const labels = data.map(row => row[config.xAxis!]);
    const values = data.map(row => parseFloat(row[yAxisColumn]) || 0);

    switch (chart.type) {
      case 'bar':
      case 'line':
      case 'area':
        return {
          labels,
          datasets: [
            {
              label: chart.name,
              data: values,
              backgroundColor: config.colors?.[0] || 'rgba(54, 162, 235, 0.2)',
              borderColor: config.colors?.[0] || 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: chart.type === 'area',
            },
          ],
        };
      
      case 'pie':
      case 'doughnut':
        return {
          labels,
          datasets: [
            {
              label: chart.name,
              data: values,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        };
      
      case 'scatter':
        return {
          datasets: [
            {
              label: chart.name,
              data: data.map(row => ({
                x: parseFloat(row[config.xAxis!]) || 0,
                y: parseFloat(row[yAxisColumn]) || 0,
              })),
              backgroundColor: config.colors?.[0] || 'rgba(54, 162, 235, 0.6)',
            },
          ],
        };
      
      case 'radar':
        return {
          labels,
          datasets: [
            {
              label: chart.name,
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            },
          ],
        };
      
      default:
        return {
          labels,
          datasets: [
            {
              label: chart.name,
              data: values,
              backgroundColor: config.colors?.[0] || 'rgba(54, 162, 235, 0.2)',
              borderColor: config.colors?.[0] || 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };
    }
  };

  const renderChart = () => {
    const chartData = generateChartData();
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: config.showLegend !== false,
        },
        title: {
          display: !!config.title,
          text: config.title,
        },
      },
      scales: config.showGrid !== false ? {
        y: {
          beginAtZero: true,
        },
      } : undefined,
    };

    switch (chart.type) {
      case 'bar':
        return <Bar data={chartData as any} options={options} />;
      case 'line':
      case 'area':
        return <Line data={chartData as any} options={options} />;
      case 'pie':
        return <Pie data={chartData as any} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData as any} options={options} />;
      case 'radar':
        return <Radar data={chartData as any} options={options} />;
      case 'scatter':
        return <Scatter data={chartData as any} options={options} />;
      
      // For advanced chart types, show a placeholder for now
      case 'candlestick':
      case 'waterfall':
      case 'treemap':
      case 'heatmap':
      case 'gauge':
      case 'funnel':
      case 'sankey':
      case 'bubble':
      case 'histogram':
      case 'boxplot':
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="text-gray-500 mb-2">
                {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
              </div>
              <div className="text-sm text-gray-400">
                Advanced chart type - Coming soon
              </div>
            </div>
          </div>
        );
      
      default:
        return <Bar data={chartData as any} options={options} />;
    }
  };

  const { config } = chart;

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
      style={{
        width: chart.size?.width || 400,
        height: chart.size?.height || 300,
        position: 'relative',
      }}
    >
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
