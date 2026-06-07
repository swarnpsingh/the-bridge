import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Attach token to every protected request automatically
const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memberToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);

// ── Members ──────────────────────────────────────────────────
export const getMembers    = (params) => api.get('/members', { params });
export const getMember     = (id)     => api.get(`/members/${id}`);
export const createMember  = (data)   => api.post('/members', data);
export const updateMember  = (id, data) => api.put(`/members/${id}`, data);

// ── Events ───────────────────────────────────────────────────
export const getEvents   = ()         => api.get('/events');
export const submitEvent = (data)     => api.post('/events', data);
export const rsvpEvent   = (id, data) => api.post(`/events/${id}/rsvp`, data);

// ── Services ─────────────────────────────────────────────────
export const getServices   = (params) => api.get('/services', { params });
export const createService = (data)   => api.post('/services', data);
export const deleteService = (id)     => api.delete(`/services/${id}`);

// ── Admin ────────────────────────────────────────────────────
const adminHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
});

export const adminLogin        = (data) => axios.post(`${BASE}/admin/login`, data);
export const adminGetMembers   = ()     => axios.get(`${BASE}/admin/members`, adminHeaders());
export const adminDeleteMember = (id)   => axios.delete(`${BASE}/admin/members/${id}`, adminHeaders());
export const adminGetEvents    = ()     => axios.get(`${BASE}/admin/events`, adminHeaders());
export const adminAddEvent     = (data) => axios.post(`${BASE}/admin/events`, data, adminHeaders());
export const adminApproveEvent = (id)   => axios.patch(`${BASE}/admin/events/${id}/approve`, {}, adminHeaders());
export const adminDeleteEvent  = (id)   => axios.delete(`${BASE}/admin/events/${id}`, adminHeaders());
export const adminGetServices  = ()     => axios.get(`${BASE}/admin/services`, adminHeaders());
export const adminDeleteService= (id)   => axios.delete(`${BASE}/admin/services/${id}`, adminHeaders());