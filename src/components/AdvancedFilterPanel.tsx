import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FunnelIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { AdvancedFilter, FilterCondition, FilterOperator, Column } from '../types';

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  filters: AdvancedFilter[];
  onFiltersChange: (filters: AdvancedFilter[]) => void;
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'greater_equal', label: 'Greater or Equal' },
  { value: 'less_equal', label: 'Less or Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'between', label: 'Between' },
  { value: 'in', label: 'In' },
  { value: 'not_in', label: 'Not In' },
  { value: 'is_null', label: 'Is Null' },
  { value: 'is_not_null', label: 'Is Not Null' },
  { value: 'regex', label: 'Regex Match' },
];

const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  isOpen,
  onClose,
  columns,
  filters,
  onFiltersChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<AdvancedFilter | null>(null);

  const createNewFilter = (): AdvancedFilter => ({
    id: `filter_${Date.now()}`,
    name: `Filter ${filters.length + 1}`,
    conditions: [
      {
        field: columns[0]?.name || '',
        operator: 'equals',
        value: '',
      },
    ],
    logic: 'AND',
  });

  const addFilter = () => {
    const newFilter = createNewFilter();
    setActiveFilter(newFilter);
    onFiltersChange([...filters, newFilter]);
  };

  const updateFilter = (filterId: string, updates: Partial<AdvancedFilter>) => {
    const updatedFilters = filters.map(filter =>
      filter.id === filterId ? { ...filter, ...updates } : filter
    );
    onFiltersChange(updatedFilters);
    
    if (activeFilter?.id === filterId) {
      setActiveFilter({ ...activeFilter, ...updates });
    }
  };

  const deleteFilter = (filterId: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    onFiltersChange(updatedFilters);
    
    if (activeFilter?.id === filterId) {
      setActiveFilter(null);
    }
  };

  const addCondition = (filterId: string) => {
    const newCondition: FilterCondition = {
      field: columns[0]?.name || '',
      operator: 'equals',
      value: '',
    };

    updateFilter(filterId, {
      conditions: [...(filters.find(f => f.id === filterId)?.conditions || []), newCondition],
    });
  };

  const updateCondition = (
    filterId: string,
    conditionIndex: number,
    updates: Partial<FilterCondition>
  ) => {
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return;

    const updatedConditions = filter.conditions.map((condition, index) =>
      index === conditionIndex ? { ...condition, ...updates } : condition
    );

    updateFilter(filterId, { conditions: updatedConditions });
  };

  const removeCondition = (filterId: string, conditionIndex: number) => {
    const filter = filters.find(f => f.id === filterId);
    if (!filter || filter.conditions.length <= 1) return;

    const updatedConditions = filter.conditions.filter((_, index) => index !== conditionIndex);
    updateFilter(filterId, { conditions: updatedConditions });
  };

  const renderCondition = (
    condition: FilterCondition,
    conditionIndex: number,
    filterId: string
  ) => {
    const needsSecondValue = condition.operator === 'between';
    const isNullOperator = ['is_null', 'is_not_null'].includes(condition.operator);

    return (
      <div key={conditionIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {/* Field Selection */}
        <select
          value={condition.field}
          onChange={(e) => updateCondition(filterId, conditionIndex, { field: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {columns.map((column) => (
            <option key={column.name} value={column.name}>
              {column.name}
            </option>
          ))}
        </select>

        {/* Operator Selection */}
        <select
          value={condition.operator}
          onChange={(e) => updateCondition(filterId, conditionIndex, { operator: e.target.value as FilterOperator })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {OPERATORS.map((operator) => (
            <option key={operator.value} value={operator.value}>
              {operator.label}
            </option>
          ))}
        </select>

        {/* Value Input */}
        {!isNullOperator && (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => updateCondition(filterId, conditionIndex, { value: e.target.value })}
            placeholder="Value"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        )}

        {/* Second Value for Between */}
        {needsSecondValue && (
          <input
            type="text"
            value={condition.secondValue || ''}
            onChange={(e) => updateCondition(filterId, conditionIndex, { secondValue: e.target.value })}
            placeholder="Second Value"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        )}

        {/* Remove Condition Button */}
        <button
          onClick={() => removeCondition(filterId, conditionIndex)}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    );
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
        className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Add Filter Button */}
            <button
              onClick={addFilter}
              className="w-full mb-6 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Filter
            </button>

            {/* Filters List */}
            <div className="space-y-6">
              {filters.map((filter) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {/* Filter Header */}
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={filter.name}
                      onChange={(e) => updateFilter(filter.id, { name: e.target.value })}
                      className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={filter.logic}
                        onChange={(e) => updateFilter(filter.id, { logic: e.target.value as 'AND' | 'OR' })}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                      <button
                        onClick={() => deleteFilter(filter.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Conditions */}
                  <div className="space-y-3">
                    {filter.conditions.map((condition, index) => (
                      <div key={index}>
                        {index > 0 && (
                          <div className="flex justify-center my-2">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                              {filter.logic}
                            </span>
                          </div>
                        )}
                        {renderCondition(condition, index, filter.id)}
                      </div>
                    ))}

                    {/* Add Condition Button */}
                    <button
                      onClick={() => addCondition(filter.id)}
                      className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Condition
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filters.length} filter{filters.length !== 1 ? 's' : ''} active
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedFilterPanel;
