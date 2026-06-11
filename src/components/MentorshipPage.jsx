import React from 'react';
import { Zap, BookOpen, Users } from 'lucide-react';
import './CoursesPage.css'; // Reusing global styling structure

const MentorshipPage = () => {
  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Subscribed Bootcamp Section */}
      <div className="fade-in-up delay-2" style={{ marginTop: '1rem' }}>
        <h2 className="text-gradient" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', marginBottom: '1.5rem', textDecoration: 'underline' }}>Subscribed Bootcamp</h2>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'center' }}>
          {[1, 2].map((i) => (
            <div key={i} className="glass-panel" style={{ minWidth: '150px', height: '150px', flex: '0 0 auto', padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gradient-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                <BookOpen size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)' }}>Bootcamp {i}</p>
            </div>
          ))}
          <div style={{ color: 'var(--text-muted)', fontSize: '1.5rem', letterSpacing: '4px', margin: '0 1rem' }}>- - -</div>
          <button className="btn btn-outline" style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', borderColor: 'var(--border)', flexShrink: 0 }}>&gt;</button>
        </div>
      </div>

      {/* Bootcamps Listing Section */}
      <div className="fade-in-up delay-3" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Zap size={24} style={{ color: 'var(--primary)' }} />
          <h2 className="text-gradient" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: 0, textDecoration: 'underline' }}>Bootcamps</h2>
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="control-group">
            <label className="input-label" style={{textTransform:'lowercase'}}>Sort</label>
            <select className="form-control" style={{ width: '150px' }}>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="Newest">Newest</option>
            </select>
          </div>
          <div className="control-group">
            <label className="input-label" style={{textTransform:'lowercase'}}>Filter:</label>
            <select className="form-control" style={{ width: '200px' }}>
              <option value="">All Categories</option>
              <option value="tech">Technology</option>
              <option value="design">Design</option>
            </select>
          </div>
        </div>

        {/* Bootcamps Grid */}
        <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="course-card glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '140px', background: 'var(--gradient-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={32} style={{ color: 'var(--primary)', opacity: 0.7 }} />
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--card-title-color)' }}>Premium Bootcamp {i}</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', flex: 1 }}>Intensive 12-week mentorship program designed to rapidly accelerate your career.</p>
                <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 'auto', borderRadius: '9999px' }}>Enroll Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MentorshipPage;
