// src/components/hostel-forms/MessSection.jsx
import React from 'react';

const MessSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm mt-8">
      <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4 border-b border-stone-100 dark:border-stone-800 pb-2">Mess Facility</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mess Availability</label>
          <select 
            name="messType" value={formData.messType} onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="NONE">No Mess</option>
            <option value="OPTIONAL">Optional</option>
            <option value="COMPULSORY">Compulsory</option>
          </select>
        </div>

        {formData.messType !== 'NONE' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Price Per Month (₹)</label>
            <input 
              type="number" name="messPricePerMonth" value={formData.messPricePerMonth} onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        )}
        
        {formData.messType !== 'NONE' && (
          <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mess Description / Menu</label>
              <textarea 
                name="messDescription" value={formData.messDescription} onChange={handleChange} rows="2"
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
              />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessSection;
