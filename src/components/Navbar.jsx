import React from 'react';

const Navbar = ({ currentPage = 'home', onPageChange = () => {}, isLoggedIn = false, onLogout = () => {} }) => {
  return (
    <nav className="navbar fade-in-up">
      <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); onPageChange('home'); }}>
        <span className="text-gradient">PyJa App</span>
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
          </div>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'test' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('test'); }}>
            Take a test
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('about'); }}>
            About us
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'faqs' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('faqs'); }}>
            FAQs
          </a>
        </li>
        {!isLoggedIn ? (
          <li><a href="#login" className={`nav-link ${currentPage === 'login' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('login'); }}>Login/Register</a></li>
        ) : (
          <li style={{ marginLeft: '1rem' }}>
            <a href="#logout" className="nav-link" onClick={(e) => { e.preventDefault(); onLogout(); onPageChange('home'); }} style={{ color: 'var(--error)', border: '1px solid rgba(255,100,100,0.3)', padding: '0.4rem 1.2rem', borderRadius: '20px' }}>Logout</a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
