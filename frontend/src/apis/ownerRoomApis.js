import { axiosInstance } from "../axios/axiosInstance";

// GET /owner/hostels/:hostelId/rooms - All rooms for hostel
export const getHostelRooms = async (hostelId) => {
  try {
    const response = await axiosInstance.get(`/owner/hostels/${hostelId}/rooms`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// GET /owner/hostels/:hostelId/rooms/:roomId - Single room details
export const getRoomDetails = async (hostelId, roomId) => {
  try {
    const response = await axiosInstance.get(`/owner/hostels/${hostelId}/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// GET /owner/search-hostellers?email= - Search available hostellers
export const searchHostellers = async (email = '') => {
  try {
    const response = await axiosInstance.get('/owner/search-hostellers', {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// POST /owner/hostels/:hostelId/rooms/:roomId/allocate - Allocate room
export const allocateRoom = async (hostelId, roomId, hostellerId) => {
  try {
    const response = await axiosInstance.post(
      `/owner/hostels/${hostelId}/rooms/${roomId}/allocate`,
      { hostellerId }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// DELETE /owner/hostels/:hostelId/rooms/:roomId/stays/:stayId - Deallocate
export const deallocateRoom = async (hostelId, roomId, stayId) => {
  try {
    const response = await axiosInstance.delete(
      `/owner/hostels/${hostelId}/rooms/${roomId}/stays/${stayId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
