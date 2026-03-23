import React from 'react';
import './CoursesPage.css'; // Reusing standard utility classes

const OpportunitiesPage = () => {
  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Header & Controls mapping to Sketch 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0, textDecoration: 'underline' }}>Jobs / Internships :-</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, maxWidth: '400px' }}>
          <div className="search-bar" style={{ width: '100%', minWidth: 'unset', display: 'flex' }}>
            <input type="text" className="form-control" placeholder="🔍 Search opportunities..." style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
            <button className="btn btn-primary search-btn" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 1.5rem' }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="11" cy="11" r="8"></circle>
                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
               </svg>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingRight: '0.5rem' }}>
            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500', fontSize: '1.1rem' }}>sort , </span>
            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500', fontSize: '1.1rem' }}>filter</span>
          </div>
        </div>
      </div>

      {/* Posts List mapping horizontally stacked block items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel course-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>Post {i} - Senior Software Engineer</h2>
                <p className="text-muted" style={{ margin: 0, fontSize: '1rem' }}>TechCorp Industries • Remote • Full-Time</p>
              </div>
              <span style={{ background: 'rgba(138,43,226,0.15)', color: '#a855f7', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {i % 2 === 0 ? 'Internship' : 'Job'}
              </span>
            </div>
            
            <p style={{ color: '#ddd', lineHeight: '1.6', margin: '0.5rem 0', fontSize: '1.05rem' }}>
              We are actively looking for highly talented developers to join our core product team. 
              You will be directly responsible for building out massive scalable infrastructure and leading decisions.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Posted {i} days ago</span>
              <button className="btn btn-outline" style={{ padding: '0.6rem 2rem' }}>Apply Now</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OpportunitiesPage;
