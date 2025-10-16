import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
          iconBg: 'bg-red-50'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
          iconBg: 'bg-yellow-50'
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
          iconBg: 'bg-blue-50'
        };
      default:
        return {
          iconColor: 'text-red-500',
          confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
          iconBg: 'bg-red-50'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="glass-card max-w-md w-full mx-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${styles.iconBg}`}>
              <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 glass-button rounded-lg hover:bg-white/30 transition-all duration-300"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 glass-button rounded-lg font-medium hover:bg-white/30 transition-all duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
