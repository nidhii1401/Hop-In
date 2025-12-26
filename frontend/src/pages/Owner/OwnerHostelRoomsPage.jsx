// src/pages/owner/OwnerHostelRoomsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BedDouble, Users } from 'lucide-react';
import { useOwnerRooms } from '../../hooks/useOwnerRooms';
import RoomTypeSection from './compo/RoomCompo/RoomTypeSection';
import RoomDetailsModal from './compo/RoomCompo/RoomDetailsModal';
import Loader from '../Common/UI/Loader';
// import Loader from '../../../components/UI/Loader.jsx';

const OwnerHostelRoomsPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const { 
    rooms, 
    roomTypes, 
    loading, 
    error, 
    refreshRooms, 
    getOccupancyStatus 
  } = useOwnerRooms();

  // Sort room types: lower seater first (SINGLE=1, DOUBLE=2, TRIPLE=3, etc.)
  const sortedRoomTypes = Object.entries(roomTypes).sort(([typeA], [typeB]) => {
    const getSeaterValue = (type) => {
      if (type === 'SINGLE') return 1;
      if (type === 'DOUBLE') return 2;
      if (type === 'TRIPLE') return 3;
      return parseInt(type.replace('SEATER_', '')) || 999;
    };
    return getSeaterValue(typeA) - getSeaterValue(typeB);
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <BedDouble className="mx-auto h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Failed to load rooms</h2>
          <p className="text-stone-500 mb-6">{error}</p>
          <button
            onClick={refreshRooms}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

   // Lock body scroll when modal is open (Mobile only)
  useEffect(() => {
    const handleScrollLock = () => {
      const isSmallScreen = window.innerWidth < 1024; // changed to lg (1024px) or keep 768px depending on your "mobile" definition
      
      if (selectedRoom && isSmallScreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleScrollLock(); // Run immediately on state change
    
    // Optional: Update on resize if user rotates device
    window.addEventListener('resize', handleScrollLock);

    return () => {
      document.body.style.overflow = ''; // Cleanup always unlocks
      window.removeEventListener('resize', handleScrollLock);
    };
  }, [selectedRoom]);


  return (
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen ">
      <div className="max-w-7xl mx-auto  sm:px-10 px-0 ">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/owner/hostels')}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium mb-4 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 dark:hover:text-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back 
          </button>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                Hostel Rooms
              </h1>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Manage room allocations (Hostel #{hostelId})
              </p>
            </div>
            
            {/* Simple Stats */}
            {!loading && (
              <div className="flex gap-4 bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {rooms.length}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Total Rooms</div>
                </div>
                <div className="w-px bg-stone-200 dark:bg-stone-700 mx-4"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {rooms.reduce((sum, r) => sum + (r.stays?.length || 0), 0)}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Occupied</div>
                </div>
                <div className="w-px bg-stone-200 dark:bg-stone-700 mx-4"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {rooms.reduce((sum, r) => sum + (r.capacity - (r.stays?.length || 0)), 0)}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Available</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <Loader 
            size="lg" 
            text="Loading rooms..." 
            className="py-20"
          />
        ) : Object.keys(roomTypes).length === 0 ? (
          <div className="text-center py-20">
            <BedDouble className="mx-auto h-16 w-16 text-stone-400 mb-4" />
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">No rooms found</h3>
            <p className="text-stone-500 dark:text-stone-400 mb-6">This hostel has no rooms configured.</p>
            <button
              onClick={refreshRooms}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Room Types - SIMPLIFIED */}
            {sortedRoomTypes.map(([type, typeRooms]) => (
              <div key={type}>
                <RoomTypeSection 
                  type={type}
                  rooms={typeRooms}
                  onRoomClick={setSelectedRoom}
                  getOccupancyStatus={getOccupancyStatus}
                />
              </div>
            ))}
          </div>
        )}

        {/* Room Details Modal */}
        {selectedRoom && (
          <RoomDetailsModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            onRefresh={async () => {
              const updatedRooms = await refreshRooms();
              // Update selectedRoom with fresh data from the returned rooms
              const updatedRoom = updatedRooms.find(r => r.id === selectedRoom.id);
              if (updatedRoom) {
                setSelectedRoom(updatedRoom);
              }
            }}
            hostelId={hostelId}
          />
        )}
      </div>
    </div>
  );
};

export default OwnerHostelRoomsPage;
