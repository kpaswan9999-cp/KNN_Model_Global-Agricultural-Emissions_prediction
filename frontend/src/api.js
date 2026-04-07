import axios from 'axios';

// Ensure the Render backend URL matches the deployed domain, falling back to localhost for dev.
// Example: https://knn-agriculture.onrender.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://knn-model-global-agricultural-emissions.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMetadata = async () => {
  const response = await api.get('/metadata');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const predictEmissions = async (features) => {
  const response = await api.post('/predict', features);
  return response.data;
};

export const getForecast = async (params) => {
  const response = await api.get('/forecast', { params });
  return response.data;
};

export default api;
