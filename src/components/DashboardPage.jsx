import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Compass, Zap, Trophy, Sparkles, ArrowRight, Users } from 'lucide-react';
import './CoursesPage.css';

import fresherJobsPoster from '../assets/fresher-jobs-2026.png';
import hiringPlacementGapPoster from '../assets/hiring-placement-gap-2026.png';
import fresherHiringLandscapePoster from '../assets/fresher-hiring-landscape-2026.png';

const DashboardPage = ({ onPageChange = () => {} }) => {
  const { isLoggedIn } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

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

  const bootcamps = [
    {
      title: 'Premium Bootcamp 1',
      desc: 'Intensive 12-week mentorship program designed to rapidly accelerate your career.',
      gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
      isEnrolled: isLoggedIn ? true : false,
      progress: 75
    },
    {
      title: 'Premium Bootcamp 2',
      desc: 'Intensive 12-week mentorship program designed to rapidly accelerate your career.',
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      isEnrolled: isLoggedIn ? true : false,
      progress: 50
    },
    {
      title: 'Premium Bootcamp 3',
      desc: 'Intensive 12-week mentorship program designed to rapidly accelerate your career.',
      gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)',
      isEnrolled: false
    },
    {
      title: 'Premium Bootcamp 4',
      desc: 'Intensive 12-week mentorship program designed to rapidly accelerate your career.',
      gradient: 'linear-gradient(135deg, #d946ef, #7c3aed)',
      isEnrolled: false
    },
    {
      title: 'Premium Bootcamp 5',
      desc: 'Intensive 12-week mentorship program designed to rapidly accelerate your career.',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      isEnrolled: false
    },
    {
      title: 'Premium Bootcamp 6',
      desc: 'Intensive 12-week mentorship program designed to rapidly accelerate your career.',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      isEnrolled: false
    }
  ];

  const roadmaps = [
    {
      id: 'aiml',
      title: 'Artificial Intelligence & Machine Learning',
      desc: 'Master out-of-core data architecture, neural networks, Transformers, agentic systems, 5 blueprints, and 30 HLD case studies.',
      gradient: 'linear-gradient(135deg, oklch(0.7 0.22 295 / 0.2), oklch(0.72 0.22 330 / 0.2))'
    },
    {
      id: 'swe',
      title: 'Software Engineering (SWE) Course',
      desc: 'Production resilience, software observability, CS fundamentals, FastAPI backend, 4 core architectural systems, and 30 HLD cases.',
      gradient: 'linear-gradient(135deg, oklch(0.58 0.22 295 / 0.2), oklch(0.41 0.15 240 / 0.2))'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleExploreRoadmap = () => {
    if (!isLoggedIn) {
      onPageChange('login');
    } else {
      onPageChange('roadmaps');
    }
  };

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Hero Section Container with Auto-Rotating Carousel */}
<div
  className="fade-in-up delay-2"
  style={{
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  }}
>

        
{/* Carousel Content */}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '2.5rem', zIndex: 2 }}>
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

      {/* Suggested/All Bootcamps */}
      <div className="fade-in-up delay-3" style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', margin: 0, fontFamily: 'var(--font-display)' }}>
              {isLoggedIn ? 'Suggested Bootcamps' : 'All Bootcamps'}
            </h2>
          </div>
          <button 
            className="btn btn-text" 
            style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
            onClick={() => onPageChange(isLoggedIn ? 'mentorship' : 'login')}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {bootcamps.map((bootcamp, idx) => (
            <div key={idx} className="course-card glass-panel" style={{ minWidth: '280px', flex: '0 0 auto', padding: '1.5rem', borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
              {/* Unique gradient overlays */}
              <div style={{ height: '130px', background: bootcamp.gradient, borderRadius: 'var(--radius-base)', marginBottom: '1.25rem', opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <Users size={32} style={{ opacity: 0.9 }} />
              </div>
              <h3 style={{ color: 'var(--card-title-color)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {bootcamp.title}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                {bootcamp.desc}
              </p>
              
              {bootcamp.isEnrolled ? (
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--muted-foreground)' }}>
                    <span>Progress</span>
                    <span>{bootcamp.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${bootcamp.progress}%`, height: '100%', background: 'var(--primary)' }}></div>
                  </div>
                </div>
              ) : (
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ marginTop: 'auto', width: '100%', borderRadius: '9999px' }}
                  onClick={() => onPageChange(isLoggedIn ? 'mentorship' : 'login')}
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested/All Roadmaps */}
      <div className="fade-in-up delay-4" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', margin: 0, fontFamily: 'var(--font-display)' }}>
              {isLoggedIn ? 'Suggested Roadmaps' : 'All Roadmaps'}
            </h2>
          </div>
          <button onClick={handleExploreRoadmap} className="btn btn-text" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {roadmaps.map((map, idx) => (
            <div key={idx} className="course-card glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
              <div style={{ height: '130px', background: map.gradient, borderRadius: 'var(--radius-base)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                <Compass size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ color: 'var(--card-title-color)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {map.title}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 }}>
                {map.desc}
              </p>
              <button onClick={handleExploreRoadmap} className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 'auto', borderRadius: '9999px' }}>
                Explore Roadmap →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
