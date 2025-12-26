import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BedDouble, Edit, Trash2, Plus, Search } from 'lucide-react';
import {axiosInstance} from '../../axios/axiosInstance';

const OwnerRoomsPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hostelId) {
      fetchRooms();
    }
  }, [hostelId]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/rooms/hostel/${hostelId}`);
      if (response.data.success) {
        setRooms(response.data.data || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floor.toString().includes(searchTerm)
  );

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axiosInstance.delete(`/rooms/${roomId}`);
        setRooms(rooms.filter(room => room.id !== roomId));
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  const handleSave = async (updatedRoom) => {
    try {
      const response = await axiosInstance.put(`/rooms/${updatedRoom.id}`, updatedRoom);
      if (response.data.success) {
        setRooms(rooms.map(room => 
          room.id === updatedRoom.id ? response.data.data : room
        ));
        setIsModalOpen(false);
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Failed to update room:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Rooms Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64"
              />
            </div>
            <button
              onClick={() => navigate('/owner/hostels')}
              className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back to Hostels
            </button>
          </div>
        </div>

        {/* Add Room Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/owner/hostels/${hostelId}/edit`)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={16} /> Add Room
          </button>
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <BedDouble className="mx-auto mb-4 text-stone-400" size={48} />
            <p className="text-stone-600 dark:text-stone-400">
              {searchTerm ? 'No rooms found matching your search' : 'No rooms available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Room {room.roomNumber}</h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{room.roomType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">Floor:</span>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{room.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">Capacity:</span>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{room.capacity} Person(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">Price:</span>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">₹{room.pricePerMonth}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-stone-600 dark:text-stone-400">Status:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      room.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {room.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/owner/hostels/${hostelId}/rooms/${room.id}/edit`)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Room Modal */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-stone-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Edit Room</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(selectedRoom); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Room Number</label>
                  <input
                    type="text"
                    value={selectedRoom.roomNumber}
                    onChange={(e) => setSelectedRoom({...selectedRoom, roomNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Floor</label>
                  <input
                    type="number"
                    value={selectedRoom.floor}
                    onChange={(e) => setSelectedRoom({...selectedRoom, floor: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Room Type</label>
                  <select
                    value={selectedRoom.roomType}
                    onChange={(e) => setSelectedRoom({...selectedRoom, roomType: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="DORM">Dormitory</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={selectedRoom.capacity}
                    onChange={(e) => setSelectedRoom({...selectedRoom, capacity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Price per Month (₹)</label>
                  <input
                    type="number"
                    value={selectedRoom.pricePerMonth}
                    onChange={(e) => setSelectedRoom({...selectedRoom, pricePerMonth: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={selectedRoom.isActive}
                      onChange={(e) => setSelectedRoom({...selectedRoom, isActive: e.target.checked})}
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    Active Room
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerRoomsPage;
