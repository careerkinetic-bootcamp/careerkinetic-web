import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/auth`;

// Create Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // public.users profile from FastAPI
  const [session, setSession] = useState(null);  // Supabase session
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Sync Supabase user → public.users profile table via FastAPI
  const syncProfile = async (accessToken) => {
    try {
      const resp = await axios.post(`${API_URL}/sync`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(resp.data);
    } catch (e) {
      console.error('Profile sync failed:', e);
    }
  };

  useEffect(() => {
    // 1. Get initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        syncProfile(session.access_token);
      }
      setIsAuthReady(true);
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          await syncProfile(session.access_token);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth methods — all delegate to Supabase
  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUpWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password });

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Refresh profile from FastAPI (not Supabase)
  const refreshUser = async () => {
    if (!session) return;
    try {
      const resp = await axios.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setUser(resp.data);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const value = {
    user,
    session,
    token: session?.access_token || null,
    isLoggedIn: !!user,
    isAdmin: user?.email === 'careerkinetic27@gmail.com',
    isAuthReady,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
