import axios from "axios";

const BaseUrl = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Injected after store is created to avoid circular imports
let _store = null;
export const injectStore = (store) => {
  _store = store;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthRoute = window.location.pathname.includes("/login") ||
                        window.location.pathname.includes("/signup") ||
                        window.location.pathname.includes("/verify-otp");
    const isCheckAuth = error.config?.url?.includes("/auth/check-auth");

    if ((status === 401 || status === 403) && !isAuthRoute && !isCheckAuth) {
      if (_store) {
        // Clear user from Redux state
        _store.dispatch({ type: "auth/logout/fulfilled" });
      }
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);