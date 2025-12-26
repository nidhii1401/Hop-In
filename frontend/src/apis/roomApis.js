import {axiosInstance} from '../axios/axiosInstance.js';

// Get all rooms for a specific hostel
export const getRoomsByHostel = async (hostelId) => {
  try {
    const response = await axiosInstance.get(`/rooms/hostel/${hostelId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error.response?.data || error;
  }
};

// Get a specific room by ID
export const getRoomById = async (roomId) => {
  try {
    const response = await axiosInstance.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch room:', error);
    throw error.response?.data || error;
  }
};

// Update a room
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await axiosInstance.put(`/rooms/update/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    console.error('Failed to update room:', error);
    throw error.response?.data || error;
  }
};

// Add a new room
export const addRoom = async (hostelId, roomData) => {
  try {
    const response = await axiosInstance.post(`/rooms/add/${hostelId}`, roomData);
    return response.data;
  } catch (error) {
    console.error('Failed to add room:', error);
    throw error.response?.data || error;
  }
};

// Delete a room
export const deleteRoom = async (roomId) => {
  try {
    const response = await axiosInstance.delete(`/rooms/delete/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete room:', error);
    throw error.response?.data || error;
  }
};

// Change room status (activate/deactivate)
export const toggleRoomStatus = async (roomId) => {
  try {
    const response = await axiosInstance.patch(`/rooms/${roomId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Failed to toggle room status:', error);
    throw error.response?.data || error;
  }
};
