import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Brain, Terminal, Users, Sparkles, CheckCircle2, ArrowRight, Shield, Award, Clock, Calendar, MessageSquare, X, Layers, CreditCard, PhoneCall, AlertCircle, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SWE_CURRICULUM } from '../data/sweRoadmap';
import { AIML_CURRICULUM } from '../data/aimlRoadmap';
import PaymentButton from './PaymentButton';
import './CoursesPage.css';

const MENTORSHIP_COHORTS = [
  {
    id: 'aiml',
    title: 'AI & Machine Learning Cohort',
    badge: 'Advanced MLOps & GenAI',
    subtitle: 'Out-of-Core Data Architecture, Math & Agentic MLOps',
    description: 'Master enterprise AI engineering with 1-on-1 guidance from senior ML practitioners. Build and defend 5 production blueprints and 30 HLD case studies.',
    duration: '8 Months Bootcamp',
    schedule: '1.5 - 2 Hours / Day • 5 Days / Week',
    priceFull: 49999,
    priceMonthly: 6999,
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
    title: 'Software Engineering (SWE) Cohort',
    badge: 'Production Backend & Distributed Systems',
    subtitle: 'Production Resilience, Software Observability & Post-AI Code Inspection',
    description: 'Master high-concurrency backend architecture with 1-on-1 mentoring. Construct 4 reference systems, analyze distributed trade-offs, and defend 30 HLD scenarios.',
    duration: '8 Months Bootcamp',
    schedule: '1.5 - 2 Hours / Day • 5 Days / Week',
    priceFull: 39999,
    priceMonthly: 5499,
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

// Validation helpers for phone & email
const cleanPhoneDigits = (raw = '') => raw.replace(/\D/g, '');
const isValidPhone = (raw = '') => {
  const digits = cleanPhoneDigits(raw);
  // Valid Indian 10-digit mobile (starting with 6-9) or with 91 prefix (12 digits)
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return true;
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) return true;
  return false;
};
const isValidEmail = (email = '') => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const MentorshipPage = ({ onPageChange = () => {} }) => {
  const { user, isLoggedIn, refreshUser, resetDemoPurchases } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [modalMode, setModalMode] = useState('buy'); // 'buy' | 'callback'
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [activeProjectTab, setActiveProjectTab] = useState('swe');
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState('');

  const enrolledCohorts = user?.profile_data?.enrolled_cohorts || [];
  const isEnrolled = (cohortId) => enrolledCohorts.includes(cohortId?.toLowerCase());

  const handleResetDemoPurchases = async () => {
    if (isResetting) return;
    setIsResetting(true);
    setResetNotice('');
    try {
      if (resetDemoPurchases) {
        await resetDemoPurchases();
      } else {
        await refreshUser();
      }
      setResetNotice('✓ Demo enrollments reset! Both courses are ready to Buy Now again.');
      setTimeout(() => setResetNotice(''), 5000);
    } catch (err) {
      console.error(err);
      setResetNotice('Failed to reset demo purchases.');
      setTimeout(() => setResetNotice(''), 5000);
    } finally {
      setIsResetting(false);
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    paymentPlan: 'Full Tuition (Instant Seat Access)',
    preferredTime: 'Evening (6:00 PM - 9:00 PM)',
    experience: 'Student / Fresher'
  });

  // Lock background scroll when modal is open
  useEffect(() => {
    if (selectedCohort) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCohort]);

  const handleBuyNow = (cohort) => {
    if (isEnrolled(cohort.id)) {
      return;
    }
    setSelectedCohort(cohort);
    setModalMode('buy');
    setIsSubmitted(false);
    setPaymentDetails(null);
    setPaymentError('');
    setFormData({
      fullName: user?.profile_data?.fullName || user?.full_name || user?.name || '',
      email: user?.email || '',
      phone: '',
      paymentPlan: 'Full Tuition (Instant Seat Access)',
      preferredTime: 'Evening (6:00 PM - 9:00 PM)',
      experience: 'Student / Fresher'
    });
  };

  const handleRequestCallback = (cohort) => {
    setSelectedCohort(cohort);
    setModalMode('callback');
    setIsSubmitted(false);
    setPaymentDetails(null);
    setPaymentError('');
    setFormData({
      fullName: user?.profile_data?.fullName || user?.full_name || user?.name || '',
      email: user?.email || '',
      phone: '',
      paymentPlan: 'Full Tuition (Instant Seat Access)',
      preferredTime: 'Evening (6:00 PM - 9:00 PM)',
      experience: 'Student / Fresher'
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="glass-panel fade-in-up" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={48} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Login Required</h2>
        <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Please log in to your CareerKinetic account to access 1-on-1 industry mentorship cohorts, code defense sessions, and application reviews.
        </p>
        <button 
          onClick={() => onPageChange && onPageChange('login')}
          className="btn btn-primary"
          style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', borderRadius: '12px', marginTop: '1rem' }}
        >
          Sign In to Access Mentorship <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    );
  }

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
          <h3 style={{ fontSize: '1.15rem', color: 'var(--foreground)', marginBottom: '0.4rem' }}>Mock Technical Interviews</h3>
          <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
            Rigorous technical interviews and resume calibrations to prepare you for high-bar hiring loops.
          </p>
        </div>
      </div>

      {/* Production Projects / Enterprise Systems Showcase */}
      <div className="fade-in-up" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
            <Shield size={16} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Real Enterprise Architectures • Zero Toy Apps
            </span>
          </div>
          <h2 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '0 0 0.75rem 0', fontWeight: 800 }}>
            Systems You Will Build & Orally Defend
          </h2>
          <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            Every cohort student constructs these production-grade systems from reference wireframes to deployment, profiling memory bounds and orally defending architectural trade-offs at the whiteboard.
          </p>
        </div>

        {/* Project Track Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
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
              onClick={() => setActiveProjectTab('swe')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.6rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeProjectTab === 'swe' ? 'var(--primary)' : 'transparent',
                color: activeProjectTab === 'swe' ? '#fff' : 'var(--muted-foreground)',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeProjectTab === 'swe' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              <Terminal size={17} />
              Backend & Distributed Systems
              <span style={{ fontSize: '0.72rem', opacity: 0.9, background: activeProjectTab === 'swe' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '10px', marginLeft: '4px' }}>
                4 Systems
              </span>
            </button>

            <button
              onClick={() => setActiveProjectTab('aiml')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.6rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeProjectTab === 'aiml' ? 'var(--primary)' : 'transparent',
                color: activeProjectTab === 'aiml' ? '#fff' : 'var(--muted-foreground)',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeProjectTab === 'aiml' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              <Brain size={17} />
              AI/ML & Agentic Blueprints
              <span style={{ fontSize: '0.72rem', opacity: 0.9, background: activeProjectTab === 'aiml' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '10px', marginLeft: '4px' }}>
                5 Blueprints
              </span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div key={activeProjectTab} className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {(activeProjectTab === 'swe' ? SWE_CURRICULUM.blueprints : AIML_CURRICULUM.blueprints).map((proj, pIdx) => (
            <div 
              key={pIdx} 
              className="course-card glass-panel" 
              style={{ 
                padding: '1.75rem', 
                borderRadius: 'var(--radius-card)', 
                display: 'flex', 
                flexDirection: 'column', 
                border: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  padding: '0.3rem 0.75rem', 
                  borderRadius: '9999px', 
                  background: activeProjectTab === 'swe' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)', 
                  color: activeProjectTab === 'swe' ? '#818cf8' : '#f472b6',
                  border: `1px solid ${activeProjectTab === 'swe' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`
                }}>
                  {proj.number} • {proj.track}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={13} />
                  {proj.visualFoundation}
                </span>
              </div>

              <h3 style={{ color: 'var(--foreground)', fontSize: '1.25rem', marginBottom: '0.6rem', fontWeight: 700 }}>
                {proj.title}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.55, flex: 1 }}>
                {proj.desc}
              </p>

              {/* Tech Stack Pills */}
              <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {proj.tech.map((t, tIdx) => (
                  <span 
                    key={tIdx} 
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '6px', 
                      background: 'rgba(255, 255, 255, 0.04)', 
                      border: '1px solid rgba(255, 255, 255, 0.08)', 
                      color: 'var(--foreground)',
                      fontWeight: 500 
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Whiteboard Defense Callout */}
              <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.06)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.18)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <Shield size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.8rem', color: '#6ee7b7', lineHeight: 1.4 }}>
                  <strong>Oral Defense:</strong> Unassisted whiteboard explanation of system invariants, failure modes, and hardware trade-offs.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohorts Grid - At the bottom as the primary CTA */}
      <div className="fade-in-up" style={{ marginTop: '5rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '1rem' }}>
            <Users size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Select Your Specialization
            </span>
          </div>
          <h2 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '0 0 0.75rem 0', fontWeight: 800 }}>
            Choose Your Mentorship Cohort
          </h2>
          <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            Limited cohort seats to guarantee dedicated 1-on-1 mentor code reviews, weekly whiteboard defense, and accelerated tech placement.
          </p>
        </div>

        {/* Demo Mode Testing Banner — Only visible when logged in as Demo User */}
        {user?.email === 'dev.user@careerkinetic.com' && (
          <div 
            className="fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--foreground)' }}>
              <span>🧪 <strong>Demo Testing Mode:</strong> Logged in as Demo Student</span>
              {enrolledCohorts.length > 0 && (
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                  {enrolledCohorts.length} Cohort{enrolledCohorts.length > 1 ? 's' : ''} Enrolled
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {resetNotice && (
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                  {resetNotice}
                </span>
              )}
              <button
                type="button"
                onClick={handleResetDemoPurchases}
                disabled={isResetting}
                className="btn btn-outline"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 600,
                  cursor: isResetting ? 'not-allowed' : 'pointer'
                }}
              >
                <RotateCcw size={14} style={{ animation: isResetting ? 'spin 1s linear infinite' : 'none' }} />
                {isResetting ? 'Resetting...' : 'Reset Demo Purchases'}
              </button>
            </div>
          </div>
        )}

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

                  <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--foreground)', margin: '0.25rem 0 0.25rem 0' }}>
                    {cohort.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>
                      ₹{cohort.priceFull?.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                      or ₹{cohort.priceMonthly?.toLocaleString('en-IN')}/mo (EMI)
                    </span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {cohort.description}
                  </p>

                  <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '12px 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
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
                    {isEnrolled(cohort.id) ? (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
                        <div
                          style={{
                            flex: 1,
                            minWidth: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '0.75rem 1rem',
                            borderRadius: '9999px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            color: '#10b981',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}
                        >
                          <CheckCircle2 size={18} /> Enrolled Student
                        </div>
                        <button
                          className="btn btn-outline"
                          style={{
                            flex: 1,
                            minWidth: '140px',
                            borderRadius: '9999px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            borderColor: cohort.badgeBorder,
                            color: cohort.badgeColor
                          }}
                          onClick={() => {
                            setActiveProjectTab(cohort.id);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                        >
                          View Blueprints <ArrowRight size={15} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary"
                          style={{ 
                            flex: 1, 
                            minWidth: '135px', 
                            borderRadius: '9999px', 
                            padding: '0.75rem 1.25rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.5rem', 
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
                          }}
                          onClick={() => handleBuyNow(cohort)}
                        >
                          <CreditCard size={15} /> Buy Now
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ 
                            flex: 1, 
                            minWidth: '135px', 
                            borderRadius: '9999px', 
                            padding: '0.75rem 1.25rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.5rem', 
                            fontWeight: 600 
                          }}
                          onClick={() => handleRequestCallback(cohort)}
                        >
                          <PhoneCall size={15} /> Request CallBack
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Modal (Buy Now / Request CallBack) rendered directly to document.body via Portal */}
      {selectedCohort && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCohort(null);
          }}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0,
            bottom: 0,
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(8px)', 
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 99999, 
            padding: '1rem' 
          }}
        >
          <div 
            className="glass-panel" 
            style={{ 
              maxWidth: '520px', 
              width: '100%', 
              maxHeight: 'min(90vh, 640px)',
              overflowY: 'auto',
              padding: '1.75rem 2rem', 
              borderRadius: '20px', 
              position: 'relative', 
              border: '1px solid var(--border)', 
              background: 'var(--card)',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)'
            }}
          >
            <button 
              onClick={() => setSelectedCohort(null)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle2 size={32} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                  {modalMode === 'buy' ? '🎉 Payment & Enrollment Confirmed!' : 'CallBack Scheduled!'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {modalMode === 'buy' 
                    ? `Welcome to ${selectedCohort.title}! Your admission has been confirmed and onboarding instructions dispatched to ${formData.email || 'your email'}.` 
                    : `Thank you, ${formData.fullName || 'there'}! A senior mentor will call you at ${formData.phone || 'your phone'} during the ${formData.preferredTime} window.`}
                </p>

                {modalMode === 'buy' && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Plan:</span>
                      <strong style={{ color: 'var(--foreground)' }}>{formData.paymentPlan}</strong>
                    </div>
                    {paymentDetails?.payment_id && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-muted">Razorpay Payment ID:</span>
                        <code style={{ color: '#818cf8', fontWeight: 600 }}>{paymentDetails.payment_id}</code>
                      </div>
                    )}
                    {paymentDetails?.order_id && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-muted">Razorpay Order ID:</span>
                        <code style={{ color: 'var(--foreground)' }}>{paymentDetails.order_id}</code>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="text-muted">Status:</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>VERIFIED & CAPTURED</span>
                    </div>
                  </div>
                )}

                <button className="btn btn-primary" style={{ borderRadius: '9999px', width: '100%' }} onClick={() => setSelectedCohort(null)}>
                  Done & Close
                </button>
              </div>
            ) : modalMode === 'buy' ? (
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '0.6rem' }}>
                  <CreditCard size={13} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    Instant Seat Reservation
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--foreground)', marginBottom: '0.2rem' }}>
                  Enroll in {selectedCohort.title}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                  8 Months Bootcamp • 1-on-1 Mentor Guidance & Live Defense
                </p>

                {paymentError && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                    marginBottom: '0.75rem'
                  }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, color: '#ef4444' }} />
                    <span>{paymentError}</span>
                  </div>
                )}

                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Alex Rivera" 
                      className="form-control" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="alex@careerkinetic.dev" 
                      className="form-control" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 500 }}>Phone / WhatsApp Number</label>
                      {formData.phone && (
                        isValidPhone(formData.phone) ? (
                          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>✓ Valid Mobile</span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 500 }}>Enter 10-digit number</span>
                        )
                      )}
                    </div>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+\s-]/g, '');
                        setFormData({...formData, phone: val});
                      }}
                      placeholder="+91 98765 43210" 
                      className="form-control" 
                      style={{ 
                        width: '100%', 
                        padding: '0.65rem 0.85rem', 
                        fontSize: '0.9rem',
                        borderColor: formData.phone && !isValidPhone(formData.phone) ? '#ef4444' : undefined
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>Tuition Plan</label>
                    <select 
                      className="form-control" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                      value={formData.paymentPlan}
                      onChange={(e) => setFormData({...formData, paymentPlan: e.target.value})}
                    >
                      <option>Full Tuition (Instant Seat Access) - ₹{selectedCohort.priceFull?.toLocaleString('en-IN')}</option>
                      <option>Monthly Installments (EMI - 8 Months) - ₹{selectedCohort.priceMonthly?.toLocaleString('en-IN')}/mo</option>
                    </select>
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: '10px',
                    marginTop: '0.25rem',
                    marginBottom: '0.25rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted-foreground)', fontWeight: 600 }}>Amount Payable Now</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--foreground)' }}>
                        {formData.paymentPlan.includes('Monthly') ? '1st Month EMI' : 'Full Course Fee'}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8' }}>
                      ₹{(formData.paymentPlan.includes('Monthly') ? selectedCohort.priceMonthly : selectedCohort.priceFull)?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <PaymentButton
                    cohortId={selectedCohort.id}
                    planType={formData.paymentPlan.includes('Monthly') ? 'monthly' : 'full'}
                    amount={formData.paymentPlan.includes('Monthly') ? selectedCohort.priceMonthly : selectedCohort.priceFull}
                    title={`${selectedCohort.title} (${formData.paymentPlan.includes('Monthly') ? '1st Month EMI' : 'Full Tuition'})`}
                    userInfo={formData}
                    disabled={!formData.fullName.trim() || !isValidEmail(formData.email) || !isValidPhone(formData.phone)}
                    onSuccess={async (verifyData) => {
                      setPaymentDetails(verifyData);
                      setPaymentError('');
                      setIsSubmitted(true);
                      if (refreshUser) {
                        try {
                          await refreshUser();
                        } catch (err) {
                          console.error('User refresh error:', err);
                        }
                      }
                    }}
                    onError={(errMsg) => {
                      setPaymentError(errMsg);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.4rem', borderRadius: '9999px', padding: '0.85rem', fontWeight: 600, fontSize: '0.95rem' }}
                  />
                </form>
              </div>
            ) : (
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.6rem' }}>
                  <PhoneCall size={13} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                    1-on-1 Mentor Consultation
                  </span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--foreground)', marginBottom: '0.2rem' }}>
                  Request a Mentor CallBack
                </h3>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Cohort: <strong>{selectedCohort.title}</strong> • Direct phone discussion with admissions & faculty.
                </p>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Alex Rivera" 
                      className="form-control" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: 500 }}>Phone / WhatsApp Number</label>
                      {formData.phone && (
                        isValidPhone(formData.phone) ? (
                          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>✓ Valid Mobile</span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 500 }}>Enter 10-digit number</span>
                        )
                      )}
                    </div>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+\s-]/g, '');
                        setFormData({...formData, phone: val});
                      }}
                      placeholder="+91 98765 43210" 
                      className="form-control" 
                      style={{ 
                        width: '100%', 
                        padding: '0.65rem 0.85rem', 
                        fontSize: '0.9rem',
                        borderColor: formData.phone && !isValidPhone(formData.phone) ? '#ef4444' : undefined
                      }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>Preferred Call Time</label>
                    <select 
                      className="form-control" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                    >
                      <option>Morning (10:00 AM - 1:00 PM)</option>
                      <option>Afternoon (2:00 PM - 5:00 PM)</option>
                      <option>Evening (6:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground)', marginBottom: '0.25rem', fontWeight: 500 }}>Current Experience Level</label>
                    <select 
                      className="form-control" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    >
                      <option>Student / Fresher</option>
                      <option>Junior Software Engineer (1-2 yrs)</option>
                      <option>Mid-Level Engineer (3-5 yrs)</option>
                      <option>Career Transitioning into Tech</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={!formData.fullName.trim() || !isValidPhone(formData.phone)}
                    className="btn btn-primary" 
                    style={{ 
                      width: '100%', 
                      marginTop: '0.4rem', 
                      borderRadius: '9999px', 
                      padding: '0.75rem', 
                      fontWeight: 600,
                      opacity: (!formData.fullName.trim() || !isValidPhone(formData.phone)) ? 0.6 : 1,
                      cursor: (!formData.fullName.trim() || !isValidPhone(formData.phone)) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Request CallBack →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default MentorshipPage;
