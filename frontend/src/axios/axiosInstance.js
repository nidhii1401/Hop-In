import axios from "axios";

// Ensure this matches your backend port exactly
const BaseUrl = "http://localhost:5000/api"; 

export const axiosInstance = axios.create({
    baseURL: BaseUrl,
    withCredentials: true, // ✅ CRITICAL: This automatically sends the HTTP-Only cookie
    headers: {
        'Content-Type': 'application/json',
    }
});

// Response Interceptor: Just handles logout if cookie expires
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If Backend says "Unauthorized" (401), it means the Cookie is expired or missing.
        if (error.response?.status === 401) {
            console.warn("Session expired or invalid cookie.");
            
            // Optional: Force redirect to login if it happens on a protected page
            // if (!window.location.pathname.includes('/login')) {
            //    window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);
