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
  
  // States: 'default', 'google_setup', 'forgot_password_init', 'forgot_password_otp', 'forgot_password_reset', 'change_password'
  const [authStep, setAuthStep] = useState('default'); 
  const [showPassword, setShowPassword] = useState(false);
  const [tempGoogleToken, setTempGoogleToken] = useState('');
  
  // Unified Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLogin(defaultIsLogin);
  }, [defaultIsLogin]);

  // -- Helpers --
  const handleGlobalCatch = (err, defaultMsg) => {
    if (!err.response || err.response.status >= 500) {
      setApiError("It's not you, it's us. Our servers are experiencing difficulties right now.");
    } else {
      setApiError(err.response?.data?.detail || defaultMsg);
    }
  };

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

  // -- Standard Submit (Email/Phone + Password) --
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const payload = { email, password };
        const endpoint = isLogin ? '/login' : '/register';
        const response = await axios.post(`${API_URL}${endpoint}`, payload);
        if (response.data && response.data.access_token) {
          login(response.data.access_token);
          onPageChange('home');
        }
      } catch (err) {
        handleGlobalCatch(err, 'API Connection Failed: Ensure your credentials are correct.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // -- Google Handlers --
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    clearMessages();
    try {
      const response = await axios.post(`${API_URL}/google`, { token: credentialResponse.credential });
      if (response.data) {
        if (response.data.requires_password) {
           setTempGoogleToken(response.data.access_token);
           setAuthStep('google_setup'); 
        } else if (response.data.access_token) {
           login(response.data.access_token);
           onPageChange('home');
        }
      }
    } catch (err) {
      handleGlobalCatch(err, 'Google verification failed. Check your API route.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSetupSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (password.trim().length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(`${API_URL}/profile`, { password }, {
        headers: { Authorization: `Bearer ${tempGoogleToken}` }
      });
      if (response.data && response.data.access_token) {
        login(response.data.access_token);
        onPageChange('home');
      }
    } catch (err) {
      handleGlobalCatch(err, 'Failed to verify profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // -- Forgot Password Flow --
  const handleForgotRequestOTP = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email) return setErrors({ email: 'Enter your Email to receive OTP.' });
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      setAuthStep('forgot_password_otp');
      setApiSuccess('OTP has been dispatched securely to your email!');
    } catch (err) {
      handleGlobalCatch(err, 'Failed to send OTP. Is your account registered?');
    } finally { setIsLoading(false); }
  };

  const handleForgotVerifyOTP = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!otp || otp.length < 4) return setErrors({ otp: 'Enter the verification code.' });
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/verify-otp`, { email, otp });
      setAuthStep('forgot_password_reset');
      setApiSuccess('OTP Verified! Create a new master password now.');
    } catch (err) {
      handleGlobalCatch(err, 'Invalid OTP or expired. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (newPassword.length < 6 || newPassword !== confirmPassword) {
       return setErrors({ reset: 'Passwords must match and be at least 6 characters.' });
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/reset-password`, { email, newPassword });
      setAuthStep('default');
      setIsLogin(true);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setApiSuccess('Password updated successfully! Sign in with your new credentials.');
    } catch (err) {
      handleGlobalCatch(err, 'Failed to secure your new password.');
    } finally { setIsLoading(false); }
  };

  // -- Change Password Flow (From Login Page) --
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email || oldPassword.length < 6 || newPassword.length < 6 || newPassword !== confirmPassword) {
       return setErrors({ cp: 'Please fill all fields. New passwords must match.' });
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/change-password`, { email, oldPassword, newPassword });
      setAuthStep('default');
      setIsLogin(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setApiSuccess('Your password was successfully changed. You may log in.');
    } catch (err) {
      handleGlobalCatch(err, 'Failed to change password. Is your old password correct?');
    } finally { setIsLoading(false); }
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
      case 'google_setup':
        return (
          <form className="auth-form fade-in-up delay-1" onSubmit={handleGoogleSetupSubmit} style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Secure Your Account</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Please attach a master password to your Google configuration.</p>
            {renderInteractiveError()}
            <div className="input-group" style={{ textAlign: 'left' }}>
              <label className="input-label">Create a Password:</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} className={`form-control ${errors.password ? 'error' : ''}`} placeholder="Set your new password" value={password} onChange={e => { setPassword(e.target.value); setErrors({...errors, password: null}); }} style={{ width: '100%', paddingRight: '2.5rem' }} />
                <EyeToggle visible={showPassword} setVisible={setShowPassword} />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }} disabled={isLoading}>
              Complete Registration
            </button>
          </form>
        );

      case 'forgot_password_init':
        return (
          <form className="auth-form fade-in-up delay-1" onSubmit={handleForgotRequestOTP}>
            <button type="button" onClick={() => setAuthStep('default')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textAlign: 'left', marginBottom: '1.5rem', padding: 0 }}>← Back to Login</button>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Reset Password</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Enter your registered Email or Phone number to receive a secure OTP code.</p>
            {renderInteractiveError()}
            {renderSuccess()}
            <div className="input-group">
              <label className="input-label">Email Address:</label>
              <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} placeholder="Enter your email" value={email} onChange={e => {setEmail(e.target.value); setErrors({...errors, email: null});}} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={isLoading}>Send OTP</button>
          </form>
        );

      case 'forgot_password_otp':
        return (
          <form className="auth-form fade-in-up delay-1" onSubmit={handleForgotVerifyOTP}>
            <button type="button" onClick={() => setAuthStep('forgot_password_init')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textAlign: 'left', marginBottom: '1.5rem', padding: 0 }}>← Back</button>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Enter OTP</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>We sent a secure code to your contact.</p>
            {renderInteractiveError()}
            {renderSuccess()}
            <div className="input-group">
              <label className="input-label">Secure Code:</label>
              <input type="text" className={`form-control ${errors.otp ? 'error' : ''}`} placeholder="Enter 6-digit OTP" value={otp} onChange={e => {setOtp(e.target.value); setErrors({...errors, otp: null});}} style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }} />
              {errors.otp && <span className="error-text">{errors.otp}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={isLoading}>Verify Origin</button>
          </form>
        );

      case 'forgot_password_reset':
        return (
          <form className="auth-form fade-in-up delay-1" onSubmit={handleForgotResetPassword}>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Finalize Password</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>The origin was verified securely. Please issue a new master key.</p>
            {renderInteractiveError()}
            {renderSuccess()}
            {errors.reset && <span className="error-text" style={{ marginBottom: '1rem', display: 'block' }}>{errors.reset}</span>}

            <div className="input-group">
              <label className="input-label">New Password:</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Strong password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', paddingRight: '2.5rem' }} />
                <EyeToggle visible={showPassword} setVisible={setShowPassword} />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">Confirm New Password:</label>
              <input type="password" className="form-control" placeholder="Match new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} disabled={isLoading}>Lock In Password</button>
          </form>
        );

      case 'change_password':
        return (
          <form className="auth-form fade-in-up delay-1" onSubmit={handleChangePasswordSubmit}>
            <button type="button" onClick={() => setAuthStep('default')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textAlign: 'left', marginBottom: '1.5rem', padding: 0 }}>← Back to Login</button>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Modify Credentials</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Rotate your current valid key signature.</p>
            {renderInteractiveError()}
            {renderSuccess()}
            {errors.cp && <span className="error-text" style={{ marginBottom: '1rem', display: 'block' }}>{errors.cp}</span>}

            <div className="input-group">
              <label className="input-label">Email Address:</label>
              <input type="email" className="form-control" placeholder="Account email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Old Password:</span>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); setAuthStep('forgot_password_init'); }} style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot password?</a>
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Verify old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} style={{ width: '100%', paddingRight: '2.5rem' }} />
                <EyeToggle visible={showPassword} setVisible={setShowPassword} />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">New Password:</label>
              <input type="password" className="form-control" placeholder="Rotate password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">Confirm New Password:</label>
              <input type="password" className="form-control" placeholder="Match new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }} disabled={isLoading}>Issue Key Replacement</button>
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
            
            {isLogin && (
              <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                 <button type="button" onClick={() => setAuthStep('change_password')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>Change Password</button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => handleGlobalCatch({}, 'Google Login popup closed or failed.')} 
                theme="filled_black"
                shape="pill"
              />
            </div>
          </form>
        );
    }
  };

  return (
    <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '1000px', margin: '4rem auto', minHeight: '600px', position: 'relative' }}>
      
      {isLoading && (
        <div className="overlay-loader fade-in">
          <div className="spinner"></div>
          <p className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Synchronizing Nodes...</p>
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
            <h1 className="text-gradient">PyJaApp Intro</h1>
            <p>
              Welcome to PyJaApp—your gateway to personalized learning! Discover interactive skill assessments, connect with expert mentors, and follow dynamic roadmaps tailored specifically to your tech career goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
