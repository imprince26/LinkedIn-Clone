import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add additional headers or token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);