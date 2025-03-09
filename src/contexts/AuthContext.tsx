import type { ReactNode } from 'react';

import { useLocation } from 'react-router-dom';
import React, { useMemo, useState, useEffect, useCallback, createContext } from 'react';

import { API_BASE_URL } from '../../config';

// Định nghĩa kiểu cho user (bổ sung các trường nếu cần)
type UserType = {
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

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserType | null;
  setIsAuthenticated: (val: boolean) => void;
  validateToken: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  setIsAuthenticated: () => {},
  validateToken: async () => {},
  fetchUserProfile: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${API_BASE_URL}api/users/profile`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Lấy thông tin user không thành công');
      }
      const result = await response.json();
      if (result.isSuccess) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  }, []);

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
      // Nếu token hợp lệ, gọi API lấy thông tin người dùng
      await fetchUserProfile();
    } catch (error) {
      console.error('Error validating token:', error);
      localStorage.removeItem('jwttoken');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Lấy location để theo dõi sự thay đổi của route
  const location = useLocation();
  useEffect(() => {
    // Mỗi khi location thay đổi, gọi validateToken để cập nhật thông tin user
    validateToken();
  }, [location, validateToken]);

  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      loading,
      user,
      setIsAuthenticated,
      validateToken,
      fetchUserProfile,
    }),
    [isAuthenticated, loading, user, validateToken, fetchUserProfile]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
