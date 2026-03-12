import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('mcube-token') || '');
  const [owner, setOwner] = useState(() => {
    const raw = localStorage.getItem('mcube-owner');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me', token)
      .then((data) => setOwner(data.owner))
      .catch(() => {
        setToken('');
        setOwner(null);
        localStorage.removeItem('mcube-token');
        localStorage.removeItem('mcube-owner');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setOwner(data.owner);
    localStorage.setItem('mcube-token', data.token);
    localStorage.setItem('mcube-owner', JSON.stringify(data.owner));
  };

  const logout = () => {
    setToken('');
    setOwner(null);
    localStorage.removeItem('mcube-token');
    localStorage.removeItem('mcube-owner');
  };

  const value = useMemo(() => ({ token, owner, loading, login, logout }), [token, owner, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
