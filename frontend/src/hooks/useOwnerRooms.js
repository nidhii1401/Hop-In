// src/hooks/useOwnerRooms.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHostelRooms } from '../apis/ownerRoomApis.js';

export const useOwnerRooms = () => {
  const { hostelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getHostelRooms(hostelId);
      
      // Group rooms by type
      const grouped = data.reduce((acc, room) => {
        const typeKey = room.roomType;
        if (!acc[typeKey]) acc[typeKey] = [];
        acc[typeKey].push(room);
        return acc;
      }, {});
      
      setRooms(data);
      setRoomTypes(grouped);
      return data; // Return the fresh data
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms');
      throw err; // Re-throw to allow caller to handle
    } finally {
      setLoading(false);
    }
  };

  const refreshRooms = async () => {
    return await fetchRooms();
  };

  useEffect(() => {
    if (hostelId) fetchRooms();
  }, [hostelId]);

  const getOccupancyStatus = (room) => {
    const occupied = room.stays?.length || 0;
    const capacity = room.capacity;
    return {
      occupied,
      available: capacity - occupied,
      percentage: capacity > 0 ? (occupied / capacity) * 100 : 0
    };
  };

  return {
    rooms,
    roomTypes,
    loading,
    error,
    refreshRooms,
    getOccupancyStatus
  };
};
