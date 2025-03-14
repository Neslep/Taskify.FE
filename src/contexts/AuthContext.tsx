import React, { useMemo, useState, useEffect, useCallback, createContext } from 'react';

import { API_BASE_URL } from '../../config';

export type UserType = {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: number;
  status: number;
  plans: number;
  avatarPath: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserType | null;
  login: (newToken: string) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  login: async () => {},
  logout: () => {},
  validateToken: async () => {},
  fetchUserProfile: async () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwttoken'));

  // login: lưu token vào localStorage và state (sẽ trigger validateToken qua useEffect)
  const login = useCallback(async (newToken: string) => {
    localStorage.setItem('jwttoken', newToken);
    setToken(newToken);
  }, []);

  // logout: xóa token và reset trạng thái auth
  const logout = useCallback(() => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('tasks');
    sessionStorage.removeItem('email');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}api/users/profile`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const result = await response.json();
      if (result.isSuccess) {
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  }, [token]);

  const validateToken = useCallback(async () => {
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}api/users/validateToken`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Invalid or expired token');
      }
      setIsAuthenticated(true);
      await fetchUserProfile();
    } catch (error) {
      console.error('Error validating token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, fetchUserProfile, logout]);

  useEffect(() => {
    validateToken();
  }, [token, validateToken]);

  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      loading,
      user,
      login,
      logout,
      validateToken,
      fetchUserProfile,
    }),
    [isAuthenticated, loading, user, login, logout, validateToken, fetchUserProfile]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
