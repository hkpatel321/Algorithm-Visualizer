import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {BaseUrl} from '../utils/BaseUrl.js';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/check-auth`, { withCredentials: true });
        if (response.data.status && response.data.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    if (!userData || !userData.id || !userData.name) {
      return;
    }
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.get(`${BaseUrl}/logout`, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
