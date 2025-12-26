import React, { useState } from 'react';
import { Plus, BedDouble, Edit2, Trash2 } from 'lucide-react';
import EditRoomModal from './EditRoomModal.jsx';
import DeleteRoomModal from './DeleteRoomModal.jsx';
import AddRoomModal from './AddRoomModal.jsx';
import { deleteRoom, updateRoom, addRoom } from '../../../apis/roomApis.js';
import { toastError, toastSuccess } from '../../../utils/toast.js';

const RoomsSection = ({ rooms, hostelId, onRoomsUpdate }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingRoom, setEditingRoom] = useState(null);
  // ✅ Changed: Store the full room object for deletion
  const [deletingRoom, setDeletingRoom] = useState(null);
  
  const [loading, setLoading] = useState({});
  // Store specific server errors to pass to modals
  const [modalError, setModalError] = useState(null);

  // Open Edit Modal
  const handleEditRoom = (room) => {
    setModalError(null);
    setEditingRoom(room); // room now has .occupancy property from backend
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const handleDeleteRoom = (roomId) => {
    setModalError(null);
    // ✅ Find the full room object to pass to the modal (for occupancy check)
    const roomToDelete = rooms.find(r => r.id === roomId);
    setDeletingRoom(roomToDelete);
    setIsDeleteModalOpen(true);
  };

  // Handle Room Update
  const handleUpdateRoom = async (updatedRoomData) => {
    if (!editingRoom) return;
    
    setLoading({ ...loading, [editingRoom.id]: true });
    setModalError(null);

    try {
      const response = await updateRoom(editingRoom.id, updatedRoomData);
      if (response.success) {
        // Update local state
        // ✅ CRITICAL: Preserve 'occupancy' from the old room object 
        const updatedRooms = rooms.map(room => 
          room.id === editingRoom.id 
            ? { ...response.data, occupancy: room.occupancy } 
            : room
        );
        onRoomsUpdate(updatedRooms);
        toastSuccess('Room updated');
        setIsEditModalOpen(false);
        setEditingRoom(null);
      }
    } catch (error) {
      console.error("Failed to update room:", error);
      // ✅ Handle "Cannot reduce capacity" error
      if (error.details) {
        setModalError(error.message + (error.details.error ? `: ${error.details.error}` : ''));
      } else {
        setModalError(error.message || "Failed to update room");
      }
      toastError(error.message || "Failed to update room");
    } finally {
      setLoading({ ...loading, [editingRoom.id]: false });
    }
  };

  // Handle Room Delete Confirm
  const handleDeleteRoomConfirm = async () => {
    if (!deletingRoom) return;
    
    setLoading({ ...loading, delete: true });
    setModalError(null);

    try {
      const response = await deleteRoom(deletingRoom.id);
      if (response.success) {
        const updatedRooms = rooms.filter(room => room.id !== deletingRoom.id);
        onRoomsUpdate(updatedRooms);
        toastSuccess('Room deleted');
        setIsDeleteModalOpen(false);
        setDeletingRoom(null);
      }
    } catch (error) {
      console.error("Failed to delete room:", error);
      // ✅ Handle "Active residents" error from backend
      if (error.details && error.details.activeResidents) {
        setModalError(`Cannot delete room. There are ${error.details.activeResidents} active resident(s).`);
      } else {
        setModalError(error.message || "Failed to delete room");
      }
      toastError(error.message || "Failed to delete room");
    } finally {
      setLoading({ ...loading, delete: false });
    }
  };

  // Handle Room Add
  const handleSaveRoom = async (newRoomData) => {
    setLoading({ ...loading, add: true });
    setModalError(null);

    try {
      const response = await addRoom(hostelId, newRoomData);
      if (response.success) {
        // New rooms have 0 occupancy by default
        const newRoom = { ...response.data, occupancy: 0 };
        const updatedRooms = [...rooms, newRoom];
        onRoomsUpdate(updatedRooms);
        toastSuccess('Room added');
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add room:", error);
      const msg = error.message || "Failed to add room";
      setModalError(msg);
      toastError(msg);
    } finally {
      setLoading({ ...loading, add: false });
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-8 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Rooms Configuration</h3>
        <button 
          type="button"
          onClick={() => { setModalError(null); setIsAddModalOpen(true); }}
          className="flex items-center gap-2 text-sm bg-stone-800 dark:bg-stone-700 text-white px-3 py-1.5 rounded-lg hover:bg-stone-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 dark:bg-stone-950/50 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 text-stone-500">
          <BedDouble size={48} className="mx-auto mb-3 opacity-40" />
          <p>No rooms added yet. Click "Add Room" to start.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm max-h-96 scrollbar-thin">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 uppercase font-medium border-b border-stone-200 dark:border-stone-800 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 w-12">#</th>
                  <th className="px-4 py-3">Room No.</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Price (₹)</th>
                  <th className="px-4 py-3 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {rooms.map((room, index) => {
                  // ✅ Use direct property from backend
                  const occupancy = room.occupancy || 0; 
                  
                  return (
                    <tr key={room.id || index} className="bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                      <td className="px-4 py-3 text-stone-400 font-mono text-xs">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-200">{room.roomNumber}</td>
                      <td className="px-4 py-3">{room.roomType}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                           occupancy >= room.capacity 
                           ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                           : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {occupancy} / {room.capacity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-orange-600">₹{room.pricePerMonth.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditRoom(room)}
                            disabled={loading[room.id]}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room.id)}
                            disabled={loading.delete}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals with Error Props */}
      <EditRoomModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setEditingRoom(null); setModalError(null); }} 
        room={editingRoom}
        onSave={handleUpdateRoom}
        loading={loading[editingRoom?.id]}
        serverError={modalError}
      />
      
      <DeleteRoomModal 
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingRoom(null); setModalError(null); }}
        onConfirm={handleDeleteRoomConfirm}
        loading={loading.delete}
        // ✅ Pass full room object for internal occupancy check
        room={deletingRoom}
        serverError={modalError}
      />
      
      <AddRoomModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setModalError(null); }} 
        onSave={handleSaveRoom} 
        loading={loading.add}
        serverError={modalError}
      />
    </div>
  );
};

export default RoomsSection;
