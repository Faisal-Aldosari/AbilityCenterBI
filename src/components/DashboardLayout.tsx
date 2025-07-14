import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPage = 'dashboard' }) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, id: 'dashboard' },
    { name: 'Data Sources', href: '/data', icon: TableCellsIcon, id: 'data' },
    { name: 'Charts', href: '/charts', icon: ChartBarIcon, id: 'charts' },
    { name: 'Reports', href: '/reports', icon: DocumentArrowDownIcon, id: 'reports' },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, id: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-white text-xl">AbilityCenterBI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-gray-200">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-6 px-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 mb-2 text-base font-medium rounded-xl transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* User section for mobile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3">
              <img
                src={user?.picture || '/default-avatar.png'}
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-7 h-7 text-white" />
            </div>
            <span className="ml-4 font-bold text-white text-2xl">AbilityCenterBI</span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-8 flex-grow px-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-4 mb-2 text-base font-medium rounded-xl transition-all duration-200 group ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-102'
                }`}
              >
                <item.icon className={`w-6 h-6 mr-4 transition-transform duration-200 ${
                  currentPage === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* User section */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center mb-4">
              <img
                src={user?.picture || '/default-avatar.png'}
                alt={user?.name || 'User'}
                className="w-12 h-12 rounded-full shadow-md"
              />
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 hover:shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 lg:hidden">
          <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">AbilityCenterBI</span>
              </div>
              <div className="w-6"></div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
