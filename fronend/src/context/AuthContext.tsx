'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types/user';
import { getCsrfToken, fetchCsrfToken } from '@/lib/csrf';
import { API_URL } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Validate that the user object has required properties
        if (parsedUser && parsedUser.id && parsedUser.name && parsedUser.email) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Ensure we have a CSRF token
      await fetchCsrfToken();
      const csrfToken = getCsrfToken();
      
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const newUser: User = {
          id: data.user.id.toString(),
          name: data.user.username,
          email: data.user.email,
        };
        
        setUser(newUser);
        try {
          localStorage.setItem('user', JSON.stringify(newUser));
        } catch (error) {
          console.error('Failed to save user to localStorage:', error);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      try {
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Failed to remove user from localStorage:', error);
      }
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/check/`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          const authenticatedUser: User = {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
          };
          setUser(authenticatedUser);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        checkAuth,
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
