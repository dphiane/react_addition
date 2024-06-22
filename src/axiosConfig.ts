import axios from 'axios';
import { getCurrentUser } from './api';

axios.interceptors.request.use(
  (config) => {
    const token = getCurrentUser();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
