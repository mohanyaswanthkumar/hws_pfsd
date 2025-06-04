import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      setUser({ token, role: userRole });
    }
    
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await loginService(email, password);
      
      localStorage.setItem('token', response.access);
      localStorage.setItem('userRole', response.role);
      
      setUser({ token: response.access, role: response.role });
      
      // Redirect based on role
      if (response.role === 'patient') {
        navigate('/patient-portal');
      } else if (response.role === 'doctor') {
        navigate('/doctor-portal');
      } else if (response.role === 'admin') {
        navigate('/admin-portal');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    navigate('/login');
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};