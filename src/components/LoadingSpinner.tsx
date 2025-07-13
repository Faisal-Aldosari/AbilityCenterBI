import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-orange-500 absolute -top-2 -left-2"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mt-4">Loading AbilityCenterBI</h2>
        <p className="text-gray-600 mt-2">Setting up your workspace...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
