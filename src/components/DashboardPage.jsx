import React from 'react';
import './CoursesPage.css';

const DashboardPage = () => {
  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Trending Posts Carousel */}
      <div className="glass-panel fade-in-up delay-2" style={{ padding: '3.5rem', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.1), rgba(138, 43, 226, 0.15))', border: '1px solid rgba(138, 43, 226, 0.3)' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Scroll posts (like trending things)</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Featured insight: How AI is transforming modern learning algorithms.</p>
        
        {/* Carousel Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '2.5rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--primary-glow)', boxShadow: '0 0 10px var(--primary-glow)' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--glass-border)', cursor: 'pointer' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--glass-border)', cursor: 'pointer' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--glass-border)', cursor: 'pointer' }}></span>
        </div>
      </div>

      {/* Subscribed / Suggested Courses */}
      <div className="fade-in-up delay-3" style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0 }}>subscribed courses / suggested courses</h2>
          <button className="btn btn-text" style={{ padding: '0 1rem' }}>View All →</button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="course-card glass-panel" style={{ minWidth: '300px', flex: '0 0 auto', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '130px', background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(65, 105, 225, 0.2))', borderRadius: '12px', marginBottom: '1rem', borderBottom: 'none' }}></div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Course Module {i}</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{i % 2 === 0 ? 'Suggested based on background' : 'Currently enrolled'}</p>
              
              {i % 2 !== 0 ? (
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: 'auto' }}>
                  <div style={{ width: `${i * 25}%`, height: '100%', background: 'var(--primary)' }}></div>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto', width: '100%' }}>Enroll Now</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subscribed / Suggested Roadmaps */}
      <div className="fade-in-up delay-4" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '1.8rem', margin: 0 }}>subscribed roadmap / suggest roadmap</h2>
          <button className="btn btn-text" style={{ padding: '0 1rem' }}>View All →</button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={`rm-${i}`} className="course-card glass-panel" style={{ minWidth: '320px', flex: '0 0 auto', padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ height: '120px', background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.1), rgba(65, 105, 225, 0.2))', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}></div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Career Path Roadmap {i}</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Curriculum tuned strictly to your goals</p>
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>Continue Path</button>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPage;
