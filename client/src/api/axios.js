import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Pre-configured Axios instance.
 *
 * - baseURL from env so it works in dev (proxied) and prod.
 * - withCredentials sends the session cookie with every request.
 * - Response interceptor catches 401s globally and shows a toast.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      // Don't toast on auth check calls — those are expected to fail.
      if (!error.config.url.includes('/auth/status')) {
        toast.error('Session expired. Please log in again.');
      }
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  },
);

export default api;
