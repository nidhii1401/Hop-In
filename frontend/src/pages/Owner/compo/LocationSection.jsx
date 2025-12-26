// src/components/hostel-forms/LocationSection.jsx
import React from 'react';

const LocationSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm mt-8">
      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4 border-b border-stone-100 dark:border-stone-800 pb-2">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Address Line</label>
          <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">State</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Pincode</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
