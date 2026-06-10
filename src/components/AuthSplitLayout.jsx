import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle, GraduationCap, Github } from 'lucide-react';
import './AuthSplitLayout.css';

const AuthSplitLayout = () => {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // -- Google Sign In --
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setApiError(err.message || 'Google authentication failed.');
      setIsLoading(false);
    }
  };

  // -- GitHub Sign In --
  const handleGithubLogin = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      await signInWithGitHub();
    } catch (err) {
      setApiError(err.message || 'GitHub authentication failed.');
      setIsLoading(false);
    }
  };

  const renderInteractiveError = () => {
    if (!apiError) return null;
    return (
      <div className="fade-in-up" style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(255, 60, 60, 0.15), rgba(200, 40, 40, 0.05))', border: '1px solid rgba(255, 60, 60, 0.3)', borderRadius: '12px', color: '#ffc5c5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(255, 60, 60, 0.1)' }}>
        <div style={{ background: 'rgba(255,0,0,0.2)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.4', textAlign: 'left', flex: 1 }}>
          <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Attention:</span>
          {apiError}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '1000px', margin: '4rem auto', minHeight: '600px', position: 'relative' }}>
      
      {isLoading && (
        <div className="overlay-loader fade-in" style={{ background: 'rgba(10, 10, 20, 0.3)', backdropFilter: 'blur(3px)' }}>
          <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px', marginBottom: '0.5rem' }}></div>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Redirecting to secure authorization portal...</p>
        </div>
      )}

      <div className="split-layout">
        {/* Left Column: OAuth Buttons */}
        <div className="auth-panel" style={{ justifyContent: 'center' }}>
          <div className="auth-header">
            <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: '800' }}>Get Started</h2>
            <p className="text-muted" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
              Sign in securely to synchronize your progress, access your personalized roadmap, and coordinate with career mentors.
            </p>
          </div>

          {renderInteractiveError()}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', alignItems: 'center', marginTop: '1rem' }}>
            
            {/* Google OAuth Button */}
            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="btn btn-outline" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px', 
                width: '100%', 
                maxWidth: '360px',
                borderRadius: '50px',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              disabled={isLoading}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* GitHub OAuth Button */}
            <button 
              type="button" 
              onClick={handleGithubLogin} 
              className="btn btn-outline" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px', 
                width: '100%', 
                maxWidth: '360px',
                borderRadius: '50px',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              disabled={isLoading}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Github size={20} style={{ flexShrink: 0 }} />
              Continue with GitHub
            </button>

          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>

        {/* Right Column: Introduction */}
        <div className="intro-panel glass-panel fade-in-up delay-2">
          <div className="intro-content">
            <div className="icon-wrapper">
              <GraduationCap size={36} style={{ color: 'var(--primary)' }} />
            </div>
            <h1 className="text-gradient" style={{ fontWeight: '800' }}>CareerKinetic</h1>
            <p>
              Welcome to CareerKinetic—your gateway to personalized technology learning! Discover interactive skill assessments, connect with industry experts, and follow dynamic roadmaps tailored specifically to your tech career goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
