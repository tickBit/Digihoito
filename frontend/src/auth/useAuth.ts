import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './auth.types.ts';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};