import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const overlayAPI = {
    getAll: () => api.get('/overlays'),
    getOne: (id) => api.get(`/overlays/${id}`),
    create: (data) => api.post('/overlays', data),
    update: (id, data) => api.put(`/overlays/${id}`, data),
    delete: (id) => api.delete(`/overlays/${id}`)
};

export const streamAPI = {
    start: (rtspUrl) => api.post('/stream/start', { rtspUrl }),
    stop: () => api.post('/stream/stop'),
    getStatus: () => api.get('/stream/status')
};

export default api;
