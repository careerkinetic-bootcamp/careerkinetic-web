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

const DEFAULT_DEMO_USER = {
  id: 'demo-engineer-2026',
  email: 'dev.user@careerkinetic.com',
  name: 'Alex Rivera (Demo)',
  full_name: 'Alex Rivera (Demo)',
  picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  profile_data: {
    fullName: 'Alex Rivera',
    email: 'dev.user@careerkinetic.com',
    phone: '+91 98765 43210',
    gender: 'Male',
    background: 'CS',
    address: 'Bangalore, Karnataka, India',
    githubUrl: 'https://github.com/alexrivera-dev',
    linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
    leetcodeUrl: 'https://leetcode.com/alexrivera',
    interests: ['Distributed Systems', 'Agentic MLOps', 'High-Concurrency Backends', 'Transformers'],
    hobbies: ['Open Source', 'Hackathons', 'Tech Writing'],
    achievements: ['Top 5% LeetCode Global', 'Built Distributed KV Store in Go', 'AI Hackathon Finalist'],
    isEmailVerified: true,
    enrolled_cohorts: ['aiml'],
    assessmentResult: {
      track: 'aiml',
      score: 88,
      total: 100,
      level: 'Advanced',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    assessmentAttempts: 1,
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  }
};

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

  // 2.5 Dev mock login trigger (Seamless with local fallback)
  const signInWithDev = async () => {
    try {
      const resp = await axios.post(`${API_URL}/dev-login`);
      if (resp.data?.access_token) {
        updateToken(resp.data.access_token);
      }
      const userData = resp.data.user || resp.data;
      setUser(userData);
      localStorage.setItem('careerkinetic_demo_session', 'true');
      localStorage.setItem('careerkinetic_demo_user', JSON.stringify(userData));
      return resp.data;
    } catch (e) {
      console.warn('Backend dev-login endpoint unreachable, activating instant local demo session:', e);
      // Instant seamless offline demo login:
      const mockToken = 'mock-demo-jwt-token-2026';
      updateToken(mockToken);
      const saved = localStorage.getItem('careerkinetic_demo_user');
      let demoUser = DEFAULT_DEMO_USER;
      if (saved) {
        try {
          demoUser = JSON.parse(saved);
        } catch {
          demoUser = DEFAULT_DEMO_USER;
        }
      }
      setUser(demoUser);
      localStorage.setItem('careerkinetic_demo_session', 'true');
      localStorage.setItem('careerkinetic_demo_user', JSON.stringify(demoUser));
      return { access_token: mockToken, user: demoUser };
    }
  };

  // 2.6 Local profile state update for demo session & cloud
  const updateUserProfile = (newProfileData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        profile_data: {
          ...(prev?.profile_data || {}),
          ...newProfileData
        }
      };
      if (localStorage.getItem('careerkinetic_demo_session') === 'true') {
        localStorage.setItem('careerkinetic_demo_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // 2.7 Reset Demo purchases trigger
  const resetDemoPurchases = async () => {
    try {
      if (localStorage.getItem('careerkinetic_demo_session') === 'true') {
        updateUserProfile({ enrolled_cohorts: [] });
        return true;
      }
      await axios.post(`${API_URL}/reset-demo`, {}, { withCredentials: true });
      await refreshUser();
      return true;
    } catch (e) {
      if (localStorage.getItem('careerkinetic_demo_session') === 'true') {
        updateUserProfile({ enrolled_cohorts: [] });
        return true;
      }
      console.error('Failed to reset demo purchases:', e);
      throw e;
    }
  };

  // 3. Logout trigger
  const logout = async () => {
    try {
      if (localStorage.getItem('careerkinetic_demo_session') !== 'true') {
        await axios.post(`${API_URL}/logout`);
      }
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      localStorage.removeItem('careerkinetic_demo_session');
      localStorage.removeItem('careerkinetic_demo_user');
      updateToken(null);
      setUser(null);
    }
  };

  // 4. Refresh / Retrieve profile trigger
  const refreshUser = async () => {
    if (localStorage.getItem('careerkinetic_demo_session') === 'true') {
      const saved = localStorage.getItem('careerkinetic_demo_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
          return;
        } catch {}
      }
      setUser(DEFAULT_DEMO_USER);
      return;
    }
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
      // Check for active local demo session first
      if (localStorage.getItem('careerkinetic_demo_session') === 'true') {
        const saved = localStorage.getItem('careerkinetic_demo_user');
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            setUser(DEFAULT_DEMO_USER);
          }
        } else {
          setUser(DEFAULT_DEMO_USER);
        }
        setIsAuthReady(true);
        return;
      }

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
    updateUserProfile,
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

