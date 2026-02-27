import axios from 'axios';

// In production (Render), frontend is served by the same server as the API
// In development, we need to specify the backend port
const isDev = window.location.port === '5173';
const API_BASE = isDev ? `http://${window.location.hostname}:5000/api` : '/api';

const api = axios.create({
    baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
