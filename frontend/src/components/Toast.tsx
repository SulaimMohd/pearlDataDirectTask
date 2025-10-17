import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  const getToastStyles = () => {
    const baseStyles = "glass-card p-4 min-w-[300px] max-w-[400px] shadow-lg border transition-all duration-300 ease-in-out transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-200 bg-gradient-to-r from-green-50 to-emerald-50`;
      case 'error':
        return `${baseStyles} border-red-200 bg-gradient-to-r from-red-50 to-rose-50`;
      case 'warning':
        return `${baseStyles} border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50`;
      case 'info':
        return `${baseStyles} border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50`;
      default:
        return `${baseStyles} border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50`;
    }
  };

  const getIcon = () => {
    const iconProps = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconProps} text-green-600`} />;
      case 'error':
        return <XCircle className={`${iconProps} text-red-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconProps} text-yellow-600`} />;
      case 'info':
        return <Info className={`${iconProps} text-blue-600`} />;
      default:
        return <Info className={`${iconProps} text-gray-600`} />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : isLeaving
          ? '-translate-x-full opacity-0 scale-95'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${getTitleColor()}`}>
            {title}
          </h4>
          {message && (
            <p className={`mt-1 text-sm ${getMessageColor()}`}>
              {message}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
