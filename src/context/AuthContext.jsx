import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://93a7h43145.execute-api.us-east-1.amazonaws.com';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/auth`;

// Create Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // If we mount with a token from storage, decode it instantly to check expiration
      if (token && !user) {
        try {
          const decoded = jwtDecode(token);

          if (decoded.exp < (Date.now() / 1000)) {
            logout();
          } else {
            // Token is still valid! Explicitly fetch the User JSON object from AWS 
            const resp = await axios.get(`${API_URL}/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(resp.data); // This locks in the id, email, role, and profile_data
          }
        } catch (e) {
          logout();
        }
      }
      setIsAuthReady(true);
    };

    initializeAuth();
  }, [token]);

  // Login handler
  const login = async (jwtToken) => {
    localStorage.setItem('token', jwtToken);

    try {
      // Explicitly hit your GET /api/auth/ endpoint using the newly acquired token string
      const resp = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });

      setToken(jwtToken);
      setUser(resp.data); // Stores { id, email, role, profile_data } globally
    } catch (e) {
      logout();
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,              // The pure decoded JWT payload (e.g. email, role, background)
    isLoggedIn: !!user,// Boolean flag simply determining if valid session exists
    isAdmin: user?.email === 'pyjaapp@gmail.com', // Explicit hardcoded admin
    token,             // The raw JWT string used for Axios authorization headers
    login,
    logout,
    isAuthReady        // Ensure we don't flash login/logout content before loading local token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
