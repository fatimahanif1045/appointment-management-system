// src/api/axios.js
import axios from 'axios';

/* ───────────────────── 0. Config & helpers ───────────────────── */

const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000/api';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.REACT_APP_API_URL) {
    console.warn(
      '%c[axios] Using fallback BASE_URL:',
      'color: orange',
      BASE_URL
    );
  }
}

const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true  // keep cookies for refresh token
});

/* ───────────────────── 1. Request interceptor ────────────────── */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  err => Promise.reject(err)
);

/* ───────────────────── 2. Response interceptor ───────────────── */

// Shared state so multiple 401s wait for the same refresh call
let refreshPromise = null;

api.interceptors.response.use(
  res => res,
  async error => {
    const { response, config: original } = error;

    /* 2‑A. If not 401, just bubble the error */
    if (response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      if (process.env.NODE_ENV === 'development')
        console.error('[axios] No refresh token – logging out');
      logout();
      return Promise.reject(error);
    }

    /* 2‑B. Start (or join) a refresh */
    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${BASE_URL}/auth/refresh-token`, { token: refreshToken })
        .then(({ data }) => {
          localStorage.setItem('access', data.access);
          if (process.env.NODE_ENV === 'development')
            console.info('[axios] Access token refreshed');
          return data.access;
        })
        .catch(err => {
          if (process.env.NODE_ENV === 'development')
            console.error('[axios] Refresh failed:', err);
          logout();
          throw err;
        })
        .finally(() => {
          refreshPromise = null; // reset for next time
        });
    }

    try {
      const newAccess = await refreshPromise;
      original._retry = true;
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default api;
