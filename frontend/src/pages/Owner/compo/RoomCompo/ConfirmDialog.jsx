import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import Loader from '../../../Common/UI/Loader.jsx';

const ConfirmDialog = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" 
}) => {
  const getVariantColors = (variant) => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-600 hover:bg-green-700',
          icon: 'text-green-600',
          border: 'border-green-200 dark:border-green-800',
        };
      default:
        return {
          bg: 'bg-red-600 hover:bg-red-700',
          icon: 'text-red-600',
          border: 'border-red-200 dark:border-red-800',
        };
    }
  };

  const colors = getVariantColors(variant);

  return (
    <>
      <div 
        className="fixed inset-0 z-[900] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onCancel}
      />
      
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border ${colors.border} w-full max-w-sm p-6 pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-2xl border-2 ${
                variant === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900'
              }`}
            >
              {variant === 'success' ? (
                <CheckCircle className={`h-8 w-8 ${colors.icon}`} />
              ) : (
                <AlertTriangle className={`h-8 w-8 ${colors.icon}`} />
              )}
            </div>
          </div>

          <div className="text-center space-y-4 mb-6">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {title}
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 font-medium transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              {loading ? (
                <Loader 
                  size="sm" 
                  showText={false} 
                  color="white"
                  variant={variant} // ⚪️ Uses new white color
                />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
