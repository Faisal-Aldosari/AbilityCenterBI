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
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onShowAIChat?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPage = 'dashboard', onShowAIChat }) => {
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
        <div className="fixed inset-y-0 left-0 w-56 bg-white shadow-xl">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-md flex items-center justify-center">
                <ChartBarIcon className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">AbilityCenterBI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <nav className="mt-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-orange-50 border-r-2 border-orange-500 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-56 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-4 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-md flex items-center justify-center">
              <ChartBarIcon className="w-3 h-3 text-white" />
            </div>
            <span className="ml-2 font-bold text-gray-900 text-sm">AbilityCenterBI</span>
          </div>
          <nav className="mt-6 flex-grow">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-xs font-medium transition-colors ${
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
      <div className="lg:pl-56 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-12 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="px-3 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-4 w-4" />
          </button>
          <div className="flex-1 px-3 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-gray-900 capitalize">
                {currentPage === 'dashboard' ? 'Dashboard' : currentPage}
              </h1>
            </div>
            <div className="ml-2 flex items-center md:ml-4">
              {/* Profile dropdown */}
              <div className="relative flex items-center space-x-2">
                <img
                  className="h-6 w-6 rounded-full"
                  src={user?.picture}
                  alt={user?.name}
                />
                <div className="hidden md:block">
                  <div className="text-xs font-medium text-gray-700">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
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

      {/* Floating AI Chat Button */}
      {onShowAIChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onShowAIChat}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
          }}
          title="AI Assistant"
        >
          <SparklesIcon className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default DashboardLayout;
