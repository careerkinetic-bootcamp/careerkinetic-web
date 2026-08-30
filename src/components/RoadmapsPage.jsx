import React, { useState, useEffect } from 'react';
import { Brain, Terminal, ArrowRight } from 'lucide-react';
import InteractiveRoadmapView from './InteractiveRoadmapView';
import './CoursesPage.css';

const ROADMAP_LIST = [
  {
    id: 'aiml',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Master out-of-core data architecture, neural networks, Transformer mechanisms, agentic multi-agent systems, 5 signature blueprints, and 30 HLD whiteboard defenses.',
    icon: Brain,
    gradient: 'linear-gradient(135deg, oklch(0.7 0.22 295 / 0.2), oklch(0.72 0.22 330 / 0.2))',
    badge: 'Dual Track: SWE Core + Advanced MLOps & GenAI'
  },
  {
    id: 'swe',
    title: 'Software Engineering (SWE) Course',
    description: 'Production resilience, software observability, CS fundamentals, FastAPI backend, LocalStack cloud mocking, 4 core architectural projects, and 30 enterprise HLD case studies.',
    icon: Terminal,
    gradient: 'linear-gradient(135deg, oklch(0.58 0.22 295 / 0.2), oklch(0.41 0.15 240 / 0.2))',
    badge: '4 Reference Systems • 30 HLDs'
  }
];

const RoadmapsPage = ({ initialTrack = null, onPageChange = () => {} }) => {
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);

  useEffect(() => {
    if (initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack]);

  const handleExploreRoadmap = (trackId) => {
    setSelectedTrack(trackId);
  };

  // If a specific track is selected or active, render the Interactive Roadmap View
  if (selectedTrack) {
    return (
      <InteractiveRoadmapView
        initialTrack={selectedTrack}
        onBack={() => setSelectedTrack(null)}
      />
    );
  }

  return (
    <div className="courses-page fade-in-up delay-1">
      {/* Header */}
      <div className="courses-header glass-panel fade-in-up delay-2">
        <div>
          <h1 className="text-gradient">Curriculum Roadmaps</h1>
          <p className="text-muted" style={{ margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
            Explore industry-calibrated curricula with interactive progression tracking, blueprints, and oral defense frameworks.
          </p>
        </div>
      </div>


      {/* Roadmaps Grid */}
      <div 
        className="courses-grid fade-in-up delay-3" 
        style={{ 
          marginTop: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          maxWidth: '1000px',
          margin: '1.5rem auto 0 auto'
        }}
      >
        {ROADMAP_LIST.map((map, index) => {
          const MapIcon = map.icon;
          return (
            <div
              key={map.id}
              className="course-card glass-panel"
              style={{
                animationDelay: `${0.4 + index * 0.05}s`,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border)'
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: map.gradient,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}
                >
                  <MapIcon size={26} style={{ color: 'var(--primary)' }} />
                </div>
              </div>

              <div className="course-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {map.badge}
                  </span>
                </div>
                <h3 style={{ color: 'var(--foreground)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {map.title}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {map.description}
                </p>
                <button
                  onClick={() => handleExploreRoadmap(map.id === 'swe' ? 'swe' : 'aiml')}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Explore Interactive Roadmap <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapsPage;
