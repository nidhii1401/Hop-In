// src/components/hostel-forms/AddressSection.jsx
import React from 'react';

const AddressSection = ({ formData, onChange }) => {
  const handleChange = (data) => {
    onChange('address', data);
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Address Line</label>
          <input 
            type="text" 
            name="addressLine" 
            value={formData.addressLine} 
            onChange={(e) => handleChange({ addressLine: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Area / Locality</label>
          <input 
            type="text" 
            name="area" 
            value={formData.area} 
            onChange={(e) => handleChange({ area: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">City</label>
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={(e) => handleChange({ city: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">State</label>
          <input 
            type="text" 
            name="state" 
            value={formData.state} 
            onChange={(e) => handleChange({ state: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Pincode</label>
          <input 
            type="text" 
            name="pincode" 
            value={formData.pincode} 
            onChange={(e) => handleChange({ pincode: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Landmark</label>
          <input 
            type="text" 
            name="landmark" 
            value={formData.landmark} 
            onChange={(e) => handleChange({ landmark: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
            placeholder="e.g. Opposite Forum Mall" 
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
