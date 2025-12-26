// src/components/hostel-forms/DeleteRoomModal.jsx
import React from 'react';
import { X, Trash2, Loader2, AlertTriangle, Ban, Users } from 'lucide-react';

const DeleteRoomModal = ({ isOpen, onClose, onConfirm, loading, room, serverError }) => {
  if (!isOpen || !room) return null;

  // ✅ Check occupancy immediately from the prop
  const occupancyCount = room.occupancy || 0;
  const hasResidents = occupancyCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 m-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Delete Room</h3>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Validation / Error Display */}
        {hasResidents || serverError ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-6 flex items-start gap-3">
             <Ban className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
             <div>
               <h4 className="font-bold text-red-700 dark:text-red-400 text-sm">Cannot Delete Room</h4>
               <p className="text-red-600 dark:text-red-300 text-xs mt-1">
                 {hasResidents 
                   ? `This room has ${occupancyCount} active resident(s). You must deallocate them before deleting.`
                   : serverError}
               </p>
             </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
            </div>
            <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">
              Are you sure?
            </h4>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              This action cannot be undone. This will permanently delete Room <strong>{room.roomNumber}</strong> and all associated data.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            {hasResidents || serverError ? 'Close' : 'Cancel'}
          </button>
          
          {/* Hide Confirm button if blocked by validation or server error */}
          {!hasResidents && !serverError && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-all"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 size={18} /> Delete Room</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteRoomModal;
