import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  // baseURL: 'http://localhost:5000/api',
});

export default api;
