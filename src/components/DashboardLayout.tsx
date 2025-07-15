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
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onAIToggle?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentPage = 'dashboard',
  onAIToggle
}) => {
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
    <div className="min-h-screen" style={{ 
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Navigation Header - exact homepage style */}
      <nav 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 0'
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8">
          {/* Logo - smaller icons */}
          <div className="flex items-center text-xl font-bold">
            <ChartBarIcon 
              className="h-5 w-5 mr-2" 
              style={{ color: '#F8941F' }}
            />
            <span style={{ color: '#2E2C6E' }}>AbilityCenterBI</span>
          </div>

          {/* Desktop Navigation - homepage style */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center font-medium transition-colors duration-300"
                  style={{
                    color: isActive ? '#F8941F' : '#333',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#F8941F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? '#F8941F' : '#333';
                  }}
                >
                  <Icon className="h-3 w-3 mr-2" />
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* User Actions - homepage CTA style */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden lg:flex items-center gap-3">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=F8941F&color=fff`}
                  alt={user.name || 'User'}
                />
                <span className="text-sm font-medium" style={{ color: '#2E2C6E' }}>
                  {user.name || user.email}
                </span>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="font-semibold transition-all duration-300 rounded-full px-6 py-3"
              style={{
                background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(248, 148, 31, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2 inline" />
              Sign Out
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md"
              style={{ color: '#333' }}
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-40 lg:hidden"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div 
            className="fixed inset-y-0 left-0 w-72 shadow-2xl"
            style={{ background: 'white' }}
          >
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <ChartBarIcon className="h-8 w-8" style={{ color: '#F8941F' }} />
                <span className="font-bold text-xl" style={{ color: '#2E2C6E' }}>
                  AbilityCenterBI
                </span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)} 
                style={{ color: '#333' }}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="mt-6 px-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-3 mb-2 font-medium rounded-xl transition-all duration-200"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, #F8941F, #2E2C6E)' : 'transparent',
                      color: isActive ? 'white' : '#333',
                      textDecoration: 'none'
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
            
            {/* User section for mobile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)', background: '#f8f9fa' }}>
              {user && (
                <div className="flex items-center mb-3">
                  <img
                    src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=F8941F&color=fff`}
                    alt={user.name || 'User'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: '#2E2C6E' }}>
                      {user.name || user.email}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 py-2 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-600">
            Created by Faisal Aldosari
          </p>
        </div>
      </footer>

      {/* Floating AI Assistant Bubble */}
      {onAIToggle && (
        <motion.button
          onClick={onAIToggle}
          className="fixed bottom-20 right-6 z-30 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #F8941F, #2E2C6E)',
            border: 'none'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <SparklesIcon className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default DashboardLayout;
