// src/components/hostel-forms/FacilitiesSection.jsx
import React from 'react';

const AMENITY_OPTIONS = [
  // Hostel-level amenities
  { id: 1, name: 'WiFi', scope: 'HOSTEL' }, 
  { id: 2, name: 'AC', scope: 'HOSTEL' }, 
  { id: 3, name: 'Laundry', scope: 'HOSTEL' },
  { id: 4, name: 'Power Backup', scope: 'HOSTEL' }, 
  { id: 5, name: 'CCTV', scope: 'HOSTEL' }, 
  { id: 6, name: 'Gym', scope: 'HOSTEL' },
  { id: 7, name: 'Parking', scope: 'HOSTEL' },
  { id: 8, name: 'Kitchen', scope: 'HOSTEL' },
  { id: 9, name: 'Study Room', scope: 'HOSTEL' },
  { id: 10, name: 'Common Room', scope: 'HOSTEL' },
  { id: 11, name: 'Hot Water', scope: 'HOSTEL' },
  { id: 12, name: 'Cleaning Service', scope: 'HOSTEL' }
];

const ROOM_AMENITY_OPTIONS = [
  // Room-level amenities (usually included by default)
  { id: 13, name: 'Bed', scope: 'ROOM' },
  { id: 14, name: 'Mattress', scope: 'ROOM' },
  { id: 15, name: 'Study Table', scope: 'ROOM' },
  { id: 16, name: 'Wardrobe', scope: 'ROOM' }
];

const FacilitiesSection = ({ formData, onChange }) => {
  const handleChange = (data) => {
    onChange('facilities', data);
  };

  const handleAmenityToggle = (id) => {
    const amenities = formData.amenities.includes(id)
      ? formData.amenities.filter(aid => aid !== id)
      : [...formData.amenities, id];
    handleChange({ amenities });
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Facilities</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Mess Facility</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {['NONE', 'OPTIONAL', 'COMPULSORY'].map(type => (
            <label key={type} className={`cursor-pointer border p-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${formData.messType === type ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-200 hover:border-orange-300'}`}>
              <input type="radio" name="messType" value={type} checked={formData.messType === type} onChange={(e) => handleChange({ messType: e.target.value })} className="hidden" />
              {type}
            </label>
          ))}
        </div>

        {formData.messType !== 'NONE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Price Per Month (₹)</label>
              <input 
                type="number" 
                name="messPricePerMonth" 
                value={formData.messPricePerMonth} 
                onChange={(e) => handleChange({ messPricePerMonth: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mess Description</label>
              <input 
                type="text" 
                name="messDescription" 
                value={formData.messDescription} 
                onChange={(e) => handleChange({ messDescription: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
                placeholder="Veg/Non-veg, number of meals..." 
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Hostel Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITY_OPTIONS.map(amenity => (
            <button
              key={amenity.id}
              type="button"
              onClick={() => handleAmenityToggle(amenity.id)}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                formData.amenities.includes(amenity.id)
                  ? 'bg-stone-800 text-white border-stone-800 dark:bg-white dark:text-stone-900'
                  : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
              }`}
            >
              {amenity.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilitiesSection;
