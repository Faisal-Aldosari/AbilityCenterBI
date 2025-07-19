import type { Dataset, AdvancedFilter, FilterCondition, DataTransformation } from '../types';

export class DataTransformationService {
  
  applyFilters(dataset: Dataset, filters: AdvancedFilter[]): Dataset {
    let filteredRows = [...dataset.rows];
    
    filters.forEach(filter => {
      filteredRows = this.applyFilter(filteredRows, filter);
    });
    
    return {
      ...dataset,
      rows: filteredRows,
      id: `${dataset.id}_filtered`,
    };
  }
  
  private applyFilter(rows: any[], filter: AdvancedFilter): any[] {
    return rows.filter(row => {
      const results = filter.conditions.map(condition => 
        this.evaluateCondition(row, condition)
      );
      
      return filter.logic === 'AND' 
        ? results.every(Boolean)
        : results.some(Boolean);
    });
  }
  
  private evaluateCondition(row: any, condition: FilterCondition): boolean {
    const fieldValue = row[condition.field];
    const { operator, value, secondValue } = condition;
    
    switch (operator) {
      case 'equals':
        return fieldValue == value;
      case 'not_equals':
        return fieldValue != value;
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case 'less_than':
        return Number(fieldValue) < Number(value);
      case 'greater_equal':
        return Number(fieldValue) >= Number(value);
      case 'less_equal':
        return Number(fieldValue) <= Number(value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
      case 'between':
        return Number(fieldValue) >= Number(value) && Number(fieldValue) <= Number(secondValue);
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue);
      case 'is_null':
        return fieldValue == null || fieldValue === '';
      case 'is_not_null':
        return fieldValue != null && fieldValue !== '';
      case 'regex':
        try {
          return new RegExp(value).test(String(fieldValue));
        } catch {
          return false;
        }
      default:
        return true;
    }
  }
  
  applyTransformations(dataset: Dataset, transformations: DataTransformation[]): Dataset {
    let transformedData = { ...dataset };
    
    transformations.forEach(transformation => {
      transformedData = this.applyTransformation(transformedData, transformation);
    });
    
    return transformedData;
  }
  
  private applyTransformation(dataset: Dataset, transformation: DataTransformation): Dataset {
    const { type, sourceColumn, targetColumn, parameters } = transformation;
    
    switch (type) {
      case 'aggregate_sum':
        return this.aggregateSum(dataset, sourceColumn, parameters.groupBy);
      case 'aggregate_avg':
        return this.aggregateAvg(dataset, sourceColumn, parameters.groupBy);
      case 'aggregate_count':
        return this.aggregateCount(dataset, sourceColumn, parameters.groupBy);
      case 'aggregate_min':
        return this.aggregateMin(dataset, sourceColumn, parameters.groupBy);
      case 'aggregate_max':
        return this.aggregateMax(dataset, sourceColumn, parameters.groupBy);
      case 'group_by':
        return this.groupBy(dataset, parameters.columns);
      case 'sort':
        return this.sort(dataset, sourceColumn, parameters.direction);
      case 'pivot':
        return this.pivot(dataset, parameters.rows, parameters.columns, parameters.values);
      case 'calculate_field':
        return this.calculateField(dataset, targetColumn || '', parameters.formula);
      case 'date_extract':
        return this.extractDatePart(dataset, sourceColumn, targetColumn || '', parameters.part);
      case 'currency_convert':
        return this.convertCurrency(dataset, sourceColumn, parameters.fromCurrency, parameters.toCurrency, parameters.rate);
      default:
        return dataset;
    }
  }
  
  private aggregateSum(dataset: Dataset, column: string, groupBy?: string): Dataset {
    if (!groupBy) {
      const sum = dataset.rows.reduce((acc, row) => acc + (Number(row[column]) || 0), 0);
      return {
        ...dataset,
        rows: [{ [column]: sum }],
        columns: [{ name: column, type: 'number' }],
      };
    }
    
    const grouped = this.groupRowsBy(dataset.rows, groupBy);
    const rows = Object.entries(grouped).map(([key, rows]) => ({
      [groupBy]: key,
      [`${column}_sum`]: rows.reduce((acc, row) => acc + (Number(row[column]) || 0), 0),
    }));
    
    return {
      ...dataset,
      rows,
      columns: [
        { name: groupBy, type: 'string' },
        { name: `${column}_sum`, type: 'number' },
      ],
    };
  }
  
