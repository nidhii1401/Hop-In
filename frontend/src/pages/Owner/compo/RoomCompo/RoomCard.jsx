// src/components/owner/RoomCard.jsx
import { getUserAvatar } from '../../../../utils/avatarUtils.js';

export const RoomCard = ({ room, occupancy, onClick }) => {
  const { occupied, available, percentage } = occupancy;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-200 dark:border-stone-800 p-5 hover:shadow-xl hover:border-orange-400 hover:-translate-y-1 transition-all duration-200 h-40 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Status Badge - Fixed Position */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10">
        <div className={`w-5 h-5 rounded-full shadow-sm border-2 border-white dark:border-stone-900 ${
          percentage === 100 ? 'bg-red-500' :
          percentage > 75 ? 'bg-orange-500' :
          percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
        }`} />
      </div>

      {/* Room Number */}
      <div className="font-bold text-lg text-stone-900 dark:text-stone-100 z-10 relative">
        {room.roomNumber}
      </div>

      {/* Avatar Stack - Fixed */}
      <div className="flex-1 flex items-center mt-3 relative z-10">
        <div className="flex -space-x-2 w-full justify-center">
          {room.stays?.slice(0, 3).map((stay, index) => (
            <div
              key={stay.id}
              className="h-12 w-12 rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-20"
              style={{ zIndex: 3 - index }}
            >
              <img 
                src={getUserAvatar(stay.hosteller)} 
                alt={stay.hosteller.fullName}
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          ))}
          {room.stays?.length > 3 && (
            <div className="h-12 w-12 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-md ml-1 z-10">
              +{room.stays.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="space-y-1 z-10 relative">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600 dark:text-stone-400">{occupied}/{room.capacity}</span>
          <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
            ₹{room.pricePerMonth?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-stone-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
    </div>
  );
};
