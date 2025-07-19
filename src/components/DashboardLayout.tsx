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
import Footer from './Footer';
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
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, id: 'dashboard' },
    { name: 'Data Sources', href: '/data-sources', icon: TableCellsIcon, id: 'data-sources' },
    { name: 'Charts', href: '/charts', icon: ChartBarIcon, id: 'charts' },
    { name: 'Reports', href: '/reports', icon: DocumentArrowDownIcon, id: 'reports' },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, id: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-0 z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">AbilityCenterBI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <nav className="mt-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-orange-50 border-r-2 border-orange-500 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 font-bold text-gray-900 text-lg">AbilityCenterBI</span>
          </div>
          <nav className="mt-8 flex-grow">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-orange-50 border-r-2 border-orange-500 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {currentPage === 'dashboard' ? 'Dashboard' : currentPage}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="relative flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.picture}
                  alt={user?.name}
                />
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
