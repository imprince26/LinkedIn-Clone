import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,  // Ensure this is set to true
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});