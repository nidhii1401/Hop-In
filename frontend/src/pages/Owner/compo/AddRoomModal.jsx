import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const AddRoomModal = ({ isOpen, onClose, onSave, loading }) => {
  if (!isOpen) return null;

  // Local state for the form inputs
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    floor: '',
    roomType: '',
    capacity: 1,
    pricePerMonth: ''
  });

  const getMaxCapacity = (roomType) => {
    // Define capacity limits based on room type number (1-10)
    const roomTypeNum = Number(roomType);
    
    if (roomTypeNum >= 1 && roomTypeNum <= 10) {
      // For room types 1-10, capacity equals the room type number
      return roomTypeNum;
    }
    
    // Default fallback
    return 4;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...roomData, [name]: value };

    // Auto-update capacity based on type limits
    if (name === 'roomType') {
      updatedData.capacity = getMaxCapacity(value);
    }
    
    // Enforce max capacity
    if (name === 'capacity' && updatedData.roomType) {
      const maxCap = getMaxCapacity(updatedData.roomType);
      if (Number(value) > maxCap) updatedData.capacity = maxCap;
    }

    setRoomData(updatedData);
  };

  const handleSubmit = () => {
    if (!roomData.roomNumber || !roomData.pricePerMonth) return;
    onSave(roomData); // Calls the parent function to save
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-xl w-full max-w-md border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Add New Room</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- THIS IS THE ADD ROOM FORM --- */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Room No</label>
              <input 
                name="roomNumber" value={roomData.roomNumber} onChange={handleChange} required
                className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 outline-none" 
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Floor</label>
              <input 
                name="floor" value={roomData.floor} onChange={handleChange} 
                className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 outline-none" 
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Type</label>
               <input 
                 type="number"
                 name="roomType" 
                 value={roomData.roomType} 
                 onChange={handleChange}
                 className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 outline-none"
                 placeholder="e.g., 1, 2, 3, etc."
                 min="1"
                 max="10"
               />
             </div>
             <div>
               <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Capacity</label>
               <input 
                 type="number" name="capacity" min="1" max={getMaxCapacity(roomData.roomType)}
                 value={roomData.capacity} onChange={handleChange}
                 className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 outline-none" 
               />
             </div>
          </div>

          <div>
             <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Monthly Rent (₹)</label>
             <input 
               type="number" name="pricePerMonth" value={roomData.pricePerMonth} onChange={handleChange} required
               className="w-full p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 outline-none" 
               placeholder="5000"
             />
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 rounded-lg transition-colors">Cancel</button>
             <button type="button" onClick={() => handleSubmit()} disabled={loading} className="px-6 py-2 text-sm font-bold text-white bg-stone-800 hover:bg-stone-700 rounded-lg flex items-center gap-2 transition-all">
               {loading ? 'Adding...' : <><Plus size={16} /> Add Room</>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
