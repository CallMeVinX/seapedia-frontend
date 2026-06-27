import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

// Create an Axios instance
const api = axios.create({
  // Use relative URL to force request through Next.js rewrite proxy
  baseURL: '/api',
  withCredentials: true, // Crucial for sending cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a response interceptor to catch 401/403 errors and force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Force logout by calling the Zustand action
      const logout = useAuthStore.getState().logout;
      logout();
      
      // Optionally redirect to login page if we are on client side
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);
export default api;
