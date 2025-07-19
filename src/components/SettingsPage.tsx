import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from './DashboardLayout';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [theme, setTheme] = useState('light');

  return (
    <DashboardLayout currentPage="settings">
      <div className="py-8 px-8 min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E2C6E' }}>
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account preferences and application settings
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-6">
              <UserCircleIcon className="h-8 w-8 mr-3" style={{ color: '#F8941F' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Profile
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Application Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-6">
              <CogIcon className="h-8 w-8 mr-3" style={{ color: '#2E2C6E' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Application
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Theme</h3>
                  <p className="text-gray-500 text-sm">Choose your preferred theme</p>
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Auto Refresh</h3>
                  <p className="text-gray-500 text-sm">Automatically refresh data every 5 minutes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-6">
              <BellIcon className="h-8 w-8 mr-3" style={{ color: '#10B981' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Notifications
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Enable Notifications</h3>
                  <p className="text-gray-500 text-sm">Receive notifications about reports and data updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-8 w-8 mr-3" style={{ color: '#8B5CF6' }} />
              <h2 className="text-xl font-semibold" style={{ color: '#2E2C6E' }}>
                Security
              </h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">Change Password</h3>
                <p className="text-gray-500 text-sm">Update your account password</p>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">Two-Factor Authentication</h3>
                <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
              </button>
              
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900 mb-1">Connected Apps</h3>
                <p className="text-gray-500 text-sm">Manage third-party app connections</p>
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <button
              className="px-8 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #2E2C6E, #667eea)' }}
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
