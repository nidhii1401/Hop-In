import { axiosInstance } from "../axios/axiosInstance";

// Get all / filtered hostels
export const getAllHostels = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const query = params.toString();
    const url = query
      ? `/hosteller/getAllHostels?${query}`
      : "/hosteller/getAllHostels";

    const res = await axiosInstance.get(url);
    return res.data; // { success, hostels, ... }
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get hostel details by ID
export const getHostelById = async (hostelId) => {
  try {
    const response = await axiosInstance.get(
      `/hosteller/getHostelById/${hostelId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getHostelResidents = async (hostelId) => {
  try {
    const response = await axiosInstance.get(
      `/hosteller/getHostelResidents/${hostelId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyStay = async () => {
  try {
    const response = await axiosInstance.get("/hosteller/mystay");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
