import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Compass, Zap, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import './CoursesPage.css';

const DashboardPage = () => {
  const { isLoggedIn } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      tag: 'TRENDING',
      title: 'How AI is Transforming Modern Learning Algorithms',
      desc: 'Explore the computational models backing CareerKinetic\'s dynamic paths.',
    },
    {
      tag: 'CAREER EXPLORATION',
      title: 'Demystifying Fullstack Engineering Paths in 2026',
      desc: 'Which frameworks, libraries, and core patterns are leading modern engineering hubs?',
    },
    {
      tag: 'DESIGN PATHWAYS',
      title: 'Psychological Principles Behind Conversion-Driven UI',
      desc: 'Master the cognitive laws governing intuitive layouts and interactive user flows.',
    },
    {
      tag: 'BOOTCAMP EXCLUSIVES',
      title: 'Continuous Industry Mentor-Led Learning Frameworks',
      desc: 'How assigned tech leaders accelerate bootcamps from concept to global hire-ready.',
    }
  ];

  const featuredCourses = [
    {
      title: 'Full-Stack Engineering',
      desc: 'Master frontend, backend, SSR rendering, database scaling, and DevOps pipelines.',
      gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
      isEnrolled: true,
      progress: 75
    },
    {
      title: 'Product Design Mastery',
      desc: 'Explore psychological principles, design systems, Figma, and conversion-driven UI.',
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      isEnrolled: false
    },
    {
      title: 'Data Science with Python',
      desc: 'Learn data analytics, statistical modeling, pandas, numpy, and predictive mathematics.',
      gradient: 'linear-gradient(135deg, #6366f1, #3b82f6)',
      isEnrolled: true,
      progress: 50
    },
    {
      title: 'AI & Machine Learning',
      desc: 'Understand transformers, neural networks, PyTorch, LLMs, and model deployment.',
      gradient: 'linear-gradient(135deg, #d946ef, #7c3aed)',
      isEnrolled: false
    }
  ];

  const roadmaps = [
    {
      title: 'Full-Stack Developer Roadmap',
      desc: 'A complete step-by-step path to master modern web architecture.',
      gradient: 'linear-gradient(135deg, oklch(0.7 0.22 295 / 0.15), oklch(0.72 0.22 330 / 0.15))'
    },
    {
      title: 'AI & ML Engineer Roadmap',
      desc: 'Master mathematics, deep learning, NLP, and computer vision models.',
      gradient: 'linear-gradient(135deg, oklch(0.58 0.22 295 / 0.15), oklch(0.41 0.15 240 / 0.15))'
    },
    {
      title: 'UX/UI Designer Roadmap',
      desc: 'Learn visual design, cognitive principles, wireframing, and research.',
      gradient: 'linear-gradient(135deg, oklch(0.72 0.22 330 / 0.15), oklch(0.65 0.22 27 / 0.15))'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Hero Section Container with Auto-Rotating Carousel */}
      <div 
        className="glass-panel fade-in-up delay-2" 
        style={{ 
          padding: 'clamp(1.5rem, 5vw, 3.5rem)', 
          borderRadius: 'var(--radius-hero)', 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden', 
          minHeight: '320px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          background: 'var(--gradient-card)', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-soft)'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-primary)', opacity: 0.04, pointerEvents: 'none' }}></div>
        
        {/* Carousel Content */}
        <div key={activeSlide} className="fade-in" style={{ animationDuration: '0.5s' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--secondary)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '9999px', marginBottom: '1.25rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', color: 'var(--primary)' }}>
            <Sparkles size={12} />
            {slides[activeSlide].tag}
          </div>
          <h1 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.15 }}>
            {slides[activeSlide].title}
          </h1>
          <p className="text-muted" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            {slides[activeSlide].desc}
          </p>
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

      {/* Suggested/All Courses */}
      <div className="fade-in-up delay-3" style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', margin: 0, fontFamily: 'var(--font-display)' }}>
              {isLoggedIn ? 'Suggested Courses' : 'All Courses'}
            </h2>
          </div>
          <button className="btn btn-text" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {featuredCourses.map((course, idx) => (
            <div key={idx} className="course-card glass-panel" style={{ minWidth: '280px', flex: '0 0 auto', padding: '1.5rem', borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
              {/* Unique tailwind gradient overlays */}
              <div style={{ height: '130px', background: course.gradient, borderRadius: 'var(--radius-base)', marginBottom: '1.25rem', opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <Sparkles size={28} style={{ opacity: 0.6 }} />
              </div>
              <h3 style={{ color: 'var(--card-title-color)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {course.title}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                {course.desc}
              </p>
              
              {course.isEnrolled ? (
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--muted-foreground)' }}>
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary)' }}></div>
                  </div>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" style={{ marginTop: 'auto', width: '100%', borderRadius: '9999px' }}>Enroll Now</button>
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
          <button className="btn btn-text" style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {roadmaps.map((map, idx) => (
            <div key={idx} className="course-card glass-panel" style={{ minWidth: '280px', flex: '0 0 auto', padding: '1.5rem', borderRadius: 'var(--radius-card)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
              <div style={{ height: '120px', background: 'var(--gradient-card)', borderRadius: 'var(--radius-base)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', opacity: 0.9 }}>
                <Compass size={24} style={{ color: 'var(--primary)', opacity: 0.7 }} />
              </div>
              <h3 style={{ color: 'var(--card-title-color)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {map.title}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {map.desc}
              </p>
              <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 'auto', borderRadius: '9999px' }}>Continue Path</button>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardPage;
