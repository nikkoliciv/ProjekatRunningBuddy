import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      console.log('Token on load:', token); 

      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/auth/verify', {
            headers: {
              'authorization': token,
            },
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
            console.log('isauth in AuthContext', true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/auth/login', { email, password });
      const { token } = response.data;
      sessionStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/dashboard'); // ide na dashboard
      return { success: true }; 
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Wrong email or password' }; // ako je greska
    }
  };

  // Logout function
  const logout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login'); // ide na login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
