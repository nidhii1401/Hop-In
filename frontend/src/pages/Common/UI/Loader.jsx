// src/Common/UI/Loader.jsx
import React from 'react';

const Loader = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  showText = true,
  fullScreen = false,
  color = 'orange' ,
  variant = null
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-b-2',
    lg: 'h-12 w-12 border-b-3',
    xl: 'h-16 w-16 border-b-4'
  };

  if(variant){
    if(variant==='success'){
      color='green'
    }
    else {
    color='red'
    }
  }


  const colorClasses = {
    orange: 'border-orange-600',
    green: 'border-green-400',
    red: 'border-red-400',
    blue: 'border-blue-600',
    white: 'border-white', // 🔹 ADDED THIS
  };

  const containerClasses = fullScreen 
    ? 'fixed w-full h-full inset-0 flex items-center justify-center bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-transparent ${colorClasses[color] || colorClasses.orange} ${sizeClasses[size]}`}
      />
      {showText && (
        <span className="ml-3 text-lg text-stone-600 dark:text-stone-400">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
