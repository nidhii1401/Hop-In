import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, AlertCircle, Users } from 'lucide-react';

const EditRoomModal = ({ isOpen, onClose, room, onSave, loading, serverError }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '',
    roomType: '',
    capacity: '',
    pricePerMonth: '',
    isActive: true
  });

  const [minCapacity, setMinCapacity] = useState(1);

  useEffect(() => {
    if (room) {
      // Use the occupancy field provided by the parent component
      const currentOccupancy = room.occupancy || 0;
      setMinCapacity(Math.max(1, currentOccupancy));

      setFormData({
        roomNumber: room.roomNumber || '',
        floor: room.floor || '',
        roomType: room.roomType || '',
        capacity: room.capacity || '',
        pricePerMonth: room.pricePerMonth || '',
        isActive: room.isActive !== undefined ? room.isActive : true
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // 1. Handle Capacity Change directly
    if (name === 'capacity') {
      const val = parseInt(value) || 0;
      if (val < minCapacity) {
        // Prevent typing lower than min
        // We set it to minCapacity immediately to visual block it
        // Or strictly allow it but disable save button (better UX usually)
        newValue = minCapacity;
      }
    }

    // 2. Handle Room Type Change (Auto-update capacity)
    if (name === 'roomType') {
      const typeNum = parseInt(value);
      
      // If user types a number (1-10), treat it as capacity
      if (!isNaN(typeNum) && typeNum > 0 && typeNum <= 10) {
        // Validation: If new Type (capacity) is less than Occupancy
        if (typeNum < minCapacity) {
          // You can decide: Block the change OR allow it but show error
          // Here: We force capacity to be AT LEAST minCapacity
          setFormData(prev => ({
            ...prev,
            [name]: newValue,
            // capacity: minCapacity // Force capacity to stay valid
          }));
          // Note: If you want to block the roomType change itself:
          // return; 
        } else {
          // Sync capacity with roomType
          setFormData(prev => ({
            ...prev,
            [name]: newValue,
            capacity: typeNum
          }));
          return;
        }
      }
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final Frontend Check before sending
    if (Number(formData.capacity) < minCapacity) {
        alert(`Cannot set capacity to ${formData.capacity}. Room has ${minCapacity} active residents.`);
        return;
    }

    onSave(formData);
  };

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 m-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Edit Room</h3>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle size={18} />
            {serverError}
          </div>
        )}

        {minCapacity > 1 && (
           <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-200 dark:border-blue-800 flex items-center gap-2">
            <Users size={18} />
            <span>Room has <strong>{minCapacity}</strong> active residents.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Capacity <span className="text-xs text-stone-500">(Min: {minCapacity})</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min={minCapacity}
                className={`w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-800 ${
                    Number(formData.capacity) < minCapacity ? 'border-red-500 bg-red-50' : 'border-stone-300 dark:border-stone-700'
                }`}
                required
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Room Type</label>
             <input
               type="number"
               name="roomType"
               value={formData.roomType}
               onChange={handleChange}
               className={`w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-800 ${
                  Number(formData.roomType) < minCapacity && Number(formData.roomType) <= 10 ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
               }`}
               min="1"
               max="10"
               required
             />
             {Number(formData.roomType) < minCapacity && (
                 <p className="text-xs text-red-500 mt-1">Room type (Capacity) cannot be less than active residents.</p>
             )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Price per Month (₹)</label>
            <input
              type="number"
              name="pricePerMonth"
              value={formData.pricePerMonth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800"
              required
            />
          </div>

          <div className="flex items-center p-3 rounded-lg border border-stone-200 dark:border-stone-800">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={minCapacity > 0}
              className="w-4 h-4 text-orange-600 rounded disabled:opacity-50"
            />
            <div className="ml-3">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Room is Active</label>
                {minCapacity > 0 && <p className="text-xs text-red-500">Cannot deactivate occupied room.</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50">Cancel</button>
            <button
              type="button"
              onClick={(e)=>{handleSubmit(e)}}
              disabled={loading || Number(formData.capacity) < minCapacity || (Number(formData.roomType) < minCapacity && Number(formData.roomType) <= 10)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Update</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;
