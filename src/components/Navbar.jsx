import React from 'react';

const Navbar = ({ currentPage = 'home', onPageChange = () => {} }) => {
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
        <li>
          <a href="#" className={`nav-link ${currentPage === 'courses' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('courses'); }}>
            Courses
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'roadmaps' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('roadmaps'); }}>
            Roadmaps
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'mentorship' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('mentorship'); }}>
            Mentorship
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'test' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('test'); }}>
            Take a test
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'opportunities' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('opportunities'); }}>
            Opportunities
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('about'); }}>
            About us
          </a>
        </li>
        <li>
          <a href="#" className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('contact'); }}>
            Contact us
          </a>
        </li>
        <li><a href="#login" className={`nav-link ${currentPage === 'login' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange('login'); }}>Login</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
