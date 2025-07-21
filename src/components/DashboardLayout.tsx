import React from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
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
      {/* Stunning Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <ChartBarIcon className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Ability Center BI
              </span>
            </div>

            {/* Main Navigation */}
            <nav className="flex items-center space-x-2 lg:space-x-4 flex-1 justify-center">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.name}</span>
                </motion.a>
              ))}
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full border-2 border-gray-200"
                src={user?.picture}
                alt={user?.name}
              />
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-700 truncate max-w-32">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-32">{user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      {/* Stunning Floating AI Chat Button */}
      {onShowAIChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onShowAIChat}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-violet-500/25 transition-all duration-300"
          title="AI Assistant"
        >
          <SparklesIcon className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
        </motion.button>
      )}
    </div>
  );      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          title="AI Assistant"
        >
          <SparklesIcon className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default DashboardLayout;
