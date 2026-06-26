import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply dark mode theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Fetch profile when token exists to check validity
  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get('/auth/profile');
      if (res.data && res.data.success) {
        setUser(res.data.data);
        setIsAuthenticated(true);
      } else {
        // Clear auth data if fetch failed
        logout();
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Check login on startup
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: userToken, ...userData } = res.data.data;
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(res.data.data.token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      const requiresVerification = error.response?.data?.requiresVerification || false;
      const emailVal = error.response?.data?.email || '';
      const errMsg = error.response?.data?.error || 'Login failed. Please check credentials.';
      return { success: false, error: errMsg, requiresVerification, email: emailVal };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const res = await apiClient.post('/auth/signup', { name, email, password });
      if (res.data && res.data.success) {
        return { success: true, email: res.data.email, requiresVerification: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Signup failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  // Verify Email handler
  const verifyEmail = async (email, otp) => {
    try {
      const res = await apiClient.post('/auth/verify-email', { email, otp });
      if (res.data && res.data.success) {
        const { token: userToken, ...userData } = res.data.data;
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(res.data.data.token);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Verification failed. Please check the code.';
      return { success: false, error: errMsg };
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Update profile
  const updateProfile = async (name, email) => {
    try {
      const res = await apiClient.put('/auth/profile', { name, email });
      if (res.data && res.data.success) {
        const { token: newToken, ...userData } = res.data.data;
        
        // Update local storage
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(res.data.data.token);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to update profile details.';
      return { success: false, error: errMsg };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await apiClient.put('/auth/password', { currentPassword, newPassword });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to update password.';
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        theme,
        toggleTheme,
        login,
        signup,
        verifyEmail,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
