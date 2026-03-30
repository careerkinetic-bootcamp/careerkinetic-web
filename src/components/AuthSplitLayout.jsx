import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './AuthSplitLayout.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://93a7h43145.execute-api.us-east-1.amazonaws.com';
const API_URL = `${BASE_URL}/api/auth`;

const AuthSplitLayout = ({ onPageChange, defaultIsLogin = false }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLogin(defaultIsLogin);
  }, [defaultIsLogin]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (validateForm()) {
      setIsLoading(true);
      try {
        // FastAPI Gateway strictly expects email and password
        const payload = { email, password };

        const endpoint = isLogin ? '/login' : '/register';

        // Execute request to your separate Backend FastAPI Lambda directory
        const response = await axios.post(`${API_URL}${endpoint}`, payload);

        if (response.data && response.data.access_token) {
          login(response.data.access_token); // Store valid JWT and decode
          onPageChange('home'); // Send authenticated user to Dashboard
        }
      } catch (err) {
        setApiError(err.response?.data?.detail || 'API Connection Failed: Ensure your FastAPI backend is running!');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setApiError('');
      // Send raw google token to FastAPI backend for verification and DB logging
      const response = await axios.post(`${API_URL}/google`, { token: credentialResponse.credential });

      if (response.data && response.data.access_token) {
        // If "requires_background" logic exists in the token, we would trigger a modal here
        login(response.data.access_token);
        onPageChange('home');
      }
    } catch (err) {
      setApiError('Google Backend verification failed. Ensure FastAPI is active.');
    }
  };

  return (
    <div className="split-layout fade-in-up delay-1">
      {/* Left Column: Form */}
      <div className="auth-panel glass-panel">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-muted">
            {isLogin ? 'Enter your credentials to securely access your account.' : 'Join PyJa App to start your learning journey.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Global API Error Alert */}
          {apiError && (
            <div style={{ padding: '0.8rem', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: '#ffb3b3', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {apiError}
            </div>
          )}

          {!isLogin && (
            <>
              {/* Note: Disabling Name & Background inputs directly conforming to your provided FastAPI schema */}
              {/* <div className="input-group fade-in-up delay-2">
                <label className="input-label">Name:</label>
                <input type="text" className="form-control" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
              </div> */}
            </>
          )}

          <div className="input-group fade-in-up delay-2">
            <label className="input-label">Email:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: errors.email ? 'var(--error)' : '' }}
            />
            {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.4rem', display: 'block' }}>{errors.email}</span>}
          </div>

          {!isLogin && (
            <>
              {/* <div className="input-group fade-in-up delay-2">
                <label className="input-label">Background:</label>
                <select className="form-control" value={background} onChange={e => setBackground(e.target.value)}>
                  <option value="" disabled>Select your background</option>
                  <option value="CS">CS</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Math">Math</option>
                  <option value="Non_CS">Non CS</option>
                </select>
              </div> */}
            </>
          )}

          <div className="input-group fade-in-up delay-3">
            <label className="input-label">Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: errors.password ? 'var(--error)' : '' }}
            />
            {errors.password && <span style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.4rem', display: 'block' }}>{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="input-group fade-in-up delay-3">
              <label className="input-label">Confirm Pass:</label>
              <input type="password" className="form-control" placeholder="Confirm your password" />
            </div>
          )}

          <div className="auth-actions fade-in-up delay-4" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Register')}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => { setIsLogin(!isLogin); setApiError(''); }}
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'var(--text-muted)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError('Google Login popup closed or failed.')}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </form>
      </div>

      {/* Right Column: Introduction */}
      <div className="intro-panel glass-panel fade-in-up delay-2">
        <div className="intro-content">
          <div className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-gradient">PyJa App Introduction</h1>
          <p>
            Welcome to PyJa App! A modern platform designed for interactive and adaptive learning.
            Securely log in or join us to discover personalized skill assessments, curated courses, and career roadmaps tailored precisely to your background.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
