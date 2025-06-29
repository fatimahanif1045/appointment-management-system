// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axios';

/* ───────────────────── Setup ───────────────────── */
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for initial check

  /* ────────────── Helper: normalise errors ───────────── */
  const normaliseError = err => {
    console.error('Auth error →', err); // logging for dev console

    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.errors?.[0]?.msg ||
      err.message ||
      'Unexpected error';
    return new Error(msg);
  };

  /* ────────────── Auth actions ───────────── */
  const login = async (email, password) => {
    /* client‑side validation */
    if (!emailRegex.test(email)) throw new Error('Invalid email format');
    if (!password || password.length < 6)
      throw new Error('Password must be at least 6 characters');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      setUser({ role: data.role });
    } catch (err) {
      throw normaliseError(err);
    }
  };

  const signup = async body => {
    /* basic validation */
    if (!body?.name || body.name.length < 3)
      throw new Error('Name must be at least 3 characters');
    if (!emailRegex.test(body.email)) throw new Error('Invalid email format');
    if (!body.password || body.password.length < 6)
      throw new Error('Password must be at least 6 characters');

    try {
      await api.post('/auth/register', body);
    } catch (err) {
      throw normaliseError(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  /* ────────────── Auto‑login via refresh token ───────────── */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) return setLoading(false);

      try {
        // if access token absent/expired, try refresh → then /me
        if (!localStorage.getItem('access')) {
          const { data } = await api.post('/auth/refresh-token', { token: refresh });
          localStorage.setItem('access', data.access);
        }
        const { data: me } = await api.get('/auth/me');
        if (isMounted) setUser(me);
      } catch (err) {
        console.error('Silent auth init failed:', err);
        localStorage.clear();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ────────────── Context value ───────────── */
  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
