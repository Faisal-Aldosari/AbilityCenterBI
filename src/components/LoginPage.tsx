import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, CloudIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { signIn, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mb-4"
            >
              <ChartBarIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AbilityCenterBI</h1>
            <p className="text-gray-600">
              Your powerful data visualization platform
            </p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Connect to Google Sheets & BigQuery</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Create interactive dashboards</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Export professional reports</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Real-time data synchronization</span>
            </div>
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleSignIn}
            disabled={loading || isSigningIn}
            className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center space-x-3 hover:border-blue-500 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CloudIcon className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700">
              {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </span>
          </motion.button>

          {/* Security Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-gray-500 text-center mt-6"
          >
            We'll securely access your Google account to connect to your data sources.
            Your data remains private and secure.
          </motion.p>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-600">
            Powered by Google Cloud Platform
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
