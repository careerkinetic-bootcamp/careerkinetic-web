import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Zap, Sparkles, ArrowRight, Users, Clock, CheckCircle2 } from 'lucide-react';
import './CoursesPage.css';

import fresherJobsPoster from '../assets/fresher-jobs-2026.png';
import hiringPlacementGapPoster from '../assets/hiring-placement-gap-2026.png';
import fresherHiringLandscapePoster from '../assets/fresher-hiring-landscape-2026.png';

const DashboardPage = ({ onPageChange = () => {} }) => {
  const { isLoggedIn } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('roadmaps'); // 'roadmaps' | 'cohorts'

  const slides = [
    {
      type: 'image',
      image: fresherJobsPoster,
      alt: 'Fresher Jobs 2026'
    },
    {
      type: 'image',
      image: hiringPlacementGapPoster,
      alt: 'The Hiring-Placement Gap'
    },
    {
      type: 'image',
      image: fresherHiringLandscapePoster,
      alt: 'Fresher Hiring Landscape 2026'
    }
  ];

  const cohorts = [
    {
      id: 'aiml',
      title: 'AI & Machine Learning Cohort',
      badge: 'Advanced MLOps & GenAI',
      duration: '8 Months Bootcamp',
      desc: 'Master enterprise AI engineering with 1-on-1 guidance from senior ML practitioners. Build GraphRAG, Multi-Agent Mesh, and defend 30 HLD case studies.',
      badgeColor: '#f472b6',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      highlights: [
        'Dedicated 1-on-1 Senior AI/ML Mentor',
        '5 Signature Production Blueprints (GraphRAG, ViT)',
        '30 Global Whiteboard HLD Case Studies'
      ]
    },
    {
      id: 'swe',
      title: 'Software Engineering (SWE) Cohort',
      badge: 'Production Backend & Systems',
      duration: '8 Months Bootcamp',
      desc: 'Master high-concurrency backend architecture with 1-on-1 mentoring. Construct 4 reference systems, analyze distributed trade-offs, and defend 30 HLD scenarios.',
      badgeColor: '#818cf8',
      badgeBg: 'rgba(99, 102, 241, 0.15)',
      highlights: [
        'Dedicated 1-on-1 Principal Backend Mentor',
        '4 Core Reference Systems (Teams, Gateway, Mesh)',
        'Live Profiling & High-Concurrency Stress Testing'
      ]
    }
  ];

  const roadmaps = [
    {
      id: 'aiml',
      title: 'Artificial Intelligence & Machine Learning',
      desc: 'Master out-of-core data architecture, neural networks, Transformers, agentic systems, 5 blueprints, and 30 HLD case studies.',
      topics: ['Out-of-Core Architecture', 'Transformers', 'GraphRAG', 'Agentic MLOps', 'Tensor Optimization', '30 HLD Studies']
    },
    {
      id: 'swe',
      title: 'Software Engineering (SWE)',
      desc: 'Production resilience, software observability, CS fundamentals, FastAPI backend, 4 core architectural systems, and 30 HLD cases.',
      topics: ['Production Resilience', 'Distributed Systems', 'FastAPI & Async', 'cProfile & Memory', 'Kafka Event Mesh', '30 HLD Cases']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleExploreRoadmap = (trackId) => {
    onPageChange('roadmaps', trackId);
  };

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Hero Headline & Value Proposition */}
      <div className="fade-in-up delay-1" style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1.1rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '1.25rem' }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.5px' }}>
            Next-Gen Tech Career Platform
          </span>
        </div>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, margin: '0 auto 1.25rem auto', maxWidth: '850px' }}>
          Bridge the Gap to Elite Tech Careers
        </h1>
        <p className="text-muted" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 2rem auto' }}>
          Master production distributed systems & modern AI engineering with unassisted live code defenses, battle-tested roadmaps, and 1-on-1 industry mentorship.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            style={{ borderRadius: '9999px', padding: '0.85rem 2rem', fontSize: '0.98rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)' }}
            onClick={() => onPageChange(isLoggedIn ? 'test' : 'login')}
          >
            <Zap size={18} /> Take Skill Assessment
          </button>
          <button 
            className="btn btn-outline" 
            style={{ borderRadius: '9999px', padding: '0.85rem 2rem', fontSize: '0.98rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            onClick={() => onPageChange('roadmaps')}
          >
            <Compass size={18} /> Explore Roadmaps
          </button>
        </div>
      </div>

      {/* Hero Infographic Carousel */}
      <div
        className="fade-in-up delay-2"
        style={{
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          key={activeSlide}
          className="fade-in"
          style={{
            animationDuration: '0.5s',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={slides[activeSlide].image}
            alt={slides[activeSlide].alt}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '920px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '16px',
              margin: '0 auto'
            }}
          />
        </div>
        
        {/* Carousel Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '2rem', zIndex: 2 }}>
          {slides.map((_, index) => (
            <span 
              key={index} 
              onClick={() => setActiveSlide(index)}
              style={{ 
                width: activeSlide === index ? '12px' : '10px', 
                height: activeSlide === index ? '12px' : '10px', 
                borderRadius: '50%', 
                background: activeSlide === index ? 'var(--primary)' : 'var(--border)', 
                border: activeSlide === index ? '2px solid var(--primary)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeSlide === index ? '0 0 10px var(--primary)' : 'none'
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* Unified Programs & Learning Paths Section with Interactive Toggle */}
      <div className="fade-in-up delay-3" style={{ marginTop: '4.5rem' }}>
        
        {/* Modern Interactive Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              background: 'rgba(255, 255, 255, 0.04)', 
              padding: '6px', 
              borderRadius: '9999px', 
              border: '1px solid var(--border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            <button
              onClick={() => setActiveTab('roadmaps')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.6rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeTab === 'roadmaps' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'roadmaps' ? '#fff' : 'var(--muted-foreground)',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'roadmaps' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              <Compass size={17} />
              Roadmaps
            </button>

            <button
              onClick={() => setActiveTab('cohorts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.6rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeTab === 'cohorts' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'cohorts' ? '#fff' : 'var(--muted-foreground)',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === 'cohorts' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              <Users size={17} />
              Mentorship Cohorts
            </button>
          </div>
        </div>

        {/* Dynamic Context Explanation */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="text-muted" style={{ fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.55 }}>
            {activeTab === 'roadmaps' 
              ? 'Follow structured visual milestone architectures, high-level system design case studies, and core CS fundamentals at your own pace.' 
              : 'Accelerate with dedicated senior industry mentors, weekly live code defenses at the whiteboard, and guaranteed portfolio calibration.'}
          </p>
        </div>

        {/* Tab 1: Interactive Roadmaps */}
        {activeTab === 'roadmaps' && (
          <div key="roadmaps" className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {roadmaps.map((map) => (
              <div 
                key={map.id} 
                className="course-card glass-panel" 
                style={{ 
                  padding: '2rem', 
                  borderRadius: 'var(--radius-card)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  border: '1px solid var(--border)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <Compass size={24} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
                    Self-Guided Tree
                  </span>
                </div>

                <h3 style={{ color: 'var(--foreground)', fontSize: '1.35rem', marginBottom: '0.6rem', fontWeight: 700 }}>
                  {map.title}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 }}>
                  {map.desc}
                </p>

                <div style={{ marginBottom: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {map.topics.map((topic, tIdx) => (
                    <span 
                      key={tIdx} 
                      style={{ 
                        fontSize: '0.78rem', 
                        padding: '0.3rem 0.65rem', 
                        borderRadius: '6px', 
                        background: 'rgba(255,255,255,0.04)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        color: 'var(--muted-foreground)' 
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => handleExploreRoadmap(map.id)} 
                  className="btn btn-primary" 
                  style={{ width: '100%', borderRadius: '9999px', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}
                >
                  View Roadmap <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Mentorship Cohorts */}
        {activeTab === 'cohorts' && (
          <div key="cohorts" className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {cohorts.map((cohort) => (
              <div 
                key={cohort.id} 
                className="course-card glass-panel" 
                style={{ 
                  padding: '2rem', 
                  borderRadius: 'var(--radius-card)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  border: '1px solid var(--border)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    padding: '0.3rem 0.75rem', 
                    borderRadius: '9999px', 
                    background: cohort.badgeBg, 
                    color: cohort.badgeColor,
                    border: `1px solid ${cohort.badgeColor}40`
                  }}>
                    {cohort.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} />
                    {cohort.duration}
                  </span>
                </div>

                <h3 style={{ color: 'var(--foreground)', fontSize: '1.35rem', marginBottom: '0.6rem', fontWeight: 700 }}>
                  {cohort.title}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.6, flex: 1 }}>
                  {cohort.desc}
                </p>

                <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {cohort.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.86rem', color: 'var(--muted-foreground)' }}>
                        <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: 'auto', borderRadius: '9999px', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}
                  onClick={() => onPageChange(isLoggedIn ? 'mentorship' : 'login')}
                >
                  Mentorship Program <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
