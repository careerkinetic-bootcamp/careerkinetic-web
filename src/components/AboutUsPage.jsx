import React from 'react';
import './CoursesPage.css';

const AboutUsPage = () => {
  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '3.5rem' }}>About PyJa App</h1>
      
      {/* Intro Section */}
      <div className="glass-panel fade-in-up delay-2" style={{ padding: '3.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '1.2rem' }}>Our Mission</h2>
        <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          PyJa App is a revolutionary educational platform dedicated to transforming how individuals learn and grow in the tech industry. We provide heavily tailored pathways explicitly tuned to your unique professional background to ensure the highest quality of continuous education possible.
        </p>
      </div>

      {/* Vision Section */}
      <div className="glass-panel fade-in-up delay-3" style={{ padding: '3.5rem', borderRadius: '24px', marginBottom: '2.5rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '1.2rem' }}>Our Vision</h2>
        <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          We envision a stable future where top-tier mentorship, comprehensive certified bootcamps, and high-paying career-launching opportunities are seamlessly integrated into a single, sleek hub accessible by anyone, anywhere around the globe.
        </p>
      </div>

      {/* Contact Section appended from deleted Contact Us Component */}
      <div className="glass-panel fade-in-up delay-4" style={{ padding: '3.5rem', borderRadius: '24px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Contact Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>✉️</div>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.15rem' }}>support@pyjaapp.com</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>📞</div>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.15rem' }}>+1 (555) 123-4567</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>📍</div>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.15rem' }}>123 Innovation Drive, Tech City, TC 90210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