  private aggregateAvg(dataset: Dataset, column: string, groupBy?: string): Dataset {
    if (!groupBy) {
      const avg = dataset.rows.reduce((acc, row) => acc + (Number(row[column]) || 0), 0) / dataset.rows.length;
      return {
        ...dataset,
        rows: [{ [column]: avg }],
        columns: [{ name: column, type: 'number' }],
      };
    }
    
    const grouped = this.groupRowsBy(dataset.rows, groupBy);
    const rows = Object.entries(grouped).map(([key, rows]) => ({
      [groupBy]: key,
      [`${column}_avg`]: rows.reduce((acc, row) => acc + (Number(row[column]) || 0), 0) / rows.length,
    }));
    
    return {
      ...dataset,
      rows,
      columns: [
        { name: groupBy, type: 'string' },
        { name: `${column}_avg`, type: 'number' },
      ],
    };
  }
  
  private aggregateCount(dataset: Dataset, _column: string, groupBy?: string): Dataset {
    if (!groupBy) {
      return {
        ...dataset,
        rows: [{ count: dataset.rows.length }],
        columns: [{ name: 'count', type: 'number' }],
      };
    }
    
    const grouped = this.groupRowsBy(dataset.rows, groupBy);
    const rows = Object.entries(grouped).map(([key, rows]) => ({
      [groupBy]: key,
      count: rows.length,
    }));
    
    return {
      ...dataset,
      rows,
      columns: [
        { name: groupBy, type: 'string' },
        { name: 'count', type: 'number' },
      ],
    };
  }
  
  private aggregateMin(dataset: Dataset, column: string, groupBy?: string): Dataset {
    if (!groupBy) {
      const min = Math.min(...dataset.rows.map(row => Number(row[column]) || 0));
      return {
        ...dataset,
        rows: [{ [column]: min }],
        columns: [{ name: column, type: 'number' }],
      };
    }
    
    const grouped = this.groupRowsBy(dataset.rows, groupBy);
    const rows = Object.entries(grouped).map(([key, rows]) => ({
      [groupBy]: key,
      [`${column}_min`]: Math.min(...rows.map(row => Number(row[column]) || 0)),
    }));
    
    return {
      ...dataset,
      rows,
      columns: [
        { name: groupBy, type: 'string' },
        { name: `${column}_min`, type: 'number' },
      ],
    };
  }
  
  private aggregateMax(dataset: Dataset, column: string, groupBy?: string): Dataset {
    if (!groupBy) {
      const max = Math.max(...dataset.rows.map(row => Number(row[column]) || 0));
      return {
        ...dataset,
        rows: [{ [column]: max }],
        columns: [{ name: column, type: 'number' }],
      };
    }
    
    const grouped = this.groupRowsBy(dataset.rows, groupBy);
    const rows = Object.entries(grouped).map(([key, rows]) => ({
      [groupBy]: key,
      [`${column}_max`]: Math.max(...rows.map(row => Number(row[column]) || 0)),
    }));
    
    return {
      ...dataset,
      rows,
      columns: [
        { name: groupBy, type: 'string' },
        { name: `${column}_max`, type: 'number' },
      ],
    };
  }
  
