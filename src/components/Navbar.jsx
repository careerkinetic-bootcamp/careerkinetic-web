import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage = 'home', onPageChange = () => {}, isLoggedIn = false, isAdmin = false, onLogout = () => {} }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profileImageUrl = user?.profile_data?.profilePic || user?.profile_data?.picture || user?.picture || `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=8a2be2&color=fff`;

  return (
    <nav className="navbar fade-in-up">
      <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); onPageChange('home'); }}>
        <span className="text-gradient">CareerKinetic</span>
      </a>
      
      <ul className="nav-links">
        <li>
          <a href="#" className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('home'); }}>
            Home
          </a>
        </li>
        <li style={{ position: 'relative' }} 
            onMouseEnter={(e) => { e.currentTarget.lastElementChild.style.display = 'block'; }}
            onMouseLeave={(e) => { e.currentTarget.lastElementChild.style.display = 'none'; }}>
          <a href="#" className={`nav-link ${['courses', 'roadmaps', 'mentorship', 'opportunities'].includes(currentPage) ? 'active' : ''}`} onClick={e => e.preventDefault()}>
            Career Hub &#9662;
          </a>
          <div style={{ display: 'none', position: 'absolute', top: '100%', left: '0', background: 'rgba(15, 20, 25, 0.95)', border: '1px solid var(--glass-border)', borderRadius: '12px', minWidth: '180px', paddingTop: '0.5rem', paddingBottom: '0.5rem', zIndex: 100, backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <a href="#" 
               style={{ display: 'block', padding: '0.8rem 1.2rem', color: currentPage === 'courses' ? 'var(--primary)' : 'var(--text-light)', textDecoration: 'none', fontSize: '0.95rem' }} 
               onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--primary)'; }}
               onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = currentPage === 'courses' ? 'var(--primary)' : 'var(--text-light)'; }}
               onClick={(e) => { e.preventDefault(); onPageChange('courses'); }}>Courses</a>
            <a href="#" 
               style={{ display: 'block', padding: '0.8rem 1.2rem', color: currentPage === 'roadmaps' ? 'var(--primary)' : 'var(--text-light)', textDecoration: 'none', fontSize: '0.95rem' }} 
               onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--primary)'; }}
               onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = currentPage === 'roadmaps' ? 'var(--primary)' : 'var(--text-light)'; }}
               onClick={(e) => { e.preventDefault(); onPageChange('roadmaps'); }}>Roadmaps</a>
            
            {isLoggedIn && (
              <>
                <a href="#" 
                   style={{ display: 'block', padding: '0.8rem 1.2rem', color: currentPage === 'mentorship' ? 'var(--primary)' : 'var(--text-light)', textDecoration: 'none', fontSize: '0.95rem' }} 
                   onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--primary)'; }}
                   onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = currentPage === 'mentorship' ? 'var(--primary)' : 'var(--text-light)'; }}
                   onClick={(e) => { e.preventDefault(); onPageChange('mentorship'); }}>Mentorship</a>
                <a href="#" 
                   style={{ display: 'block', padding: '0.8rem 1.2rem', color: currentPage === 'opportunities' ? 'var(--primary)' : 'var(--text-light)', textDecoration: 'none', fontSize: '0.95rem' }} 
                   onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'var(--primary)'; }}
                   onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = currentPage === 'opportunities' ? 'var(--primary)' : 'var(--text-light)'; }}
                   onClick={(e) => { e.preventDefault(); onPageChange('opportunities'); }}>Opportunities</a>
              </>
            )}
          </div>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'test' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('test'); }}>
            Take a test
          </a>
        </li>
        {isAdmin ? (
          <li>
            <a href="#admin" className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('admin'); }} style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Admin
            </a>
          </li>
        ) : (
          <li>
            <a href="#about" className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('about'); }}>
              About us
            </a>
          </li>
        )}
        <li>
          <a href="#" className={`nav-link ${currentPage === 'faqs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('faqs'); }}>
            FAQs
          </a>
        </li>
        {!isLoggedIn ? (
          <li><a href="#login" className="btn btn-primary" style={{ padding: '0.5rem 1.4rem', borderRadius: '30px', textDecoration: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 500 }} onClick={(e) => { e.preventDefault(); if (currentPage === 'login') window.dispatchEvent(new Event('reset-auth-step')); onPageChange('login'); }}>Sign in</a></li>
        ) : (
          <li className="nav-profile-wrapper" ref={dropdownRef}>
            <img 
              src={profileImageUrl} 
              alt="Profile" 
              className="nav-avatar" 
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-item" onClick={() => { setShowDropdown(false); onPageChange('profile'); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Profile Settings
                </div>
                <div className="nav-dropdown-item logout" onClick={() => { setShowDropdown(false); onLogout(); onPageChange('home'); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </div>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
