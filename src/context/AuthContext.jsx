import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Enable withCredentials globally for cookie exchange
axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BASE_URL ? BASE_URL.replace(/\/$/, '') : ''}/api/auth`;

// Initialize Authorization header from existing token if present
const storedToken = localStorage.getItem('careerkinetic_token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

// Create Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('careerkinetic_token'));
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Sync token across state, axios headers, and localStorage
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('careerkinetic_token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
    } else {
      localStorage.removeItem('careerkinetic_token');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
    }
  };

  // 1. Google redirect trigger
  const signInWithGoogle = async () => {
    try {
      const resp = await axios.get(`${API_URL}/google/url`);
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      } else {
        throw new Error('Google authorization URL was not returned.');
      }
    } catch (e) {
      console.error('Failed to initiate Google sign in:', e);
      throw e;
    }
  };

  // 2. GitHub redirect trigger
  const signInWithGitHub = async () => {
    try {
      const resp = await axios.get(`${API_URL}/github/url`);
      if (resp.data?.url) {
        window.location.href = resp.data.url;
      } else {
        throw new Error('GitHub authorization URL was not returned.');
      }
    } catch (e) {
      console.error('Failed to initiate GitHub sign in:', e);
      throw e;
    }
  };

  // 2.5 Dev mock login trigger
  const signInWithDev = async () => {
    try {
      const resp = await axios.post(`${API_URL}/dev-login`);
      if (resp.data?.access_token) {
        updateToken(resp.data.access_token);
      }
      setUser(resp.data.user || resp.data);
      return resp.data;
    } catch (e) {
      console.error('Failed to execute Dev sign in:', e);
      throw e;
    }
  };

  // 2.6 Reset Demo purchases trigger
  const resetDemoPurchases = async () => {
    try {
      await axios.post(`${API_URL}/reset-demo`, {}, { withCredentials: true });
      await refreshUser();
      return true;
    } catch (e) {
      console.error('Failed to reset demo purchases:', e);
      throw e;
    }
  };

  // 3. Logout trigger
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      updateToken(null);
      setUser(null);
    }
  };

  // 4. Refresh / Retrieve profile trigger
  const refreshUser = async () => {
    try {
      const resp = await axios.get(`${API_URL}/`);
      setUser(resp.data);
    } catch (e) {
      console.error('Failed to refresh user profile:', e);
      updateToken(null);
      setUser(null);
    }
  };

  // 5. Auth validation and code exchange on mount
  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state'); // google or github
      const errorParam = params.get('error') || params.get('error_description');

      if (errorParam) {
        console.error('OAuth authorization error from provider:', errorParam);
        sessionStorage.setItem('careerkinetic_auth_error', errorParam);
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        setIsAuthReady(true);
        return;
      }

      if (code && state) {
        // Clean URL search parameters instantly
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        try {
          const resp = await axios.post(`${API_URL}/callback`, { code, provider: state });
          if (resp.data?.access_token) {
            updateToken(resp.data.access_token);
          }
          setUser(resp.data.user || resp.data);
        } catch (e) {
          console.error('OAuth callback exchange failed:', e);
          sessionStorage.setItem(
            'careerkinetic_auth_error',
            e.response?.data?.detail || e.message || 'OAuth exchange failed'
          );
        } finally {
          setIsAuthReady(true);
        }
      } else {
        // No OAuth query parameters: check for existing session via Bearer token or HttpOnly cookie
        try {
          const resp = await axios.get(`${API_URL}/`);
          setUser(resp.data);
        } catch (e) {
          // 401 response expected if not logged in
          updateToken(null);
          setUser(null);
        } finally {
          setIsAuthReady(true);
        }
      }
    };

    handleAuth();
  }, []);

  const value = {
    user,
    session: null, // Deprecated, left for compatibility
    token,         // Active JWT token for Bearer headers
    isLoggedIn: !!user,
    isAdmin: user?.email === 'careerkinetic27@gmail.com',
    isAuthReady,
    signInWithEmail: () => Promise.resolve({ error: { message: "Email/password registration is deprecated." } }),
    signUpWithEmail: () => Promise.resolve({ error: { message: "Email/password registration is deprecated." } }),
    signInWithGoogle,
    signInWithGitHub,
    signInWithDev,
    resetPassword: () => Promise.resolve({ error: { message: "Password reset is deprecated." } }),
    logout,
    refreshUser,
    resetDemoPurchases,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

