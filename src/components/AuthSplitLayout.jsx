import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthSplitLayout.css';

const AuthSplitLayout = ({ onPageChange, defaultIsLogin = false }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  
  // States: 'default', 'forgot_password_init'
  const [authStep, setAuthStep] = useState('default'); 
  const [showPassword, setShowPassword] = useState(false);
  
  // Unified Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLogin(defaultIsLogin);

    const handleReset = () => {
      setAuthStep('default');
      setIsLogin(true);
      setApiError('');
      setApiSuccess('');
      setErrors({});
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    };
    
    window.addEventListener('reset-auth-step', handleReset);
    return () => window.removeEventListener('reset-auth-step', handleReset);
  }, [defaultIsLogin]);

  // -- Helpers --
  const clearMessages = () => {
    setApiError('');
    setApiSuccess('');
    setErrors({});
  };

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
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -- Standard Submit (Email + Password) --
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (validateForm()) {
      setIsLoading(true);
      try {
        if (isLogin) {
          const { error } = await signInWithEmail(email, password);
          if (error) throw error;
          onPageChange('home');
        } else {
          const { data, error } = await signUpWithEmail(email, password);
          if (error) throw error;
          if (data?.session) {
            onPageChange('home');
          } else {
            setApiSuccess('Registration successful! Please check your email for a verification link.');
          }
        }
      } catch (err) {
        setApiError(err.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // -- Google Sign In --
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    clearMessages();
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setApiError(err.message || 'Google authentication failed.');
      setIsLoading(false);
    }
  };

  // -- Forgot Password Flow --
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) return setErrors({ email: 'Enter your Email to initiate reset.' });
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setApiSuccess('A password reset link has been dispatched to your email!');
    } catch (err) {
      setApiError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  // -- View Renders --
  const renderInteractiveError = () => {
    if (!apiError) return null;
    return (
      <div className="fade-in-up" style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(255, 60, 60, 0.15), rgba(200, 40, 40, 0.05))', border: '1px solid rgba(255, 60, 60, 0.3)', borderRadius: '12px', color: '#ffc5c5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(255, 60, 60, 0.1)' }}>
        <div style={{ background: 'rgba(255,0,0,0.2)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.4', textAlign: 'left', flex: 1 }}>
          <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Attention:</span>
          {apiError}
        </div>
      </div>
    );
  };

  const renderSuccess = () => {
    if (!apiSuccess) return null;
    return (
      <div className="fade-in-up" style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(60, 255, 120, 0.15), rgba(40, 200, 80, 0.05))', border: '1px solid rgba(60, 255, 120, 0.3)', borderRadius: '12px', color: '#c5ffc5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(0,255,0,0.2)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.4', textAlign: 'left', flex: 1 }}>
          <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Success!</span>
          {apiSuccess}
        </div>
      </div>
    );
  };

  const EyeToggle = ({ visible, setVisible }) => (
    <button type="button" onClick={() => setVisible(!visible)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 5px' }}>
      {visible ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      )}
    </button>
  );

  const getFormJSX = () => {
    switch (authStep) {
      case 'forgot_password_init':
        return (
          <form className="auth-form fade-in-up delay-1" onSubmit={handleForgotRequest}>
            <button type="button" onClick={() => { setAuthStep('default'); clearMessages(); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textAlign: 'left', marginBottom: '1.5rem', padding: 0 }}>← Back to Login</button>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Reset Password</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Enter your registered Email to receive a secure reset link.</p>
            {renderInteractiveError()}
            {renderSuccess()}
            <div className="input-group">
              <label className="input-label">Email Address:</label>
              <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} placeholder="Enter your email" value={email} onChange={e => {setEmail(e.target.value); setErrors({...errors, email: null});}} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={isLoading}>Send Reset Link</button>
          </form>
        );

      case 'default':
      default:
        return (
          <form className="auth-form fade-in-up" onSubmit={handleSubmit}>
            
            {/* Pill Button Toggle for Sign In vs Register */}
            <div className="auth-toggle-group">
              <button type="button" className={`auth-toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); clearMessages(); }}>Sign In</button>
              <button type="button" className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); clearMessages(); }}>Register</button>
            </div>

            {renderInteractiveError()}
            {renderSuccess()}

            <div className="input-group fade-in-up delay-2">
              <label className="input-label">Email Address:</label>
              <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} placeholder="Enter your email" value={email} onChange={e => {setEmail(e.target.value); setErrors({...errors, email: null});}} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group fade-in-up delay-3" style={{ marginTop: '1rem' }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Password:</span>
                {isLogin && <a href="#forgot" onClick={(e) => { e.preventDefault(); setAuthStep('forgot_password_init'); }} style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot password?</a>}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className={`form-control ${errors.password ? 'error' : ''}`} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e => {setPassword(e.target.value); setErrors({...errors, password: null});}} 
                  style={{ width: '100%', paddingRight: '2.5rem' }} 
                />
                <EyeToggle visible={showPassword} setVisible={setShowPassword} />
              </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="input-group fade-in-up delay-3" style={{ marginTop: '1rem' }}>
                <label className="input-label">Confirm Password:</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`} 
                    placeholder="Confirm your password" 
                    value={confirmPassword} 
                    onChange={e => {setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: null});}} 
                    style={{ width: '100%', paddingRight: '2.5rem' }} 
                  />
                  <EyeToggle visible={showPassword} setVisible={setShowPassword} />
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}

            <div className="auth-actions fade-in-up delay-4" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                className="btn btn-outline" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px', 
                  width: '100%', 
                  maxWidth: '320px',
                  borderRadius: '50px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}
                disabled={isLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '1000px', margin: '4rem auto', minHeight: '600px', position: 'relative' }}>
      
      {isLoading && (
        <div className="overlay-loader fade-in" style={{ background: 'rgba(10, 10, 20, 0.3)', backdropFilter: 'blur(3px)' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px', marginBottom: '0.5rem' }}></div>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Loading...</p>
        </div>
      )}

      <div className="split-layout">
        {/* Left Column: Integrated Multi Form */}
        <div className="auth-panel">
          {getFormJSX()}
        </div>

        {/* Right Column: Introduction */}
        <div className="intro-panel glass-panel fade-in-up delay-2">
          <div className="intro-content">
            <div className="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-gradient">CareerKinetic Intro</h1>
            <p>
              Welcome to CareerKinetic—your gateway to personalized learning! Discover interactive skill assessments, connect with expert mentors, and follow dynamic roadmaps tailored specifically to your tech career goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