  private groupBy(dataset: Dataset, columns: string[]): Dataset {
    const grouped = dataset.rows.reduce((acc, row) => {
      const key = columns.map(col => row[col]).join('|');
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {} as Record<string, any[]>);
    
    const rows = Object.entries(grouped).map(([key, rows]) => {
      const keyParts = key.split('|');
      const result: any = {};
      columns.forEach((col, index) => {
        result[col] = keyParts[index];
      });
      result.count = (rows as any[]).length;
      return result;
    });
    
    return {
      ...dataset,
      rows,
      columns: [
        ...columns.map(col => ({ name: col, type: 'string' as const })),
        { name: 'count', type: 'number' as const },
      ],
    };
  }
  
  private sort(dataset: Dataset, column: string, direction: 'asc' | 'desc' = 'asc'): Dataset {
    const sortedRows = [...dataset.rows].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
    
    return {
      ...dataset,
      rows: sortedRows,
    };
  }
  
  private pivot(dataset: Dataset, rows: string[], columns: string[], values: string[]): Dataset {
    // Simplified pivot implementation
    const pivotData: any = {};
    
    dataset.rows.forEach(row => {
      const rowKey = rows.map(r => row[r]).join('|');
      const colKey = columns.map(c => row[c]).join('|');
      
      if (!pivotData[rowKey]) {
        pivotData[rowKey] = {};
      }
      
      values.forEach(value => {
        const key = `${colKey}_${value}`;
        pivotData[rowKey][key] = (pivotData[rowKey][key] || 0) + (Number(row[value]) || 0);
      });
    });
    
    const newRows = Object.entries(pivotData).map(([rowKey, data]) => {
      const result: any = {};
      const rowParts = rowKey.split('|');
      rows.forEach((row, index) => {
        result[row] = rowParts[index];
      });
      Object.assign(result, data);
      return result;
    });
    
    return {
      ...dataset,
      rows: newRows,
      columns: [
        ...rows.map(r => ({ name: r, type: 'string' as const })),
        ...Object.keys(pivotData[Object.keys(pivotData)[0]] || {}).map(key => ({
          name: key,
          type: 'number' as const,
        })),
      ],
    };
  }
  
  private calculateField(dataset: Dataset, fieldName: string, formula: string): Dataset {
    const newRows = dataset.rows.map(row => {
      try {
        // Simple formula evaluation - in production, use a proper expression parser
        const result = this.evaluateFormula(formula, row);
        return { ...row, [fieldName]: result };
      } catch {
        return { ...row, [fieldName]: null };
      }
    });
    
    return {
      ...dataset,
      rows: newRows,
      columns: [
        ...dataset.columns,
        { name: fieldName, type: 'number' },
      ],
    };
  }
  
  private extractDatePart(dataset: Dataset, sourceColumn: string, targetColumn: string, part: string): Dataset {
    const newRows = dataset.rows.map(row => {
      const date = new Date(row[sourceColumn]);
      let extracted: any;
      
      switch (part) {
        case 'year':
          extracted = date.getFullYear();
          break;
        case 'month':
          extracted = date.getMonth() + 1;
          break;
        case 'day':
          extracted = date.getDate();
          break;
        case 'quarter':
          extracted = Math.floor(date.getMonth() / 3) + 1;
          break;
        case 'dayOfWeek':
          extracted = date.getDay();
          break;
        default:
          extracted = null;
      }
      
      return { ...row, [targetColumn]: extracted };
    });
    
    return {
      ...dataset,
      rows: newRows,
      columns: [
        ...dataset.columns,
        { name: targetColumn, type: 'number' },
      ],
    };
  }
  
  private convertCurrency(dataset: Dataset, column: string, _fromCurrency: string, toCurrency: string, rate: number): Dataset {
    const newRows = dataset.rows.map(row => ({
      ...row,
      [`${column}_${toCurrency}`]: Number(row[column]) * rate,
    }));
    
    return {
      ...dataset,
      rows: newRows,
      columns: [
        ...dataset.columns,
        { name: `${column}_${toCurrency}`, type: 'number' },
      ],
    };
  }
  
  private groupRowsBy(rows: any[], column: string): Record<string, any[]> {
    return rows.reduce((acc, row) => {
      const key = String(row[column]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {} as Record<string, any[]>);
  }
  
  private evaluateFormula(formula: string, row: any): number {
    // Simple formula evaluation - replace column names with values
    let expression = formula;
    Object.keys(row).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expression = expression.replace(regex, String(Number(row[key]) || 0));
    });
    
    // Basic math operations only
    try {
       
      return eval(expression);
    } catch {
      return 0;
    }
  }
  
  // Financial calculations
  calculateFinancialMetrics(dataset: Dataset): any {
    const metrics: any = {};
    
    // Revenue metrics
    const revenueCol = this.findColumn(dataset, ['revenue', 'sales', 'income']);
    if (revenueCol) {
      metrics.totalRevenue = this.sum(dataset, revenueCol);
      metrics.avgRevenue = this.average(dataset, revenueCol);
    }
    
    // Profit metrics
    const profitCol = this.findColumn(dataset, ['profit', 'net_income', 'earnings']);
    if (profitCol) {
      metrics.totalProfit = this.sum(dataset, profitCol);
      metrics.profitMargin = revenueCol ? (metrics.totalProfit / metrics.totalRevenue) * 100 : 0;
    }
    
    // Growth calculations
    const dateCol = this.findColumn(dataset, ['date', 'period', 'month', 'year']);
    if (dateCol && revenueCol) {
      metrics.growthRate = this.calculateGrowthRate(dataset, dateCol, revenueCol);
    }
    
    return metrics;
  }
  
  private findColumn(dataset: Dataset, possibleNames: string[]): string | null {
    for (const name of possibleNames) {
      const found = dataset.columns.find(col => 
        col.name.toLowerCase().includes(name.toLowerCase())
      );
      if (found) return found.name;
    }
    return null;
  }
  
  private sum(dataset: Dataset, column: string): number {
    return dataset.rows.reduce((acc, row) => acc + (Number(row[column]) || 0), 0);
  }
  
  private average(dataset: Dataset, column: string): number {
    const total = this.sum(dataset, column);
    return total / dataset.rows.length;
  }
  
  private calculateGrowthRate(dataset: Dataset, dateCol: string, valueCol: string): number {
    const sortedData = this.sort(dataset, dateCol, 'asc');
    const firstValue = Number(sortedData.rows[0]?.[valueCol]) || 0;
    const lastValue = Number(sortedData.rows[sortedData.rows.length - 1]?.[valueCol]) || 0;
    
    if (firstValue === 0) return 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  }
}

export const dataTransformationService = new DataTransformationService();
