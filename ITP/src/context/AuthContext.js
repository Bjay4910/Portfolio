import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check local storage for existing user session on load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      // Simulate API call for authentication
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true, data: { id: 1, email, name: email.split('@')[0] }}), 1000)
      );
      
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };
  
  // Signup function
  const signup = async (name, email, password) => {
    try {
      // Simulate API call for registration
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true, data: { id: 1, email, name }}), 1000)
      );
      
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};