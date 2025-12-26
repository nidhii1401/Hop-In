import { axiosInstance } from '../axios/axiosInstance.js';

// Create Hostel with Image Upload
// src/apis/ownerApis.js

export const createHostel = async (hostelData) => {
  try {
    if (hostelData.images && hostelData.images.length > 0) {
      const formData = new FormData();
      
      // Add all hostel data fields
      Object.keys(hostelData).forEach(key => {
        if (key !== 'images') {
          if (Array.isArray(hostelData[key])) {
            formData.append(key, JSON.stringify(hostelData[key]));
          } else {
            formData.append(key, hostelData[key]);
          }
        }
      });
      
      // ✅ FIX: Change 'images' to 'hostelImages' to match backend middleware
      hostelData.images.forEach((image, index) => {
        if (image.file) {
          formData.append('hostelImages', image.file); // <--- CHANGED HERE
          
          // Keep metadata as is, backend parses it manually
          formData.append(`imageData[${index}]`, JSON.stringify({
            isCover: image.isCover,
            mediaType: image.mediaType || 'IMAGE'
          }));
        }
      });
      
      const response = await axiosInstance.post('/owner/hostels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      const response = await axiosInstance.post('/owner/hostels', hostelData);
      return response.data;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};


// Get All Owner Hostels
export const getOwnerHostels = async () => {
  try {
    const response = await axiosInstance.get('/owner/hostels');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Hostel By ID
export const getHostelById = async (id) => {
  try {
    const response = await axiosInstance.get(`/owner/hostels/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Hostel
export const updateHostel = async (hostelId, updateData) => {
  try {
    const response = await axiosInstance.put(`/owner/hostels/${hostelId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete Hostel (Soft Delete)
export const deleteHostel = async (hostelId) => {
  try {
    const response = await axiosInstance.delete(`/owner/hostels/${hostelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



// Upload Hostel Media
export const uploadHostelMedia = async (hostelId, formData) => {
  try {
    console.log('=== FRONTEND UPLOAD DEBUG ===');
    console.log('hostelId:', hostelId);
    console.log('formData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await axiosInstance.post(`/owner/hostels/${hostelId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



// Add Room to Hostel
export const addRoomToHostel = async (hostelId, roomData) => {
  try {
    console.log("add room front call");
    
    const response = await axiosInstance.post(`/owner/hostels/rooms/${hostelId}`, roomData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// Delete Hostel Media
export const deleteHostelMedia = async (hostelId, mediaId) => {
  try {
    const response = await axiosInstance.delete(`/owner/hostels/${hostelId}/media/${mediaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Hostel Media (for cover image, sort order, etc.)
export const updateHostelMedia = async (hostelId, mediaId, updateData) => {
  try {
    const response = await axiosInstance.put(`/owner/hostels/${hostelId}/media/${mediaId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Available Amenities
export const getAmenities = async () => {
  try {
    const response = await axiosInstance.get('/amenities');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Hostel Amenities
export const updateHostelAmenities = async (hostelId, amenityIds) => {
  try {
    const response = await axiosInstance.put(`/owner/hostels/${hostelId}/amenities`, { amenityIds });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Hostel Statistics
export const getHostelStats = async (hostelId) => {
  try {
    const response = await axiosInstance.get(`/owner/hostels/${hostelId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Owner Dashboard Data
export const getOwnerDashboard = async () => {
  try {
    const response = await axiosInstance.get('/owner/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};