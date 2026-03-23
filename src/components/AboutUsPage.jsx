import React from 'react';
import './CoursesPage.css'; // Utilizing standard layout structure

const AboutUsPage = () => {
  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Intro Section */}
      <div className="glass-panel fade-in-up delay-2" style={{ padding: '3.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Py Ja . APP</span>
          <span style={{ fontWeight: '400', opacity: 0.8 }}>|</span>
          <span style={{ fontWeight: '300' }}>Intro</span>
        </h2>
        <p className="text-muted" style={{ fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          PyJa App is an innovative learning platform designed to revolutionize how students and professionals master new skills. 
          We provide clearly structured roadmaps, comprehensive curated courses, and interactive testing environments strictly tailored to individual backgrounds—whether you're coming from Computer Science, Mathematics, or a completely different non-technical field.
        </p>
      </div>

      {/* Vision Section */}
      <div className="glass-panel fade-in-up delay-3" style={{ padding: '3.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.08), rgba(138, 43, 226, 0.08))', border: '1px solid rgba(138, 43, 226, 0.2)' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Py Ja . APP</span>
          <span style={{ fontWeight: '400', opacity: 0.8 }}>|</span>
          <span style={{ fontWeight: '300' }}>Vision</span>
        </h2>
        <p className="text-muted" style={{ fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '800px' }}>
          Our core mission is to democratize technological education through AI-driven, highly optimized curriculum paths. We believe learning should not be one-size-fits-all. Our vision is a collaborative ecosystem where every learner gets immediate access to the exact customized resources they need to succeed in their unique intellectual journey.
        </p>
      </div>

      {/* Team Section */}
      <div className="fade-in-up delay-4" style={{ marginTop: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', textDecoration: 'underline' }}>Team</h2>
        <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3].map((member) => (
            <div key={member} className="course-card glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '20px' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))', marginBottom: '1.5rem', border: '2px solid var(--glass-border)' }}></div>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: 0 }}>Team Member {member}</h3>
              <p className="text-muted" style={{ margin: '0.5rem 0 0 0', fontWeight: '500' }}>Core Contributor</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default AboutUsPage;
