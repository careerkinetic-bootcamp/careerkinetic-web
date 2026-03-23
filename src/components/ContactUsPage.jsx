import React from 'react';
import './AuthSplitLayout.css'; // Inheriting the split window layout that perfectly serves a contact page

const ContactUsPage = () => {
  return (
    <div className="split-layout fade-in-up delay-1">
      
      {/* Left Column: Request Form */}
      <div className="auth-panel glass-panel" style={{ padding: '3.5rem' }}>
        <div className="auth-header" style={{ marginBottom: '2.5rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>Request a call back</h2>
          <p className="text-muted">Drop us your details and our team will get in touch with you shortly.</p>
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group fade-in-up delay-2">
            <label className="input-label" style={{ fontSize: '1rem', textTransform: 'capitalize' }}>Name :-</label>
            <input type="text" className="form-control" placeholder="Enter your full name" />
          </div>

          <div className="input-group fade-in-up delay-2">
            <label className="input-label" style={{ fontSize: '1rem', textTransform: 'capitalize' }}>Email :-</label>
            <input type="email" className="form-control" placeholder="Enter your email address" />
          </div>

          <div className="input-group fade-in-up delay-3">
            <label className="input-label" style={{ fontSize: '1rem', textTransform: 'capitalize' }}>Phone :-</label>
            <input type="tel" className="form-control" placeholder="Enter your mobile number" />
          </div>

          <div className="input-group fade-in-up delay-3">
            <label className="input-label" style={{ fontSize: '1rem', textTransform: 'capitalize' }}>Comment :-</label>
            <textarea className="form-control" placeholder="Write your message here..." rows="4" style={{ resize: 'vertical', minHeight: '120px' }}></textarea>
          </div>

          <div className="auth-actions fade-in-up delay-4" style={{ marginTop: '2.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '14px' }}>
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Contact Info Display */}
      <div className="intro-panel glass-panel fade-in-up delay-2" style={{ background: 'transparent', border: 'none', justifyContent: 'flex-start', paddingTop: '4rem', paddingLeft: '3rem' }}>
        <div className="intro-content">
          <div className="icon-wrapper" style={{ padding: '1.5rem', marginBottom: '0.5rem', background: 'rgba(138, 43, 226, 0.1)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          
          <h1 className="text-gradient" style={{ fontSize: '2.6rem', lineHeight: 1.2 }}>Py Ja . APP<br/>contact info</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2.5rem', width: '100%' }}>
            <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '1.5rem' }}>✉️</div>
              <div>
                <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Email Support</strong>
                <span className="text-muted">contact@pyja.app</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '1.5rem' }}>📍</div>
              <div>
                <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '0.2rem' }}>Office Location</strong>
                <span className="text-muted">123 Learning Boulevard, Hub City, Tech 4021</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactUsPage;
