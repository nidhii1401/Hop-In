import React from 'react';

const HostelSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6">
          {/* Image */}
          <div className="w-full h-48 bg-stone-200 dark:bg-stone-800 rounded-xl mb-4"></div>
          
          {/* Content */}
          <div className="space-y-3">
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-lg w-3/4"></div>
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3"></div>
            
            {/* Amenities */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-6 w-16 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
              ))}
            </div>
            
            {/* Price & Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-700">
              <div className="flex gap-4">
                {[...Array(2)].map((_, k) => (
                  <div key={k} className="h-4 w-12 bg-stone-200 dark:bg-stone-800 rounded"></div>
                ))}
              </div>
              <div className="h-8 w-20 bg-stone-200 dark:bg-stone-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HostelSkeleton;
