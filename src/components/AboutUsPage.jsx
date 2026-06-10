import React from 'react';
import { Mail, Phone, MapPin, Info } from 'lucide-react';
import './CoursesPage.css';

const AboutUsPage = () => {
  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '3.5rem' }}>
        <Info size={28} style={{ color: 'var(--primary)' }} />
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>About CareerKinetic</h1>
      </div>
      
      {/* Intro Section */}
      <div className="glass-panel fade-in-up delay-2" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '24px', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1.2rem' }}>Our Mission</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          CareerKinetic is a revolutionary educational platform dedicated to transforming how individuals learn and grow in the tech industry. We provide heavily tailored pathways explicitly tuned to your unique professional background to ensure the highest quality of continuous education possible.
        </p>
      </div>

      {/* Vision Section */}
      <div className="glass-panel fade-in-up delay-3" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '24px', marginBottom: '2.5rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1.2rem' }}>Our Vision</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          We envision a stable future where top-tier mentorship, comprehensive certified bootcamps, and high-paying career-launching opportunities are seamlessly integrated into a single, sleek hub accessible by anyone, anywhere around the globe.
        </p>
      </div>

      {/* Contact Section */}
      <div className="glass-panel fade-in-up delay-4" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '24px' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Contact Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Mail size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <p className="text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>careerkinetic27@gmail.com</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Phone size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <p className="text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>+91 9971145505</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <p className="text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>3-14, Rayanapadu Gate, Vijayawada, Andhra Pradesh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
