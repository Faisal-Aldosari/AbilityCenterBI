import type { Dataset, Chart, Dashboard } from '../types';

export const generateSampleFinanceData = (): Dataset[] => {
  // Sample income statement data
  const incomeStatementData = {
    id: 'income_statement_2024',
    name: 'Income Statement Q1-Q4 2024',
    type: 'googleSheets' as const,
    columns: [
      { name: 'Quarter', type: 'string' as const },
      { name: 'Revenue', type: 'number' as const },
      { name: 'Cost_of_Goods_Sold', type: 'number' as const },
      { name: 'Gross_Profit', type: 'number' as const },
      { name: 'Operating_Expenses', type: 'number' as const },
      { name: 'Net_Income', type: 'number' as const },
    ],
    rows: [
      {
        Quarter: 'Q1 2024',
        Revenue: 250000,
        Cost_of_Goods_Sold: 150000,
        Gross_Profit: 100000,
        Operating_Expenses: 60000,
        Net_Income: 40000,
      },
      {
        Quarter: 'Q2 2024',
        Revenue: 280000,
        Cost_of_Goods_Sold: 160000,
        Gross_Profit: 120000,
        Operating_Expenses: 65000,
        Net_Income: 55000,
      },
      {
        Quarter: 'Q3 2024',
        Revenue: 320000,
        Cost_of_Goods_Sold: 180000,
        Gross_Profit: 140000,
        Operating_Expenses: 70000,
        Net_Income: 70000,
      },
      {
        Quarter: 'Q4 2024',
        Revenue: 350000,
        Cost_of_Goods_Sold: 190000,
        Gross_Profit: 160000,
        Operating_Expenses: 75000,
        Net_Income: 85000,
      },
    ],
    lastUpdated: new Date(),
  };

  // Sample balance sheet data
  const balanceSheetData = {
    id: 'balance_sheet_2024',
    name: 'Balance Sheet 2024',
    type: 'googleSheets' as const,
    columns: [
      { name: 'Account', type: 'string' as const },
      { name: 'Q1_2024', type: 'number' as const },
      { name: 'Q2_2024', type: 'number' as const },
      { name: 'Q3_2024', type: 'number' as const },
      { name: 'Q4_2024', type: 'number' as const },
    ],
    rows: [
      {
        Account: 'Cash and Cash Equivalents',
        Q1_2024: 50000,
        Q2_2024: 65000,
        Q3_2024: 85000,
        Q4_2024: 120000,
      },
      {
        Account: 'Accounts Receivable',
        Q1_2024: 75000,
        Q2_2024: 85000,
        Q3_2024: 95000,
        Q4_2024: 110000,
      },
      {
        Account: 'Inventory',
        Q1_2024: 100000,
        Q2_2024: 110000,
        Q3_2024: 125000,
        Q4_2024: 140000,
      },
      {
        Account: 'Total Current Assets',
        Q1_2024: 225000,
        Q2_2024: 260000,
        Q3_2024: 305000,
        Q4_2024: 370000,
      },
      {
        Account: 'Accounts Payable',
        Q1_2024: 45000,
        Q2_2024: 50000,
        Q3_2024: 55000,
        Q4_2024: 60000,
      },
      {
        Account: 'Total Current Liabilities',
        Q1_2024: 65000,
        Q2_2024: 70000,
        Q3_2024: 75000,
        Q4_2024: 80000,
      },
    ],
    lastUpdated: new Date(),
  };

  // Sample cash flow data
  const cashFlowData = {
    id: 'cash_flow_2024',
    name: 'Cash Flow Statement 2024',
    type: 'bigQuery' as const,
    columns: [
      { name: 'Month', type: 'string' as const },
      { name: 'Operating_Cash_Flow', type: 'number' as const },
      { name: 'Investing_Cash_Flow', type: 'number' as const },
      { name: 'Financing_Cash_Flow', type: 'number' as const },
      { name: 'Net_Cash_Flow', type: 'number' as const },
    ],
    rows: [
      {
        Month: 'Jan 2024',
        Operating_Cash_Flow: 15000,
        Investing_Cash_Flow: -5000,
        Financing_Cash_Flow: 0,
        Net_Cash_Flow: 10000,
      },
      {
        Month: 'Feb 2024',
        Operating_Cash_Flow: 18000,
        Investing_Cash_Flow: -2000,
        Financing_Cash_Flow: 0,
        Net_Cash_Flow: 16000,
      },
      {
        Month: 'Mar 2024',
        Operating_Cash_Flow: 22000,
        Investing_Cash_Flow: -8000,
        Financing_Cash_Flow: 5000,
        Net_Cash_Flow: 19000,
      },
      {
        Month: 'Apr 2024',
        Operating_Cash_Flow: 25000,
        Investing_Cash_Flow: -3000,
        Financing_Cash_Flow: 0,
        Net_Cash_Flow: 22000,
      },
      {
        Month: 'May 2024',
        Operating_Cash_Flow: 28000,
        Investing_Cash_Flow: -10000,
        Financing_Cash_Flow: 0,
        Net_Cash_Flow: 18000,
      },
      {
        Month: 'Jun 2024',
        Operating_Cash_Flow: 30000,
        Investing_Cash_Flow: -5000,
        Financing_Cash_Flow: 10000,
        Net_Cash_Flow: 35000,
      },
    ],
    lastUpdated: new Date(),
  };

  // Sample financial ratios data
  const financialRatiosData = {
    id: 'financial_ratios_2024',
    name: 'Financial Ratios 2024',
    type: 'googleSheets' as const,
    columns: [
      { name: 'Ratio', type: 'string' as const },
      { name: 'Q1_2024', type: 'number' as const },
      { name: 'Q2_2024', type: 'number' as const },
      { name: 'Q3_2024', type: 'number' as const },
      { name: 'Q4_2024', type: 'number' as const },
      { name: 'Industry_Average', type: 'number' as const },
    ],
    rows: [
      {
        Ratio: 'Current Ratio',
        Q1_2024: 3.46,
        Q2_2024: 3.71,
        Q3_2024: 4.07,
        Q4_2024: 4.63,
        Industry_Average: 2.5,
      },
      {
        Ratio: 'Quick Ratio',
        Q1_2024: 1.92,
        Q2_2024: 2.14,
        Q3_2024: 2.40,
        Q4_2024: 2.88,
        Industry_Average: 1.3,
      },
      {
        Ratio: 'Debt to Equity',
        Q1_2024: 0.41,
        Q2_2024: 0.37,
        Q3_2024: 0.33,
        Q4_2024: 0.28,
        Industry_Average: 0.6,
      },
      {
        Ratio: 'ROE (%)',
        Q1_2024: 25.0,
        Q2_2024: 28.9,
        Q3_2024: 30.4,
        Q4_2024: 32.1,
        Industry_Average: 15.0,
      },
      {
        Ratio: 'Gross Margin (%)',
        Q1_2024: 40.0,
        Q2_2024: 42.9,
        Q3_2024: 43.8,
        Q4_2024: 45.7,
        Industry_Average: 35.0,
      },
    ],
    lastUpdated: new Date(),
  };

  return [incomeStatementData, balanceSheetData, cashFlowData, financialRatiosData];
};

