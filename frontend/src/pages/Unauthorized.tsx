import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        <div className="floating-card">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 glass-button rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
