// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import type { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const currentUser = await apiClient.getCurrentUser();
        setUser({
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.phone,
          role: currentUser.role,
          createdAt: '',
          updatedAt: '',
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginDto) => {
    try {
      const response: AuthResponse = await apiClient.login(data);
      setUser({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        role: response.role,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response: AuthResponse = await apiClient.register(data);
      setUser({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        role: response.role,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}