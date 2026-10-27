import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, ArrowRight, Users, Clock, CheckCircle2, Sparkles, Terminal 
} from 'lucide-react';
import './CoursesPage.css';

const DashboardPage = ({ onPageChange = () => {} }) => {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('roadmaps'); // 'roadmaps' | 'cohorts'

  const cohorts = [
    {
      id: 'aiml',
      title: 'AI & Machine Learning Cohort',
      badge: 'Advanced MLOps & GenAI',
      duration: '8 Months Bootcamp',
      desc: 'Master enterprise AI engineering with 1-on-1 guidance from senior ML practitioners. Build GraphRAG, Multi-Agent Mesh, and defend 30 HLD case studies.',
      badgeColor: 'var(--primary)',
      badgeBg: 'var(--primary-glow)',
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
      badgeColor: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.12)',
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

  const handleExploreRoadmap = (trackId) => {
    onPageChange('roadmaps', trackId);
  };

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Hero Outer Wrapper with Ambient Glow & Glassmorphism Card */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1060px', margin: '1rem auto 4.5rem auto' }}>
        
        {/* Soft Ambient Radial Blur Glow (Adds modern depth behind the hero) */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '0%', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '650px', 
            height: '380px', 
            background: 'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(249, 115, 22, 0.14), rgba(219, 39, 119, 0.05) 55%, transparent 75%)', 
            filter: 'blur(50px)', 
            pointerEvents: 'none', 
            zIndex: 0 
          }} 
        />

        {/* Subtle Glassmorphism Hero Card */}
        <div 
          className="fade-in-up delay-1" 
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            textAlign: 'center', 
            padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem)', 
            borderRadius: '28px', 
            background: 'rgba(255, 255, 255, 0.72)', 
            backdropFilter: 'blur(16px)', 
            WebkitBackdropFilter: 'blur(16px)', 
            border: '1px solid rgba(255, 255, 255, 0.95)', 
            boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.07), 0 0 0 1px rgba(226, 232, 240, 0.7)' 
          }}
        >
          {/* 1. Main Headline with Electric Vibrant Gradient Accent & Balanced Line Breaks */}
          <h1 
            style={{ 
              fontSize: 'clamp(2.2rem, 5.2vw, 3.5rem)', 
              fontWeight: 800, 
              lineHeight: 1.18, 
              margin: '0 auto 1.35rem auto', 
              maxWidth: '960px', 
              color: '#0f172a',
              letterSpacing: '-0.75px',
              textWrap: 'balance'
            }}
          >
            Bridge the Gap to{' '}
            <span 
              style={{ 
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 45%, #db2777 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                display: 'inline-block' 
              }}
            >
              Elite Tech Careers
            </span>
          </h1>

          {/* 3. Subtitle with Refined Color & Line Spacing */}
          <p 
            style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.15rem)', 
              lineHeight: 1.65, 
              maxWidth: '720px', 
              margin: '0 auto 2.25rem auto', 
              color: '#475569',
              fontWeight: 450
            }}
          >
            Master production distributed systems & modern AI engineering with unassisted live code defenses, battle-tested roadmaps, and 1-on-1 industry mentorship.
          </p>

          {/* 4. Redesigned Modern Action Buttons */}
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ 
                borderRadius: '12px', 
                padding: '0.9rem 2rem', 
                fontSize: '0.98rem', 
                fontWeight: 600, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px'
              }}
              onClick={() => onPageChange(isLoggedIn ? 'test' : 'login')}
            >
              Start Skill Assessment <ArrowRight size={16} />
            </button>
            <button 
              className="btn btn-outline" 
              style={{ 
                borderRadius: '12px', 
                padding: '0.9rem 2rem', 
                fontSize: '0.98rem', 
                fontWeight: 600, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px'
              }}
              onClick={() => onPageChange('roadmaps')}
            >
              Explore Roadmaps
            </button>
          </div>

          {/* 5. Clean Trust Badges Pill Container */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 'clamp(0.75rem, 2vw, 1.4rem)', 
                padding: '0.55rem 1.4rem', 
                borderRadius: '9999px', 
                background: 'rgba(255, 255, 255, 0.85)', 
                border: '1px solid rgba(226, 232, 240, 0.95)', 
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '0.82rem',
                color: '#475569'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> 15-Min Architectural Diagnostic
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(148, 163, 184, 0.6)' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> 0 Toy Apps • Real System Defenses
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(148, 163, 184, 0.6)' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Free & Instant Track Matching
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2026 Campus Placement & Tech Hiring Reality Report - Option B Minimalist Editorial */}
      <div id="placement-report" className="fade-in-up delay-2" style={{ margin: '3rem auto 5rem auto', maxWidth: '1150px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 auto 0.75rem auto', color: 'var(--foreground)', letterSpacing: '-0.5px' }}>
            The Placement Paradox: High Demand, Low Clearance
          </h2>
          <p className="text-muted" style={{ fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Tech companies are actively recruiting, yet 84% of engineering graduates remain unplaced. The bottleneck isn't vacancies — it's the gap between college syntax and production architectures.
          </p>
        </div>

        {/* Minimalist Top Stat Ribbon (Apple / Vercel Editorial Style) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          borderTop: '1px solid var(--border)', 
          borderBottom: '1px solid var(--border)', 
          padding: '2.5rem 1rem',
          margin: '0 0 3.5rem 0',
          gap: '2.5rem'
        }}>
          {/* Stat 1 */}
          <div style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: 'clamp(2.8rem, 4vw, 3.4rem)', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1, letterSpacing: '-1px' }}>
                87.8%
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                Demand
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.3rem' }}>
              Campus Hiring Intent
            </div>
            <p className="text-muted" style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.45 }}>
              Of technology enterprises are actively seeking campus engineering hires.
            </p>
          </div>

          {/* Stat 2 */}
          <div style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: 'clamp(2.8rem, 4vw, 3.4rem)', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1, letterSpacing: '-1px' }}>
                84.0%
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                Gap
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.3rem' }}>
              Graduates Left Unplaced
            </div>
            <p className="text-muted" style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.45 }}>
              Failing technical whiteboard rounds and unassisted architecture evaluation.
            </p>
          </div>

          {/* Stat 3 */}
          <div style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: 'clamp(2.8rem, 4vw, 3.4rem)', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-1px' }}>
                10×
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(212, 91, 8, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                Outcome
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.3rem' }}>
              Interview Clearance Rate
            </div>
            <p className="text-muted" style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.45 }}>
              For candidates who present verifiable distributed systems and oral code defense.
            </p>
          </div>
        </div>

        {/* Side-by-Side Reality Check: What Gets Filtered vs The CareerKinetic Standard */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {/* Panel 1: What Gets Filtered */}
          <div style={{ 
            padding: '2.5rem', 
            borderRadius: '24px', 
            background: 'var(--card)', 
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.75px', color: '#ef4444' }}>
                The Filter Trap
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.6rem' }}>
              Why 84% of Resumes Fail Technical Screening
            </h3>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              GenAI and mass tutorials flooded applicant pools with identical resumes. Hiring managers filter out these patterns immediately:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>—</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                    Cloned Tutorial Apps
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    To-do lists, Netflix clones, and basic CRUD apps seen by recruiters 1,000+ times are immediately flagged as non-serious.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>—</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                    AI-Assisted Syntax Without Foundations
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    Candidates crumble the moment an interviewer asks them to explain async event loops, race conditions, or DB deadlocks unassisted.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>—</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                    Rote LeetCode Memorization
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    Memorizing 300 algorithm tricks without understanding memory profiling, system latency, or telemetry fails modern system rounds.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ 
              marginTop: '2.5rem', 
              paddingTop: '1.25rem', 
              borderTop: '1px solid var(--border)', 
              fontSize: '0.84rem', 
              color: 'var(--muted-foreground)' 
            }}>
              <strong>Recruiter consensus:</strong> Certificates without verifiable code defense carry zero weight in 2026.
            </div>
          </div>

          {/* Panel 2: The CareerKinetic Standard */}
          <div style={{ 
            padding: '2.5rem', 
            borderRadius: '24px', 
            background: 'var(--card)', 
            border: '1.5px solid var(--primary)', 
            boxShadow: '0 12px 35px rgba(212, 91, 8, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.75px', color: 'var(--primary)' }}>
                  The CareerKinetic Standard
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', background: 'rgba(212, 91, 8, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                Engineered for Offers
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.6rem' }}>
              How Our Students Clear High-Bar Technical Loops
            </h3>
            <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              We simulate real engineering departments. You build production-grade distributed architectures and defend them orally:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                    Weekly Unassisted Whiteboard Defenses
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    Step up to the whiteboard to explain your architecture trade-offs, caching decisions, and failure modes without AI or notes.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                    Zero Toy Apps: 4 Enterprise Reference Systems
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    Construct real-time event streaming pipelines, Kafka event meshes, API gateways, and GraphRAG architectures with real telemetry.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 0.25rem 0' }}>
                    1-on-1 Guidance from Principal Practitioners
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    Get your code reviewed line-by-line by senior tech mentors from high-scale tech firms to calibrate your hiring bar.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button 
                onClick={() => onPageChange(isLoggedIn ? 'test' : 'login')}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  borderRadius: '9999px', 
                  padding: '0.85rem', 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px'
                }}
              >
                Evaluate Your Technical Readiness <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Unified Programs & Learning Paths Section with Interactive Toggle */}
      <div className="fade-in-up delay-3" style={{ marginTop: '5rem', marginBottom: '3rem' }}>
        
        {/* Modern Anchored Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '0.35rem 0.95rem', 
            borderRadius: '9999px', 
            background: 'rgba(212, 91, 8, 0.08)', 
            border: '1px solid rgba(212, 91, 8, 0.2)', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary)', 
            letterSpacing: '0.8px', 
            textTransform: 'uppercase',
            marginBottom: '0.9rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
            Curriculum & Specialized Tracks
          </div>

          <h2 style={{ 
            fontSize: 'clamp(1.85rem, 3.8vw, 2.5rem)', 
            fontWeight: 800, 
            color: 'var(--foreground)', 
            letterSpacing: '-0.6px', 
            margin: '0 auto 0.75rem auto',
            maxWidth: '750px',
            lineHeight: 1.2
          }}>
            Engineered for Architectural Depth
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--muted-foreground)', 
            maxWidth: '640px', 
            margin: '0 auto 2.25rem auto', 
            lineHeight: 1.6 
          }}>
            Master production systems through unassisted code defenses or self-guided milestone trees—both calibrated against top-tier engineering bars.
          </p>

          {/* Integrated Segmented Control */}
          <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <div className="track-segmented-control">
              <button
                onClick={() => setActiveTab('roadmaps')}
                className={`track-segmented-btn ${activeTab === 'roadmaps' ? 'active' : ''}`}
              >
                <Compass size={16} />
                <span>Self-Guided Roadmaps</span>
                <span className="track-pill-count">2 Tracks</span>
              </button>

              <button
                onClick={() => setActiveTab('cohorts')}
                className={`track-segmented-btn ${activeTab === 'cohorts' ? 'active' : ''}`}
              >
                <Users size={16} />
                <span>Mentorship Cohorts</span>
                <span className="track-pill-count highlight">Live 1-on-1</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Interactive Roadmaps */}
        {activeTab === 'roadmaps' && (
          <div key="roadmaps" className="fade-in bento-grid">
            {roadmaps.map((map) => {
              const isAi = map.id === 'aiml';
              return (
                <div 
                  key={map.id} 
                  className="bento-track-card"
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '12px', 
                      background: isAi ? 'rgba(212, 91, 8, 0.08)' : 'rgba(56, 189, 248, 0.08)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: isAi ? '1px solid rgba(212, 91, 8, 0.22)' : '1px solid rgba(56, 189, 248, 0.25)' 
                    }}>
                      {isAi ? (
                        <Sparkles size={22} style={{ color: 'var(--primary)' }} />
                      ) : (
                        <Terminal size={22} style={{ color: '#0284c7' }} />
                      )}
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
                      Self-Guided Tree
                    </span>
                  </div>

                  {/* Title & Description */}
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
                    {map.desc}
                  </p>

                  {/* Key Architectural Domains (Clean Tag Alignment) */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.8px', 
                      color: '#94a3b8', 
                      marginBottom: '0.75rem' 
                    }}>
                      Key Architectural Domains
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {map.topics.map((topic, tIdx) => (
                        <span key={tIdx} className="bento-tag">
                          <span className="bento-tag-dot" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subtle Action Link (Ghost Action Row) */}
                  <div 
                    style={{ 
                      marginTop: 'auto', 
                      paddingTop: '1.25rem', 
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                      Interactive visual tree
                    </span>
                    <button 
                      onClick={() => handleExploreRoadmap(map.id)} 
                      className="bento-ghost-btn"
                    >
                      <span>Explore Roadmap</span>
                      <ArrowRight size={15} className="bento-arrow" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Mentorship Cohorts */}
        {activeTab === 'cohorts' && (
          <div key="cohorts" className="fade-in bento-grid">
            {cohorts.map((cohort) => {
              const isAi = cohort.id === 'aiml';
              return (
                <div 
                  key={cohort.id} 
                  className="bento-track-card"
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '12px', 
                      background: isAi ? 'rgba(212, 91, 8, 0.08)' : 'rgba(56, 189, 248, 0.08)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      border: isAi ? '1px solid rgba(212, 91, 8, 0.22)' : '1px solid rgba(56, 189, 248, 0.25)' 
                    }}>
                      <Users size={22} style={{ color: isAi ? 'var(--primary)' : '#0284c7' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.74rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        padding: '0.35rem 0.8rem', 
                        borderRadius: '9999px', 
                        background: cohort.badgeBg, 
                        color: cohort.badgeColor,
                        border: `1px solid ${cohort.badgeColor}40`
                      }}>
                        {cohort.badge}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} />
                        {cohort.duration}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 style={{ 
                    color: 'var(--foreground)', 
                    fontSize: '1.35rem', 
                    fontWeight: 700, 
                    lineHeight: 1.3,
                    letterSpacing: '-0.3px',
                    marginBottom: '0.75rem' 
                  }}>
                    {cohort.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.92rem', 
                    color: 'var(--muted-foreground)', 
                    lineHeight: 1.6, 
                    marginBottom: '1.5rem' 
                  }}>
                    {cohort.desc}
                  </p>

                  {/* Deliverables / Highlights */}
                  <div style={{ 
                    marginBottom: '1.75rem', 
                    background: 'rgba(248, 250, 252, 0.85)', 
                    padding: '1.25rem', 
                    borderRadius: '14px', 
                    border: '1px solid var(--border)' 
                  }}>
                    <div style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.8px', 
                      color: '#94a3b8', 
                      marginBottom: '0.75rem' 
                    }}>
                      Core Cohort Deliverables
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {cohort.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', color: 'var(--foreground)', fontWeight: 500 }}>
                          <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtle Action Link (Ghost Action Row) */}
                  <div 
                    style={{ 
                      marginTop: 'auto', 
                      paddingTop: '1.25rem', 
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
                      Weekly whiteboard defenses
                    </span>
                    <button 
                      onClick={() => onPageChange(isLoggedIn ? 'mentorship' : 'login')} 
                      className="bento-ghost-btn"
                    >
                      <span>Apply for Mentorship</span>
                      <ArrowRight size={15} className="bento-arrow" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
