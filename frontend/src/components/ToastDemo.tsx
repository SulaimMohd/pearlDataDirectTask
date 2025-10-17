import React from 'react';
import { useToast } from '../context/ToastContext';

const ToastDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess(
      'User Created Successfully! 🎉',
      'John Doe has been added as a Student',
      5000
    );
  };

  const handleError = () => {
    showError(
      'Creation Failed',
      'Email already exists in the system',
      6000
    );
  };

  const handleWarning = () => {
    showWarning(
      'Low Storage Space',
      'Please consider cleaning up old files',
      4000
    );
  };

  const handleInfo = () => {
    showInfo(
      'System Update',
      'New features are now available',
      4000
    );
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Toast Notification Demo</h2>
      <p className="text-gray-600 mb-6">Click the buttons below to test different types of toast notifications:</p>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSuccess}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={handleWarning}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Show Warning Toast
        </button>
        
        <button
          onClick={handleInfo}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Show Info Toast
        </button>
      </div>
    </div>
  );
};

export default ToastDemo;
