import React, { useState, useEffect } from 'react';
import './AuthSplitLayout.css';

const AuthSplitLayout = ({ onPageChange, defaultIsLogin = false }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert(`${isLogin ? 'Login' : 'Registration'} successful for ${email}!`);
      // Future: backend post request logic
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
          {!isLogin && (
            <div className="input-group fade-in-up delay-2">
              <label className="input-label">Name:</label>
              <input type="text" className="form-control" placeholder="Enter your full name" />
            </div>
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
            <div className="input-group fade-in-up delay-2">
              <label className="input-label">Background:</label>
              <select className="form-control">
                <option value="" disabled selected>Select your background</option>
                <option value="CS">CS</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Math">Math</option>
                <option value="Non_CS">Non CS</option>
              </select>
            </div>
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
            <button type="submit" className="btn btn-primary">
              {isLogin ? 'Sign in' : 'Register'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => {
                 if (isLogin) {
                   if (onPageChange) onPageChange('home'); // Redirect to Home (Register Form)
                 } else {
                   if (onPageChange) onPageChange('login'); // Redirect to Login Tab
                 }
              }}
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Introduction */}
      <div className="intro-panel glass-panel fade-in-up delay-2">
        <div className="intro-content">
          <div className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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
