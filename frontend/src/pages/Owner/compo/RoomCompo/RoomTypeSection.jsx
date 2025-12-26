// src/components/owner/RoomTypeSection.jsx
import React from 'react';
import {RoomCard} from './RoomCard.jsx';
import { BedDouble } from 'lucide-react';

const RoomTypeSection = ({ type, rooms, onRoomClick, getOccupancyStatus }) => {
  const getTypeDisplay = (type) => {
    const typeMap = {
      'SINGLE': '1-Seater',
      'DOUBLE': '2-Seater', 
      'TRIPLE': '3-Seater',
      'SEATER_4': '4-Seater',
      'SEATER_5': '5-Seater',
      'SEATER_6': '6-Seater'
    };
    return typeMap[type] || `${type.replace('SEATER_', '')}-Seater`;
  };

  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupied = rooms.reduce((sum, room) => sum + (room.stays?.length || 0), 0);

  return (
    <section className="space-y-4">
      {/* SIMPLIFIED Header - No brown bg */}
      <div className="flex items-center gap-3 p-3 bg-transparent">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <BedDouble className="h-5 w-5 text-orange-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {getTypeDisplay(type)} ({totalRooms} rooms)
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
            {totalOccupied}/{totalCapacity} occupied
            <span className="w-16 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <span 
                className="h-full inline-block bg-orange-500 rounded-full transition-all"
                style={{ width: `${totalCapacity > 0 ? (totalOccupied/totalCapacity)*100 : 0}%` }}
              />
            </span>
          </p>
        </div>
      </div>

      {/* LARGER Room Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            occupancy={getOccupancyStatus(room)}
            onClick={() => onRoomClick(room)}
          />
        ))}
      </div>
    </section>
  );
};

export default RoomTypeSection;
