import React from 'react';

const TakeTestPage = () => {
  const dummySuggestions = [
    { id: 1, title: 'Python Basics Course', type: 'Course' },
    { id: 2, title: 'Data Science Roadmap', type: 'Roadmap' },
  ];

  return (
    <div className="courses-page fade-in-up delay-1">
      {/* Header / Test Link Section */}
      <div className="courses-header glass-panel fade-in-up delay-2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
        <h1 className="text-gradient">Take a Test</h1>
        <p className="text-muted">Assess your current skills to get personalized learning recommendations.</p>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="input-label" style={{ fontSize: '1.1rem', margin: 0 }}>Test Link:</span>
          <a href="https://forms.google.com" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Open Google Forms Assessment
          </a>
        </div>
      </div>

      {/* Test Results Section */}
      <div className="glass-panel fade-in-up delay-3" style={{ padding: '2.5rem', borderRadius: '20px' }}>
        <h2 className="text-gradient" style={{ textDecoration: 'underline', marginBottom: '1.5rem', fontSize: '2rem' }}>Test results :-</h2>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            There are no recent test results available. Complete the assessment above and sync your results to unlock personalized recommendations!
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <input type="text" className="form-control" placeholder="Enter test score / ID..." style={{ maxWidth: '300px' }} />
            <button className="btn btn-outline">Sync Results</button>
          </div>
        </div>
      </div>

      {/* Suggested Courses/Roadmaps Section */}
      <div className="fade-in-up delay-4" style={{ marginTop: '1rem' }}>
        <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Suggest courses / Roadmaps</h2>
        <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {dummySuggestions.map((item) => (
            <div 
              key={item.id} 
              className="course-card glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  background: item.type === 'Course' ? 'rgba(65, 105, 225, 0.2)' : 'rgba(138, 43, 226, 0.2)', 
                  color: item.type === 'Course' ? '#6f8eff' : '#a855f7',
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
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>{item.title}</h3>
              <p className="text-muted" style={{ flex: 1, margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>Highly Recommended based on our AI analysis of your background interests.</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto', width: '100%' }}>View {item.type}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeTestPage;
