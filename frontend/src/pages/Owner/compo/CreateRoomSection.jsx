// src/components/hostel-forms/CreateRoomSection.jsx
import React, { useState } from 'react';
import { BedDouble, Plus, Trash2 } from 'lucide-react';

const CreateRoomsSection = ({ roomConfig, onRoomConfigChange }) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    seater: '',
    count: '',
    price: ''
  });

  const totalRooms = roomConfig.singleRooms + roomConfig.doubleRooms + roomConfig.tripleRooms +
                    (roomConfig.customRooms || []).reduce((sum, room) => sum + room.count, 0);

  const handleCustomSubmit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (customForm.seater && customForm.count && customForm.price) {
      const newCustomRoom = {
        id: Date.now(),
        seater: parseInt(customForm.seater),
        count: parseInt(customForm.count),
        price: parseInt(customForm.price)
      };
      
      onRoomConfigChange('customRooms', [
        ...(roomConfig.customRooms || []),
        newCustomRoom
      ]);
      
      setCustomForm({ seater: '', count: '', price: '' });
      setShowCustomModal(false);
    }
  };

  const handleModalClose = () => {
    setCustomForm({ seater: '', count: '', price: '' });
    setShowCustomModal(false);
  };

  const removeCustomRoom = (id) => {
    onRoomConfigChange('customRooms', 
      (roomConfig.customRooms || []).filter(room => room.id !== id)
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Room Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Single Rooms */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Single Rooms</label>
            <input 
              type="number" 
              min="0" 
              value={roomConfig.singleRooms || ''} 
              onChange={(e) => onRoomConfigChange('singleRooms', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              placeholder="number of rooms" 
            />
            <input 
              type="number" 
              min="0" 
              value={roomConfig.singleRoomPrice || ''} 
              onChange={(e) => onRoomConfigChange('singleRoomPrice', parseInt(e.target.value) || 0)}
              className="w-full mt-2 p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              placeholder="price of the room (₹)" 
            />
          </div>
          
          {/* Double Rooms */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Double Rooms</label>
            <input 
              type="number" 
              min="0" 
              value={roomConfig.doubleRooms || ''} 
              onChange={(e) => onRoomConfigChange('doubleRooms', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              placeholder="number of rooms" 
            />
            <input 
              type="number" 
              min="0" 
              value={roomConfig.doubleRoomPrice || ''} 
              onChange={(e) => onRoomConfigChange('doubleRoomPrice', parseInt(e.target.value) || 0)}
              className="w-full mt-2 p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              placeholder="price of the room (₹)" 
            />
          </div>
          
          {/* Triple Rooms */}
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Triple Rooms</label>
            <input 
              type="number" 
              min="0" 
              value={roomConfig.tripleRooms || ''} 
              onChange={(e) => onRoomConfigChange('tripleRooms', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              placeholder="number of rooms" 
            />
            <input 
              type="number" 
              min="0" 
              value={roomConfig.tripleRoomPrice || ''} 
              onChange={(e) => onRoomConfigChange('tripleRoomPrice', parseInt(e.target.value) || 0)}
              className="w-full mt-2 p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent" 
              placeholder="price of the room (₹)" 
            />
          </div>
        </div>

        {/* Add Custom Room Button */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus size={18} />
            Add Custom Room Type
          </button>
        </div>

        {/* Custom Rooms Table */}
        {(roomConfig.customRooms || []).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Custom Room Types</h3>
            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 dark:bg-stone-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-stone-700 dark:text-stone-300">Room Type</th>
                    <th className="px-4 py-3 text-left font-medium text-stone-700 dark:text-stone-300">Seater</th>
                    <th className="px-4 py-3 text-left font-medium text-stone-700 dark:text-stone-300">No. of Rooms</th>
                    <th className="px-4 py-3 text-left font-medium text-stone-700 dark:text-stone-300">Price/Month</th>
                    <th className="px-4 py-3 text-center font-medium text-stone-700 dark:text-stone-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                  {(roomConfig.customRooms || []).map((room) => (
                    <tr key={room.id} className="hover:bg-stone-50 dark:hover:bg-stone-800">
                      <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">
                        {room.seater}-Seater Room
                      </td>
                      <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                        {room.seater} persons
                      </td>
                      <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                        {room.count}
                      </td>
                      <td className="px-4 py-3 font-medium text-orange-600">
                        ₹{room.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeCustomRoom(room.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Total Rooms: <span className="text-xl font-bold text-orange-600">{totalRooms}</span>
          </p>
          {totalRooms > 0 && (
            <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
              {roomConfig.singleRooms} Single + {roomConfig.doubleRooms} Double + {roomConfig.tripleRooms} Triple +{' '}
              {(roomConfig.customRooms || []).reduce((sum, room) => sum + room.count, 0)} Custom
            </p>
          )}
        </div>
      </div>

      {/* ✅ NO NESTED FORM - Using div + button handler */}
      {showCustomModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" 
          onClick={handleModalClose}
        >
          <div 
            className="bg-white dark:bg-stone-900 p-6 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Add Custom Room</h3>
              <button 
                onClick={handleModalClose}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ✅ DIV instead of FORM - no nesting issue */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Number of Beds (Seater)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customForm.seater}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, seater: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent"
                  placeholder="e.g. 4 (1-10 only)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  value={customForm.count}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, count: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent"
                  placeholder="e.g. 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Price per Month (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={customForm.price}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent"
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-2 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  disabled={!customForm.seater || !customForm.count || !customForm.price}
                  className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  Add Room Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRoomsSection;
