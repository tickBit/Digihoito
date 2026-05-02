// AuthProvider.tsx

import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { getTokenRemainingTime } from './auth.utils';
import type { AuthContextType } from './auth.types.ts';

const STORAGE_KEYS = {
  token: 'auth_token',
  email: 'auth_email',
  userRole: 'user_role',
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

  const [userRole, setUserRole] = useState<number | null>(() => {
    const value = localStorage.getItem(STORAGE_KEYS.userRole);
    if (value != null) return parseInt(value); else return 0;
  });
  
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!token) return;

    const remaining = getTokenRemainingTime(token);

    const timer = window.setTimeout(() => {
      setToken(null);
      setUserEmail(null);
      setUserRole(0);
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.email);
      localStorage.removeItem(STORAGE_KEYS.userRole);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [token]);

  const login = (email: string, newToken: string, role: number) => {
    if (getTokenRemainingTime(newToken) <= 0) return;

    setToken(newToken);
    setUserEmail(email);
    setUserRole(role);
    
    localStorage.setItem(STORAGE_KEYS.token, newToken);
    localStorage.setItem(STORAGE_KEYS.email, email);
    localStorage.setItem(STORAGE_KEYS.userRole, role.toString());
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setUserRole(0);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.email);
    localStorage.removeItem(STORAGE_KEYS.userRole);
  };

  const value: AuthContextType = {
    userRole,
    isLoggedIn,
    token,
    userEmail,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};