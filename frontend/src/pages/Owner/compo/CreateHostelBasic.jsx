// src/pages/owner/compo/createHostelBasic.jsx
import React from 'react';
import { Building2 } from 'lucide-react';

const BasicDetailsSection = ({ formData, onChange }) => {
  
  // ✅ FIX: Pass the data object directly. 
  // The parent's handleFormChange detects it's an object and merges it into the main state.
  const handleChange = (data) => {
    onChange(data); 
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Building2 size={20} className="text-orange-700" /> Basic Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Hostel Name *</label>
          <input 
            type="text" 
            name="name" 
            required 
            value={formData.name || ''} 
            onChange={(e) => handleChange({ name: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
            placeholder="e.g. Stanza Living" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Description</label>
          <textarea 
            name="description" 
            rows="3" 
            value={formData.description || ''} 
            onChange={(e) => handleChange({ description: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
            placeholder="Tell students what makes your hostel special..." 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Gender Allowed</label>
          <select 
            name="genderType" 
            value={formData.genderType || 'COED'} 
            onChange={(e) => handleChange({ genderType: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent"
          >
            <option value="BOYS">Boys Only</option>
            <option value="GIRLS">Girls Only</option>
            <option value="COED">Co-Ed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Near College/Institute</label>
          <input 
            type="text" 
            name="nearCollege" 
            value={formData.nearCollege || ''} 
            onChange={(e) => handleChange({ nearCollege: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
            placeholder="e.g. IIT Delhi" 
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsSection;
