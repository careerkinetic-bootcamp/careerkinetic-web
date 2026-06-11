import React from 'react';
import { Brain, Trophy, Sparkles } from 'lucide-react';

const TakeTestPage = () => {
  const dummySuggestions = [
    { id: 1, title: 'Python Basics Course', type: 'Course', icon: Sparkles },
    { id: 2, title: 'Data Science Roadmap', type: 'Roadmap', icon: Sparkles },
  ];

  return (
    <div className="courses-page fade-in-up delay-1">
      {/* Header / Test Link Section */}
      <div className="courses-header glass-panel fade-in-up delay-2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Brain size={28} style={{ color: 'var(--primary)' }} />
          <h1 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', margin: 0 }}>Take a Test</h1>
        </div>
        <p className="text-muted" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>Assess your current skills to get personalized learning recommendations.</p>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="input-label" style={{ fontSize: '1.1rem', margin: 0 }}>Test Link:</span>
          <a href="https://forms.google.com" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Open Google Forms Assessment
          </a>
        </div>
      </div>

      {/* Test Results Section */}
      <div className="glass-panel fade-in-up delay-3" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Trophy size={24} style={{ color: 'var(--primary)' }} />
          <h2 className="text-gradient" style={{ margin: 0, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' }}>Test Results</h2>
        </div>
        
        <div style={{ background: 'var(--glass-bg)', padding: 'clamp(1.2rem, 3vw, 2rem)', borderRadius: '12px', border: '1px dashed var(--glass-border)', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            There are no recent test results available. Complete the assessment above and sync your results to unlock personalized recommendations!
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input type="text" className="form-control" placeholder="Enter test score / ID..." style={{ maxWidth: '300px', flex: '1 1 200px' }} />
            <button className="btn btn-outline" style={{ flex: '0 0 auto' }}>Sync Results</button>
          </div>
        </div>
      </div>

      {/* Suggested Courses/Roadmaps Section */}
      <div className="fade-in-up delay-4" style={{ marginTop: '1.5rem' }}>
        <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>Suggested Courses & Roadmaps</h2>
        <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {dummySuggestions.map((item) => (
            <div 
              key={item.id} 
              className="course-card glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  background: item.type === 'Course' ? 'rgba(65, 105, 225, 0.15)' : 'rgba(138, 43, 226, 0.15)', 
                  color: item.type === 'Course' ? 'var(--secondary)' : '#a855f7',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {item.type}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--card-title-color)' }}>{item.title}</h3>
              <p className="text-muted" style={{ flex: 1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>Highly Recommended based on our AI analysis of your background interests.</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto', width: '100%', borderRadius: '9999px' }}>View {item.type}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeTestPage;
