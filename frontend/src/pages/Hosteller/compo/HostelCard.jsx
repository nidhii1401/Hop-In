import React from 'react';
import { Wifi, Zap, Wind, ParkingCircle, Shirt, Dumbbell, Users, Bed, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const amenityIcons = {
  'Wi-Fi': Wifi,
  'Air Conditioning': Wind,
  'Power Backup': Zap,
  'Parking': ParkingCircle,
  'Laundry': Shirt,
  'Gym': Dumbbell,
  'BED': Bed,
  'MATTRESS': Bed
};

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);


  // Helper to get badge color based on mess type
  const getMessBadgeStyle = (type) => {
    switch (type) {
      case 'COMPULSORY': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'OPTIONAL': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300';
    }
  };

  const handleNavigate= (hostel_id)=>{
    if(user && (user.role==='ADMIN' || user.role==='OWNER')){  
      navigate(`/owner/hostel/${hostel_id}`)
    }
    else{ 
      navigate(`/hosteller/hostel/${hostel_id}`)
    }
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
      
      {/* Image Section - Updated for coverImage */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={hostel.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop"} 
          alt={hostel.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${getMessBadgeStyle(hostel.messType)}`}>
            {hostel.messType === 'NONE' ? 'No Mess' : `${hostel.messType} Mess`}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col gap-3 grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {hostel.name || 'Unnamed Hostel'}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              <MapPin className="h-4 w-4 inline mr-1 -mt-0.5" />
              {hostel.area || 'N/A'}, {hostel.city || 'N/A'}
            </p>
          </div>
        </div>

        {/* Stats Row - Updated for backend data */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <Bed className="h-4 w-4 text-stone-600" />
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {hostel.totalRooms || 0} Rooms
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm justify-end">
            <Users className="h-4 w-4 text-stone-600" />
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {hostel.activeResidents || 0} Residents
            </span>
          </div>
        </div>

        {/* Price - Updated for backend structure */}
        {hostel.messPricePerMonth ? (
          <p className="font-bold text-orange-600 dark:text-orange-500 text-sm">
            Mess: ₹{(Number(hostel.messPricePerMonth) || 0).toLocaleString()}/month
          </p>
        ) : (
          <p className="text-sm text-stone-500 dark:text-stone-400 italic">
            Contact owner for pricing
          </p>
        )}

        {/* Amenities Icons - Updated for topAmenities */}
        {hostel.topAmenities && hostel.topAmenities.length > 0 && (
          <div className="flex items-center gap-3 text-stone-400 dark:text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800 mt-auto">
            {hostel.topAmenities.slice(0, 4).map((amenity, idx) => {
              const Icon = amenityIcons[amenity] || Zap; // Default icon
              return <Icon key={idx} size={18} title={amenity} />;
            })}
            {hostel.topAmenities.length > 4 && (
              <span className="text-xs font-medium text-stone-600 dark:text-stone-400">+{hostel.topAmenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Owner Name */}
        {hostel.ownerName && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
            by {hostel.ownerName}
          </p>
        )}

        {/* CTA Button */}
        <button 
          onClick={() =>handleNavigate(hostel.id)}
          className="w-full mt-4 flex items-center justify-center rounded-lg h-10 px-4 bg-linear-to-r from-orange-500 to-orange-600 text-white text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default HostelCard;
