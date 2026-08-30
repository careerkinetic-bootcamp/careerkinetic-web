import React, { useState } from 'react';
import { Brain, Terminal, Users, Sparkles, CheckCircle2, ArrowRight, Shield, Award, Clock, Calendar, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CoursesPage.css';

const MENTORSHIP_COHORTS = [
  {
    id: 'aiml',
    title: 'AI & Machine Learning Mentorship Cohort',
    badge: 'Advanced MLOps & GenAI',
    subtitle: 'Out-of-Core Data Architecture, Math & Agentic MLOps',
    description: 'Master enterprise AI engineering with 1-on-1 guidance from senior ML practitioners. Build and defend 5 production blueprints and 30 HLD case studies.',
    duration: '16 Weeks Intensive',
    schedule: '1.5 - 2 Hours / Day • 5 Days / Week',
    icon: Brain,
    gradient: 'linear-gradient(135deg, oklch(0.7 0.22 295 / 0.25), oklch(0.72 0.22 330 / 0.25))',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    badgeBorder: 'rgba(236, 72, 153, 0.3)',
    badgeColor: '#f472b6',
    highlights: [
      'Dedicated 1-on-1 Senior AI/ML Mentor',
      '5 Signature Production Blueprints (GraphRAG, Multi-Agent Mesh, ViT)',
      '30 Whiteboard High-Level Design (HLD) Global Case Studies',
      'Weekly Live Code & Tensor Architecture Reviews',
      'Oral Whiteboard Defense & Resume Calibration'
    ]
  },
  {
    id: 'swe',
    title: 'Software Engineering (SWE) Mentorship Cohort',
    badge: 'Production Backend & Distributed Systems',
    subtitle: 'Production Resilience, Software Observability & Post-AI Code Inspection',
    description: 'Master high-concurrency backend architecture with 1-on-1 mentoring. Construct 4 reference systems, analyze distributed trade-offs, and defend 30 HLD scenarios.',
    duration: '16 Weeks Intensive',
    schedule: '1.5 - 2 Hours / Day • 5 Days / Week',
    icon: Terminal,
    gradient: 'linear-gradient(135deg, oklch(0.58 0.22 295 / 0.25), oklch(0.41 0.15 240 / 0.25))',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeBorder: 'rgba(99, 102, 241, 0.3)',
    badgeColor: '#818cf8',
    highlights: [
      'Dedicated 1-on-1 Principal Backend Mentor',
      '4 Core Workspace Reference Systems (E-Commerce, MS Teams, GitHub Mesh, ChatGPT Gateway)',
      '30 Enterprise Distributed Systems HLD Case Studies',
      'Live Profiling (cProfile, memory leaks, high-concurrency stress testing)',
      'System Architecture Oral Defense & Mock Technical Interviews'
    ]
  }
];

const MentorshipPage = ({ onPageChange = () => {} }) => {
  const { isLoggedIn } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleApply = (cohort) => {
    setSelectedCohort(cohort);
    setApplicationSubmitted(false);
  };

  const submitApplication = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
  };

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingBottom: '4rem' }}>
      
      {/* Header Banner */}
      <div className="courses-header glass-panel fade-in-up delay-2" style={{ marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Users size={22} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px' }}>
              Elite 1-on-1 Coaching
            </span>
          </div>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
            1-on-1 Industry Mentorship & Live Defense
          </h1>
          <p className="text-muted" style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Accelerate your engineering journey with structured mentorship, weekly unassisted code defenses, live architectural reviews, and production-grade project execution.
          </p>
        </div>
      </div>

      {/* Value Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Users size={22} style={{ color: '#818cf8' }} />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--foreground)', marginBottom: '0.4rem' }}>1-on-1 Senior Mentors</h3>
          <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
            Paired directly with principal engineers from Tier-1 tech firms for weekly personalized code reviews.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Award size={22} style={{ color: '#f472b6' }} />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--foreground)', marginBottom: '0.4rem' }}>Whiteboard Code Defenses</h3>
          <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
            Unassisted oral evaluations at the whiteboard to defend your architectural decisions and system trade-offs.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Shield size={22} style={{ color: '#10b981' }} />
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--foreground)', marginBottom: '0.4rem' }}>Mock FAANG Interviews</h3>
          <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
            Rigorous technical interviews and resume calibrations to prepare you for high-bar hiring loops.
          </p>
        </div>
      </div>

      {/* Cohorts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {MENTORSHIP_COHORTS.map((cohort) => {
          const Icon = cohort.icon;

          return (
            <div
              key={cohort.id}
              className="course-card glass-panel fade-in-up"
              style={{
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '0'
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: cohort.gradient,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  <Icon size={30} style={{ color: cohort.badgeColor }} />
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '9999px',
                      background: cohort.badgeBg,
                      border: `1px solid ${cohort.badgeBorder}`,
                      color: cohort.badgeColor
                    }}
                  >
                    {cohort.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} />
                    {cohort.duration}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--foreground)', margin: '0.25rem 0 0.5rem 0' }}>
                  {cohort.title}
                </h2>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {cohort.description}
                </p>

                <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--foreground)', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                    What You Get in Mentorship:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {cohort.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.86rem', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
                        <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '140px', borderRadius: '9999px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}
                    onClick={() => handleApply(cohort)}
                  >
                    Apply for Mentorship
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ borderRadius: '9999px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                    onClick={() => onPageChange('roadmaps', cohort.id)}
                  >
                    View Roadmap <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Application Modal */}
      {selectedCohort && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div className="glass-panel fade-in-up" style={{ maxWidth: '520px', width: '100%', padding: '2.25rem', borderRadius: '20px', position: 'relative', border: '1px solid var(--border)', background: 'var(--card)' }}>
            <button 
              onClick={() => setSelectedCohort(null)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {applicationSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle2 size={32} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Application Received!</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Thank you for applying to the <strong>{selectedCohort.title}</strong>. Our senior mentor team will reach out within 24 hours to schedule your 1-on-1 onboarding call.
                </p>
                <button className="btn btn-primary" style={{ borderRadius: '9999px', width: '100%' }} onClick={() => setSelectedCohort(null)}>
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Apply for 1-on-1 Mentorship</h3>
                <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>Cohort: <strong>{selectedCohort.title}</strong></p>

                <form onSubmit={submitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '0.4rem', fontWeight: 500 }}>Your Full Name</label>
                    <input type="text" required placeholder="John Doe" className="form-control" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '0.4rem', fontWeight: 500 }}>Email Address</label>
                    <input type="email" required placeholder="john@example.com" className="form-control" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '0.4rem', fontWeight: 500 }}>Current Experience Level</label>
                    <select className="form-control" style={{ width: '100%' }}>
                      <option>Student / Fresher</option>
                      <option>Junior Software Engineer (1-2 yrs)</option>
                      <option>Mid-Level Engineer (3-5 yrs)</option>
                      <option>Career Transitioning into Tech</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', borderRadius: '9999px', padding: '0.75rem' }}>
                    Submit Application →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MentorshipPage;
