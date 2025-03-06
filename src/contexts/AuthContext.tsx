import type { ReactNode } from 'react';

import React, { useMemo, useState, useEffect, useCallback, createContext } from 'react';

import { API_BASE_URL } from '../../config';

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: (val: boolean) => void;
  validateToken: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  setIsAuthenticated: () => {},
  validateToken: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}api/users/validateToken`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token không hợp lệ hoặc hết hạn');
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error validating token:', error);
      localStorage.removeItem('jwttoken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Sử dụng useMemo để tránh object value thay đổi liên tục
  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      loading,
      setIsAuthenticated,
      validateToken,
    }),
    [isAuthenticated, loading, validateToken]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
