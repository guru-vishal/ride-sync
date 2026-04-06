import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ridesync_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "An unexpected error occurred";

    return Promise.reject({ ...error, userMessage: message });
  }
);

export const ridesService = {
  createRide: async (rideData) => {
    const response = await api.post("/rides", rideData);
    return response.data;
  },

  getRidesByDriver: async (driverId) => {
    const response = await api.get(`/rides/driver/${encodeURIComponent(driverId)}`);
    return response.data;
  },

  searchRides: async (source, destination) => {
    const response = await api.get("/rides", {
      params: { source, destination },
    });
    return response.data;
  },

  bookRide: async (bookingData) => {
    const response = await api.post("/rides/book", bookingData);
    return response.data;
  },

  getBookingsByUser: async (userId) => {
    const response = await api.get(`/bookings/user/${encodeURIComponent(userId)}`);
    return response.data;
  },
};

export default api;
