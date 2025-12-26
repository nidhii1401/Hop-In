// src/components/owner/RoomDetailsModal.jsx - COMPLETE FIXED VERSION
import React, { useState } from 'react';
import { 
  X, BedDouble, Users, User, DollarSign, Trash2, AlertTriangle 
} from 'lucide-react';
import { deallocateRoom } from '../../../../apis/ownerRoomApis';
import AllocateDialog from './AllocateDialog.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import OccupantDetailsPopup from './OccupantDetailsPopup.jsx';
import { getUserAvatar } from '../../../../utils/avatarUtils.js';
import { toastError, toastSuccess } from '../../../../utils/toast.js';
// import { getUserAvatar } from '../../../../../utils/avatarUtils.js';

const RoomDetailsModal = ({ room, onClose, onRefresh, hostelId }) => {
  // 🆕 ALL STATES
  const [showAllocate, setShowAllocate] = useState(false); // 🆕 MISSING STATE ADDED
  const [showConfirm, setShowConfirm] = useState(false);
  const [stayToRemove, setStayToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [showOccupantsPopup, setShowOccupantsPopup] = useState(false);
  const [hoveredOccupant, setHoveredOccupant] = useState(null);

  const occupancy = {
    occupied: room.stays?.length || 0,
    available: room.capacity - (room.stays?.length || 0),
    percentage: room.capacity > 0 ? ((room.stays?.length || 0) / room.capacity) * 100 : 0
  };

   
  

  // 🆕 PERFECT EXCLUSIVE HANDLERS
  const handleOccupantClick = (stay) => {
    if (hoveredOccupant?.id === stay.id) {
      // Same occupant → Close
      setShowOccupantsPopup(false);
      setHoveredOccupant(null);
    } else {
      // Different occupant → Show new
      setHoveredOccupant(stay);
      setShowOccupantsPopup(true);
    }
  };

  // 🆕 Close popup + reset
  const closeOccupantsPopup = () => {
    setShowOccupantsPopup(false);
    setHoveredOccupant(null);
  };

  const handleDeallocate = async (stayId) => {
    setStayToRemove(stayId);
    setShowConfirm(true);
  };

  const confirmDeallocate = async () => {
    if (!stayToRemove) return;
    
    try {
      setRemoving(true);
      await deallocateRoom(hostelId, room.id, stayToRemove);
      await onRefresh();
      toastSuccess('Occupant removed');
      closeOccupantsPopup(); // 🆕 Close popup after success
    } catch (error) {
      console.error('Deallocation failed:', error);
      toastError(error?.message || 'Failed to remove occupant');
    } finally {
      setRemoving(false);
      setShowConfirm(false);
      setStayToRemove(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      />
      
      {/* Main Modal - Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-6 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                  <BedDouble className="h-7 w-7 text-orange-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    Room {room.roomNumber}
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    {room.capacity} beds • Floor {room.floor || 'G'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors z-20"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 relative z-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Occupancy */}
              <div className="lg:col-span-1 p-6 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">Occupancy</h3>
                </div>
                <div className="text-3xl font-bold text-orange-600 text-center mb-2">
                  {occupancy.occupied}/{room.capacity}
                </div>
                <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-4 mb-2">
                  <div 
                    className="h-4 bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${occupancy.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-stone-500 text-center">
                  {occupancy.available} available
                </div>
              </div>

              {/* Pricing */}
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">Pricing</h3>
                </div>
                <div className="text-3xl font-bold text-emerald-600 text-center">
                  ₹{room.pricePerMonth?.toLocaleString()}
                </div>
                <div className="text-sm text-stone-600 text-center dark:text-stone-400">
                  Per bed/month
                </div>
              </div>

              {/* Room Info */}
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <BedDouble className="h-6 w-6 text-blue-600" />
                  <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">Room Info</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">Type</span>
                    <span className="font-medium capitalize">{room.roomType.replace('_', '-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">Floor</span>
                    <span>{room.floor || 'Ground'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 🆕 FIXED OCCUPANTS SECTION */}
            <div className="mt-8 p-6 bg-linear-to-br from-slate-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-7 w-7 text-orange-600 bg-orange-100 p-2 rounded-xl dark:bg-orange-900/50" />
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Current Occupants</h3>
              </div>
              
              {/* 🆕 FIXED CONTAINER - Closes on click */}
              <div 
                className="flex -space-x-4 overflow-hidden p-2 mb-4 relative cursor-pointer"
                onClick={closeOccupantsPopup}
              >
                {room.stays?.slice(0, 6).map((stay, index) => (
                  <div
                    key={stay.id}
                    className="relative inline-block h-16 w-16 rounded-2xl shadow-lg cursor-pointer hover:scale-[1.15] transition-all duration-200 hover:z-60 hover:shadow-2xl hover:ring-orange-400 dark:hover:ring-orange-700"
                    style={{ zIndex: room.stays.length - index }}
                    onClick={(e) => {
                      e.stopPropagation(); // 🆕 CRITICAL
                      handleOccupantClick(stay); // 🆕 USE CORRECT HANDLER
                    }}
                  >
                    <img 
                      src={getUserAvatar(stay.hosteller)} 
                      alt={stay.hosteller.fullName}
                      className="h-full w-full object-cover rounded-2xl shadow-md hover:brightness-110 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-3 border-white dark:border-stone-900">
                      {stay.hosteller.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ))}
                
                {room.stays?.length > 6 && (
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 text-white text-sm font-bold shadow-lg ml-2 z-10 cursor-default">
                    +{room.stays.length - 6}
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-stone-500 dark:text-stone-400 pt-2">
                {occupancy.occupied} / {room.capacity} occupants
                {occupancy.available > 0 && (
                  <span className="ml-2 text-green-600 font-medium">+{occupancy.available} available</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 pt-0 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 sticky bottom-0 z-20">
            <div className="flex flex-col sm:flex-row gap-4">
              {occupancy.available > 0 ? (
                <button
                  onClick={() => setShowAllocate(true)}
                  className="flex-1 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <User className="h-6 w-6" />
                  Allocate Bed ({occupancy.available})
                </button>
              ) : (
                <div className="flex-1 bg-linear-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
                  <AlertTriangle className="h-6 w-6" />
                  Room Full
                </div>
              )}
              <button
                onClick={onClose}
                className="px-8 py-4 border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 font-bold transition-all duration-200 hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 OCCUPANTS POPUP - z-[100] */}
      {showOccupantsPopup && hoveredOccupant && (
        <OccupantDetailsPopup 
          occupant={hoveredOccupant.hosteller}
          stay={hoveredOccupant} // 🆕 Pass full stay object
          onClose={closeOccupantsPopup}
          hostelId={hostelId}
          roomId={room.id}
          onDeallocate={handleDeallocate}
          stayId={hoveredOccupant.id}
        />
      )}

      {/* Allocate Dialog */}
      {showAllocate && (
        <AllocateDialog
          roomId={room.id}
          hostelId={hostelId}
          onClose={() => setShowAllocate(false)}
          onSuccess={async () => {
            await onRefresh();
            setShowAllocate(false);
          }}
        />
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Remove Occupant"
          message="Are you sure you want to remove this occupant from the room?"
          onConfirm={confirmDeallocate}
          onCancel={() => {
            setShowConfirm(false);
            setStayToRemove(null);
          }}
          loading={removing}
          variant="danger"         // 🔴 MAKE SURE THIS IS "danger"
          confirmText="Remove"
        />
      )}
    </>
  );
};

export default RoomDetailsModal;
