import React, { useState, useEffect } from 'react';
import { Brain, Terminal, ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InteractiveRoadmapView from './InteractiveRoadmapView';
import './CoursesPage.css';

const ROADMAP_LIST = [
  {
    id: 'aiml',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Master out-of-core data architecture, neural networks, Transformer mechanisms, agentic multi-agent systems, 5 signature blueprints, and 30 HLD whiteboard defenses.',
    icon: Brain,
    badge: 'Dual Track: SWE Core + Advanced MLOps & GenAI',
    meta: '6 Core Modules',
    highlights: ['Out-of-Core Architecture', 'Transformers', 'GraphRAG', 'Agentic MLOps', 'Tensor Optimization', '30 HLD Studies']
  },
  {
    id: 'swe',
    title: 'Software Engineering (SWE) Course',
    description: 'Production resilience, software observability, CS fundamentals, FastAPI backend, LocalStack cloud mocking, 4 core architectural projects, and 30 enterprise HLD case studies.',
    icon: Terminal,
    badge: '4 Reference Systems • 30 HLDs',
    meta: '6 Core Modules',
    highlights: ['Production Resilience', 'Distributed Systems', 'FastAPI & Async', 'cProfile & Memory', 'Kafka Event Mesh', '30 HLD Cases']
  }
];

const RoadmapsPage = ({ initialTrack = null, onPageChange = () => {} }) => {
  const { isLoggedIn } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);

  useEffect(() => {
    if (initialTrack) {
      setSelectedTrack(initialTrack);
    }
  }, [initialTrack]);

  const handleExploreRoadmap = (trackId) => {
    setSelectedTrack(trackId);
  };

  if (!isLoggedIn) {
    return (
      <div className="glass-panel fade-in-up" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Compass size={48} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>Login Required</h2>
        <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Please log in to your CareerKinetic account to access our interactive curriculum roadmaps, track module progress, and explore blueprints.
        </p>
        <button 
          onClick={() => onPageChange && onPageChange('login')}
          className="btn btn-primary"
          style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', borderRadius: '12px', marginTop: '1rem' }}
        >
          Sign In to Access Roadmaps <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    );
  }

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
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1150px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
      
      {/* 1. Natural Integrated Page Header (No floating white box container) */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'left', paddingTop: '0.5rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 4.2vw, 2.75rem)', 
          fontWeight: 800, 
          color: 'var(--foreground)', 
          letterSpacing: '-0.75px', 
          margin: '0 0 0.5rem 0',
          lineHeight: 1.2
        }}>
          Curriculum Roadmaps
        </h1>
        
        <p style={{ 
          fontSize: '1.02rem', 
          color: 'var(--muted-foreground)', 
          lineHeight: 1.6, 
          margin: 0,
          maxWidth: '780px'
        }}>
          Explore industry-calibrated curricula with interactive progression tracking, enterprise architecture blueprints, and unassisted whiteboard defenses.
        </p>
      </div>

      {/* 2. Modern Bento-Style Roadmaps Grid */}
      <div 
        className="fade-in-up delay-2 bento-grid" 
        style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem'
        }}
      >
        {ROADMAP_LIST.map((map) => {
          const MapIcon = map.icon;
          const isAi = map.id === 'aiml';
          const accentColor = isAi ? 'var(--primary)' : '#0284c7';
          const accentBg = isAi ? 'rgba(212, 91, 8, 0.08)' : 'rgba(56, 189, 248, 0.08)';
          const accentBorder = isAi ? 'rgba(212, 91, 8, 0.22)' : 'rgba(56, 189, 248, 0.25)';

          return (
            <div
              key={map.id}
              className="bento-track-card"
            >
              {/* Card Header: Neat Top-Left Badge + Status Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  background: accentBg, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  border: `1px solid ${accentBorder}` 
                }}>
                  <MapIcon size={24} style={{ color: accentColor }} />
                </div>
                <span style={{ 
                  fontSize: '0.74rem', 
                  fontWeight: 600, 
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase', 
                  padding: '0.35rem 0.8rem', 
                  borderRadius: '9999px', 
                  background: 'rgba(241, 245, 249, 0.9)', 
                  color: '#475569', 
                  border: '1px solid rgba(226, 232, 240, 0.9)' 
                }}>
                  Self-Guided Tree • {map.meta}
                </span>
              </div>

              {/* Clean Tracker Subheading */}
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.75px', 
                color: accentColor, 
                marginBottom: '0.45rem' 
              }}>
                {map.badge}
              </div>

              {/* Title & Description with Balanced Spacing */}
              <h3 style={{ 
                color: 'var(--foreground)', 
                fontSize: '1.35rem', 
                fontWeight: 700, 
                lineHeight: 1.3,
                letterSpacing: '-0.3px',
                marginBottom: '0.75rem' 
              }}>
                {map.title}
              </h3>

              <p style={{ 
                fontSize: '0.92rem', 
                color: 'var(--muted-foreground)', 
                lineHeight: 1.6, 
                marginBottom: '1.75rem' 
              }}>
                {map.description}
              </p>

              {/* Key Domains Micro-Tags */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.8px', 
                  color: '#94a3b8', 
                  marginBottom: '0.75rem' 
                }}>
                  Core Architectural Domains
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {map.highlights.map((topic, tIdx) => (
                    <span key={tIdx} className="bento-tag">
                      <span className="bento-tag-dot" />
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subtle Interactive Action Footer */}
              <div 
                style={{ 
                  marginTop: 'auto', 
                  paddingTop: '1.25rem', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                  Interactive visual tree & checkpoints
                </span>
                <button
                  onClick={() => handleExploreRoadmap(map.id === 'swe' ? 'swe' : 'aiml')}
                  className="bento-ghost-btn"
                >
                  <span>Explore Interactive Roadmap</span>
                  <ArrowRight size={15} className="bento-arrow" />
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
