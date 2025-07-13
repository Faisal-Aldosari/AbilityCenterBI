import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { DataTransformation, TransformationType, Column } from '../types';

interface DataTransformationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  transformations: DataTransformation[];
  onTransformationsChange: (transformations: DataTransformation[]) => void;
}

const TRANSFORMATION_TYPES: { value: TransformationType; label: string; description: string }[] = [
  { value: 'aggregate_sum', label: 'Sum', description: 'Calculate sum of values' },
  { value: 'aggregate_avg', label: 'Average', description: 'Calculate average of values' },
  { value: 'aggregate_count', label: 'Count', description: 'Count number of values' },
  { value: 'aggregate_min', label: 'Minimum', description: 'Find minimum value' },
  { value: 'aggregate_max', label: 'Maximum', description: 'Find maximum value' },
  { value: 'group_by', label: 'Group By', description: 'Group data by column values' },
  { value: 'sort', label: 'Sort', description: 'Sort data by column' },
  { value: 'pivot', label: 'Pivot', description: 'Pivot table transformation' },
  { value: 'unpivot', label: 'Unpivot', description: 'Unpivot table transformation' },
  { value: 'calculate_field', label: 'Calculate Field', description: 'Create calculated field' },
  { value: 'date_extract', label: 'Date Extract', description: 'Extract date components' },
  { value: 'string_manipulation', label: 'String Manipulation', description: 'Modify text values' },
  { value: 'number_format', label: 'Number Format', description: 'Format numeric values' },
  { value: 'currency_convert', label: 'Currency Convert', description: 'Convert between currencies' },
];

const DataTransformationPanel: React.FC<DataTransformationPanelProps> = ({
  isOpen,
  onClose,
  columns,
  transformations,
  onTransformationsChange,
}) => {
  const [selectedType, setSelectedType] = useState<TransformationType>('aggregate_sum');

  const addTransformation = () => {
    const newTransformation: DataTransformation = {
      id: `transform_${Date.now()}`,
      type: selectedType,
      sourceColumn: columns[0]?.name || '',
      parameters: {},
    };

    onTransformationsChange([...transformations, newTransformation]);
  };

  const updateTransformation = (id: string, updates: Partial<DataTransformation>) => {
    const updatedTransformations = transformations.map(transformation =>
      transformation.id === id ? { ...transformation, ...updates } : transformation
    );
    onTransformationsChange(updatedTransformations);
  };

  const removeTransformation = (id: string) => {
    const updatedTransformations = transformations.filter(transformation => transformation.id !== id);
    onTransformationsChange(updatedTransformations);
  };

  const updateParameter = (id: string, paramKey: string, value: any) => {
    const transformation = transformations.find(t => t.id === id);
    if (!transformation) return;

    const updatedParameters = { ...transformation.parameters, [paramKey]: value };
    updateTransformation(id, { parameters: updatedParameters });
  };

  const renderTransformationSettings = (transformation: DataTransformation) => {
    switch (transformation.type) {
      case 'aggregate_sum':
      case 'aggregate_avg':
      case 'aggregate_min':
      case 'aggregate_max':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group By Column (optional)
              </label>
              <select
                value={transformation.parameters.groupBy || ''}
                onChange={(e) => updateParameter(transformation.id, 'groupBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">No grouping</option>
                {columns.map((column) => (
                  <option key={column.name} value={column.name}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'group_by':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Columns
              </label>
              <select
                multiple
                value={transformation.parameters.additionalColumns || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  updateParameter(transformation.id, 'additionalColumns', values);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                size={4}
              >
                {columns.filter(col => col.name !== transformation.sourceColumn).map((column) => (
                  <option key={column.name} value={column.name}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'sort':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Direction
              </label>
              <select
                value={transformation.parameters.direction || 'asc'}
                onChange={(e) => updateParameter(transformation.id, 'direction', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        );

      case 'calculate_field':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formula
              </label>
              <input
                type="text"
                value={transformation.parameters.formula || ''}
                onChange={(e) => updateParameter(transformation.id, 'formula', e.target.value)}
                placeholder="e.g., {Column1} + {Column2}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {'{'}ColumnName{'}'} to reference columns
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Column Name
              </label>
              <input
                type="text"
                value={transformation.targetColumn || ''}
                onChange={(e) => updateTransformation(transformation.id, { targetColumn: e.target.value })}
                placeholder="New column name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        );

      case 'date_extract':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extract Component
              </label>
              <select
                value={transformation.parameters.component || 'year'}
                onChange={(e) => updateParameter(transformation.id, 'component', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="year">Year</option>
                <option value="month">Month</option>
                <option value="day">Day</option>
                <option value="quarter">Quarter</option>
                <option value="dayOfWeek">Day of Week</option>
                <option value="weekOfYear">Week of Year</option>
              </select>
            </div>
          </div>
        );

      case 'string_manipulation':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operation
              </label>
              <select
                value={transformation.parameters.operation || 'uppercase'}
                onChange={(e) => updateParameter(transformation.id, 'operation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="trim">Trim Whitespace</option>
                <option value="replace">Replace Text</option>
                <option value="substring">Substring</option>
              </select>
            </div>
            {transformation.parameters.operation === 'replace' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Find Text
                  </label>
                  <input
                    type="text"
                    value={transformation.parameters.findText || ''}
                    onChange={(e) => updateParameter(transformation.id, 'findText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Replace With
                  </label>
                  <input
                    type="text"
                    value={transformation.parameters.replaceWith || ''}
                    onChange={(e) => updateParameter(transformation.id, 'replaceWith', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            No additional settings required for this transformation.
          </div>
        );
    }
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
            <CogIcon className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Data Transformations</h2>
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
            {/* Add Transformation */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Transformation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transformation Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as TransformationType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {TRANSFORMATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {TRANSFORMATION_TYPES.find(t => t.value === selectedType)?.description}
                </p>
              </div>

              <button
                onClick={addTransformation}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Transformation
              </button>
            </div>

            {/* Transformations List */}
            <div className="space-y-4">
              {transformations.map((transformation, index) => (
                <motion.div
                  key={transformation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {/* Transformation Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {TRANSFORMATION_TYPES.find(t => t.value === transformation.type)?.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Source: {transformation.sourceColumn}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTransformation(transformation.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Source Column Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source Column
                    </label>
                    <select
                      value={transformation.sourceColumn}
                      onChange={(e) => updateTransformation(transformation.id, { sourceColumn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {columns.map((column) => (
                        <option key={column.name} value={column.name}>
                          {column.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Transformation-specific Settings */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Settings</h5>
                    {renderTransformationSettings(transformation)}
                  </div>
                </motion.div>
              ))}

              {transformations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ArrowPathIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No transformations added yet</p>
                  <p className="text-sm">Add a transformation to start modifying your data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {transformations.length} transformation{transformations.length !== 1 ? 's' : ''} configured
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
                Apply Transformations
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataTransformationPanel;
