import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Enable withCredentials globally for cookie exchange
axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/auth`;

// Create Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

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

  // 3. Logout trigger
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
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
      setUser(null);
    }
  };

  // 5. Auth validation and code exchange on mount
  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state'); // google or github

      if (code && state) {
        // Clean URL search parameters instantly
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        try {
          const resp = await axios.post(`${API_URL}/callback`, { code, provider: state });
          setUser(resp.data);
        } catch (e) {
          console.error('OAuth callback exchange failed:', e);
        } finally {
          setIsAuthReady(true);
        }
      } else {
        // No OAuth query parameters: check for existing HttpOnly cookie session
        try {
          const resp = await axios.get(`${API_URL}/`);
          setUser(resp.data);
        } catch (e) {
          // 401 response expected if not logged in
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
    token: null,   // Deprecated, cookie-based session
    isLoggedIn: !!user,
    isAdmin: user?.email === 'careerkinetic27@gmail.com',
    isAuthReady,
    signInWithEmail: () => Promise.resolve({ error: { message: "Email/password registration is deprecated." } }),
    signUpWithEmail: () => Promise.resolve({ error: { message: "Email/password registration is deprecated." } }),
    signInWithGoogle,
    signInWithGitHub,
    resetPassword: () => Promise.resolve({ error: { message: "Password reset is deprecated." } }),
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
