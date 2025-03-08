import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services';


export const UserContext = createContext();

// Create a UserProvider component
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored user data on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored user data', error);
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login({ username, password });
      
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };


  const getUserRole = () => {
    return currentUser?.role || 'guest';
  };

  // Give child components access to the user context
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getUserRole
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};