export const generateSampleCharts = (datasets: Dataset[]): Chart[] => {
  const charts: Chart[] = [];

  if (datasets.length > 0) {
    // Revenue trend chart
    charts.push({
      id: 'revenue_trend',
      name: 'Quarterly Revenue Trend',
      type: 'line',
      datasetId: datasets[0].id,
      config: {
        xAxis: 'Quarter',
        yAxis: 'Revenue',
        title: 'Revenue Growth Over Time',
        showLegend: true,
        showGrid: true,
        colors: ['#059669'],
      },
      position: { x: 0, y: 0 },
      size: { width: 500, height: 300 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Profit margin comparison
    charts.push({
      id: 'profit_comparison',
      name: 'Profit Components',
      type: 'bar',
      datasetId: datasets[0].id,
      config: {
        xAxis: 'Quarter',
        yAxis: 'Gross_Profit',
        title: 'Gross Profit by Quarter',
        showLegend: true,
        showGrid: true,
        colors: ['#3B82F6'],
      },
      position: { x: 520, y: 0 },
      size: { width: 500, height: 300 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Net income pie chart for latest quarter
    charts.push({
      id: 'income_breakdown',
      name: 'Q4 2024 Income Breakdown',
      type: 'pie',
      datasetId: datasets[0].id,
      config: {
        xAxis: 'Quarter',
        yAxis: 'Net_Income',
        title: 'Income Distribution',
        showLegend: true,
        colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      },
      position: { x: 0, y: 320 },
      size: { width: 400, height: 300 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (datasets.length > 2) {
    // Cash flow trend
    charts.push({
      id: 'cash_flow_trend',
      name: 'Monthly Cash Flow',
      type: 'line',
      datasetId: datasets[2].id,
      config: {
        xAxis: 'Month',
        yAxis: 'Net_Cash_Flow',
        title: 'Net Cash Flow Trend',
        showLegend: true,
        showGrid: true,
        colors: ['#06B6D4'],
      },
      position: { x: 420, y: 320 },
      size: { width: 500, height: 300 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (datasets.length > 3) {
    // Financial ratios radar chart
    charts.push({
      id: 'financial_ratios_radar',
      name: 'Financial Ratios vs Industry',
      type: 'radar',
      datasetId: datasets[3].id,
      config: {
        xAxis: 'Ratio',
        yAxis: 'Q4_2024',
        title: 'Performance vs Industry Average',
        showLegend: true,
        colors: ['#8B5CF6'],
      },
      position: { x: 0, y: 640 },
      size: { width: 450, height: 350 },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return charts;
};

export const generateSampleDashboard = (datasets: Dataset[], charts: Chart[]): Dashboard => {
  return {
    id: 'financial_dashboard_2024',
    name: 'Financial Performance Dashboard 2024',
    description: 'Comprehensive view of financial performance including income, cash flow, and key ratios',
    charts,
    datasets,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'sample-user',
  };
};

export const loadSampleData = () => {
  const datasets = generateSampleFinanceData();
  const charts = generateSampleCharts(datasets);
  const dashboard = generateSampleDashboard(datasets, charts);

  // Save to localStorage
  localStorage.setItem('abi_datasets', JSON.stringify(datasets));
  localStorage.setItem('abi_charts', JSON.stringify(charts));
  localStorage.setItem('abi_dashboards', JSON.stringify([dashboard]));

  return { datasets, charts, dashboard };
};
