import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Sun, Moon, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

const Navbar = ({ currentPage = 'home', onPageChange = () => { }, isLoggedIn = false, isAdmin = false, onLogout = () => { } }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <>
      <nav className="navbar fade-in-up">
        {/* Logo with Gradient Square & Sparkles icon */}
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); onPageChange('home'); }}>
          <div style={{
            background: 'var(--gradient-primary)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
          <Sparkles size={16} style={{ color: '#fff' }} />
        </div>
        <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>CareerKinetic</span>
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
            Career Hub <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
          </a>
          <div className="nav-submenu">
            <a href="#"
              className={`nav-submenu-item ${currentPage === 'courses' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onPageChange('courses'); }}>Courses</a>
            <a href="#"
              className={`nav-submenu-item ${currentPage === 'roadmaps' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onPageChange('roadmaps'); }}>Roadmaps</a>

            {isLoggedIn && (
              <>
                <a href="#"
                  className={`nav-submenu-item ${currentPage === 'mentorship' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onPageChange('mentorship'); }}>Mentorship</a>
                <a href="#"
                  className={`nav-submenu-item ${currentPage === 'opportunities' ? 'active' : ''}`}
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
      </ul>

      {/* Header Action Elements: User Actions & Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 102 }}>
        {/* Desktop Sign in button or User Profile avatar */}
        <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center' }}>
          {!isLoggedIn ? (
            <a 
              href="#login" 
              className="btn btn-primary" 
              style={{ 
                borderRadius: '9999px', 
                textDecoration: 'none', 
                fontSize: '0.9rem', 
                fontWeight: 600,
                padding: '0.65rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-soft)',
                transition: 'var(--transition)'
              }} 
              onClick={(e) => { 
                e.preventDefault(); 
                if (currentPage === 'login') window.dispatchEvent(new Event('reset-auth-step')); 
                onPageChange('login'); 
              }}
            >
              Sign in
            </a>
          ) : (
            <div className="nav-profile-wrapper" ref={dropdownRef}>
              <img
                src={profileImageUrl}
                alt="Profile"
                className="nav-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-item" onClick={() => { setShowDropdown(false); onPageChange('profile'); }}>
                    <User size={15} style={{ marginRight: '4px' }} />
                    Profile Settings
                  </div>
                  <div className="nav-dropdown-item logout" onClick={() => { setShowDropdown(false); onLogout(); onPageChange('home'); }}>
                    <LogOut size={15} style={{ marginRight: '4px' }} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className={`hamburger-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ color: 'var(--foreground)' }}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>

      {/* Mobile Drawer Menu & Overlay */ }
  {
    isMobileMenuOpen && (
      <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
    )
  }

  <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
    <ul className="mobile-menu-links">
      <li>
        <a
          href="#"
          className={`mobile-menu-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('home'); setIsMobileMenuOpen(false); }}
        >
          Home
        </a>
      </li>
      <li>
        <span className="mobile-menu-link" style={{ color: 'var(--muted-foreground)', borderBottom: 'none', paddingBottom: 0 }}>Career Hub</span>
        <ul className="mobile-submenu-links">
          <li>
            <a
              href="#"
              className={`mobile-submenu-link ${currentPage === 'courses' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onPageChange('courses'); setIsMobileMenuOpen(false); }}
            >
              Courses
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`mobile-submenu-link ${currentPage === 'roadmaps' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onPageChange('roadmaps'); setIsMobileMenuOpen(false); }}
            >
              Roadmaps
            </a>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <a
                  href="#"
                  className={`mobile-submenu-link ${currentPage === 'mentorship' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onPageChange('mentorship'); setIsMobileMenuOpen(false); }}
                >
                  Mentorship
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`mobile-submenu-link ${currentPage === 'opportunities' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onPageChange('opportunities'); setIsMobileMenuOpen(false); }}
                >
                  Opportunities
                </a>
              </li>
            </>
          )}
        </ul>
      </li>
      <li>
        <a
          href="#"
          className={`mobile-menu-link ${currentPage === 'test' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('test'); setIsMobileMenuOpen(false); }}
        >
          Take a test
        </a>
      </li>
      {isAdmin ? (
        <li>
          <a
            href="#admin"
            className={`mobile-menu-link ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onPageChange('admin'); setIsMobileMenuOpen(false); }}
            style={{ color: 'var(--primary)', fontWeight: '600' }}
          >
            Admin Panel
          </a>
        </li>
      ) : (
        <li>
          <a
            href="#about"
            className={`mobile-menu-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onPageChange('about'); setIsMobileMenuOpen(false); }}
          >
            About us
          </a>
        </li>
      )}
      <li>
        <a
          href="#"
          className={`mobile-menu-link ${currentPage === 'faqs' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPageChange('faqs'); setIsMobileMenuOpen(false); }}
        >
          FAQs
        </a>
      </li>
      {!isLoggedIn ? (
        <li>
          <a
            href="#login"
            className="btn btn-primary"
            style={{ display: 'block', textDecoration: 'none', color: '#fff', textAlign: 'center', marginTop: '1rem' }}
            onClick={(e) => { e.preventDefault(); if (currentPage === 'login') window.dispatchEvent(new Event('reset-auth-step')); onPageChange('login'); setIsMobileMenuOpen(false); }}
          >
            Sign in
          </a>
        </li>
      ) : (
        <>
          <li>
            <a
              href="#"
              className={`mobile-menu-link ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onPageChange('profile'); setIsMobileMenuOpen(false); }}
            >
              Profile Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className="mobile-menu-link"
              style={{ color: 'var(--error)' }}
              onClick={(e) => { e.preventDefault(); onLogout(); onPageChange('home'); setIsMobileMenuOpen(false); }}
            >
              Logout
            </a>
          </li>
        </>
      )}
    </ul>
  </div>
    </>
  );
};

export default Navbar;
