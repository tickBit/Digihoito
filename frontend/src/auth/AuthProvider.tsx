// AuthProvider.tsx

import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getTokenRemainingTime } from './auth.utils';
import type { AuthContextType } from './auth.types.ts';

const STORAGE_KEYS = {
  token: 'auth_token',
  email: 'auth_email',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.token);
    if (!stored) return null;
    return getTokenRemainingTime(stored) > 0 ? stored : null;
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (!token) return null;
    return localStorage.getItem(STORAGE_KEYS.email);
  });

  const isLoggedIn = !!token;

  useEffect(() => {
    if (!token) return;

    const remaining = getTokenRemainingTime(token);

    const timer = window.setTimeout(() => {
      setToken(null);
      setUserEmail(null);
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.email);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [token]);

  const login = (email: string, newToken: string) => {
    if (getTokenRemainingTime(newToken) <= 0) return;

    setToken(newToken);
    setUserEmail(email);

    localStorage.setItem(STORAGE_KEYS.token, newToken);
    localStorage.setItem(STORAGE_KEYS.email, email);
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.email);
  };

  const value: AuthContextType = {
    isLoggedIn,
    token,
    userEmail,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};