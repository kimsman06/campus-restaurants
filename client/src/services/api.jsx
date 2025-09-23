import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log('API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export const restaurantAPI = {
  getRestaurants: async (school, page = 1) => {
    try {
      const params = new URLSearchParams();
      if (school) params.append('school', school);
      if (page) params.append('page', page);

      const response = await api.get(`${API_BASE_URL}/api/restaurants?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Fallback data needs a compatible structure for infinite query
      return { data: [], nextPage: null, isEnd: true };
    }
  }
};

export default api;