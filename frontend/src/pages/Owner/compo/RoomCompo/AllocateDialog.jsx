// src/components/owner/AllocateDialog.jsx
import React, { useState, useEffect } from 'react';
import { X, Search, User, Mail, CheckCircle } from 'lucide-react';
import Loader from '../../../Common/UI/Loader.jsx';
import { allocateRoom, searchHostellers } from '../../../../apis/ownerRoomApis';
import ConfirmDialog from './ConfirmDialog';
import { getUserAvatar } from '../../../../utils/avatarUtils.js';
import { toastError, toastSuccess } from '../../../../utils/toast.js';
// import { getUserAvatar } from '../../../../../utils/avatarUtils.js';


const AllocateDialog = ({ roomId, hostelId, onClose, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hostellers, setHostellers] = useState([]);
  const [selectedHosteller, setSelectedHosteller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    try {
      setSearching(true);
      const { data } = await searchHostellers(searchQuery);
      setHostellers(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAllocate = async () => {
    if (!selectedHosteller) return;
    
    try {
      setLoading(true);
      await allocateRoom(hostelId, roomId, selectedHosteller.id);
      toastSuccess('Bed allocated');
      onSuccess();
    } catch (error) {
      console.error('Allocation failed:', error);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Failed to allocate room';
      
      if (error.message?.includes('Transaction not found') || 
          error.message?.includes('Transaction ID is invalid') ||
          error.message?.includes('old closed transaction')) {
        errorMessage = 'Database transaction error. Please try again in a few moments.';
      } else if (error.message?.includes('Room is full')) {
        errorMessage = 'This room is already at full capacity.';
      } else if (error.message?.includes('Hosteller already has an active stay')) {
        errorMessage = 'This hosteller already has an active room allocation.';
      } else if (error.message?.includes('Room not found')) {
        errorMessage = 'The selected room is no longer available.';
      } else if (error.message?.includes('Hosteller not found')) {
        errorMessage = 'The selected hosteller is no longer available.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setHostellers([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                  <User className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    Allocate Bed
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Search for available hosteller by email
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter hosteller email (e.g. john@example.com)"
                className="w-full pl-11 pr-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {searching && (
                <Loader size="sm" showText={false} className="absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Search Results */}
            {hostellers.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-xl p-2 bg-stone-50 dark:bg-stone-800/50">
                {hostellers.map((hosteller) => (
                  <div
                    key={hosteller.id}
                    onClick={() => setSelectedHosteller(hosteller)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-white dark:hover:bg-stone-700 ${
                      selectedHosteller?.id === hosteller.id
                        ? 'bg-orange-50 dark:bg-orange-900/30 border-2 border-orange-200 dark:border-orange-800'
                        : 'hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-md ${
                          selectedHosteller?.id === hosteller.id 
                            ? 'ring-2 ring-orange-400' 
                            : ''
                        }`}>
                          <img 
                            src={getUserAvatar(hosteller)} 
                            alt={hosteller.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {hosteller.fullName}
                          </p>
                          <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
                            {hosteller.email}
                          </p>
                          {hosteller.hostellerProfile?.collegeName && (
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {hosteller.hostellerProfile.collegeName}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedHosteller?.id === hosteller.id && (
                        <CheckCircle className="h-5 w-5 text-orange-600 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Hosteller Preview */}
            {selectedHosteller && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-lg">
                      {selectedHosteller.fullName}
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {selectedHosteller.email}
                    </p>
                    {selectedHosteller.hostellerProfile?.collegeName && (
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium mt-1">
                        {selectedHosteller.hostellerProfile.collegeName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-0 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 sticky bottom-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!selectedHosteller || loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader size="sm" showText={false} />
                    Allocating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Allocate Bed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Allocation */}
      {showConfirm && (
        <ConfirmDialog
          title="Confirm Allocation"
          message={`Allocate Room ${roomId} to ${selectedHosteller?.fullName || ''}?`}
          onConfirm={handleAllocate}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
          variant="success"        // 🟢 MAKE SURE THIS IS "success"
          confirmText="Allocate"
          cancelText="Cancel"
        />
      )}


    </>
  );
};

export default AllocateDialog;
