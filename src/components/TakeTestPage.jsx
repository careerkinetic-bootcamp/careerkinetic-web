import React, { useState } from 'react';
import axios from 'axios';
import { 
  Brain, Trophy, Sparkles, BookOpen, ArrowRight, CheckCircle2, XCircle, 
  RotateCcw, Info, ChevronDown, ChevronUp, Award, BookMarked, 
  LineChart, MessageSquare, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QUESTIONS, determineRecommendation } from './assessmentData';

const TakeTestPage = ({ onPageChange }) => {
  const { isLoggedIn, user, token, refreshUser } = useAuth();
  
  // Test states: 'welcome' | 'quiz' | 'results'
  const [testState, setTestState] = useState('welcome');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [submittedResult, setSubmittedResult] = useState(null);
  
  // UI states
  const [showReview, setShowReview] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ loading: false, success: false, error: '' });

  // 1. Restrict test to logged in users only
  if (!isLoggedIn) {
    return (
      <div className="glass-panel fade-in-up" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: 'var(--secondary)', padding: '1rem', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={48} style={{ color: 'var(--primary)' }} />
        </div>
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Login Required</h2>
        <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Please log in to your CareerKinetic student account to take the Domain Discovery Test and unlock customized course recommendations.
        </p>
        <button 
          onClick={() => onPageChange && onPageChange('login')}
          className="btn btn-primary"
          style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', borderRadius: '12px', marginTop: '1rem' }}
        >
          Sign In Now <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    );
  }

  // Derive latest result: local submitted state, fallback to cloud profile
  const latestResult = submittedResult || user?.profile_data?.assessmentResult || null;

  // Track attempts from profile_data
  const attempts = user?.profile_data?.assessmentAttempts || (user?.profile_data?.assessmentResult ? 1 : 0);
  const isAdmin = user?.email === 'careerkinetic27@gmail.com';
  const isMaxAttemptsExhausted = !isAdmin && attempts >= 3;

  const activeQuestion = QUESTIONS[currentIdx];

  const handleSelectOption = (optionIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIdx] = optionIndex;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    // Count correctness per category
    const categoryScores = { coding: 0, communication: 0, logic: 0, math: 0 };
    
    QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        categoryScores[q.category] += 1;
      }
    });

    const recommendedPath = determineRecommendation(categoryScores);
    const totalCorrect = Object.values(categoryScores).reduce((sum, val) => sum + val, 0);

    const resultObj = {
      recommendedCourse: recommendedPath === 'aiml' ? 'AI & Machine Learning' : 'Backend Engineering',
      recommendedKey: recommendedPath, // 'aiml' or 'se'
      scores: categoryScores,
      totalCorrect,
      totalQuestions: QUESTIONS.length,
      timestamp: new Date().toISOString()
    };

    setSubmittedResult(resultObj); // Update local state immediately to render Results
    setTestState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync to user profile backend
    await syncResultsToCloud(resultObj);
  };

  const syncResultsToCloud = async (resultData) => {
    setSyncStatus({ loading: true, success: false, error: '' });
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || '';
      const API_URL = `${BASE_URL ? BASE_URL.replace(/\/$/, '') : ''}/api/auth/profile`;
      
      const currentProfileData = user?.profile_data || {};
      const currentAttempts = currentProfileData.assessmentAttempts || (currentProfileData.assessmentResult ? 1 : 0);
      
      const updatedProfileData = {
        ...currentProfileData,
        assessmentAttempts: currentAttempts + 1,
        assessmentResult: resultData
      };

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await axios.put(API_URL, { profile_data: updatedProfileData }, {
        headers
      });
      
      await refreshUser();
      setSyncStatus({ loading: false, success: true, error: '' });
    } catch (e) {
      console.error('Failed to sync assessment results:', e);
      setSyncStatus({ 
        loading: false, 
        success: false, 
        error: e.response?.data?.detail || 'Failed to sync results to profile.' 
      });
    }
  };

  const handleRetake = () => {
    if (isMaxAttemptsExhausted) {
      alert("You have exhausted your maximum of 3 attempts. Additional attempts are not permitted.");
      return;
    }
    setUserAnswers(Array(QUESTIONS.length).fill(null));
    setSubmittedResult(null);
    setCurrentIdx(0);
    setShowReview(false);
    setSyncStatus({ loading: false, success: false, error: '' });
    setTestState('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for displaying category details
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'coding':
        return { name: 'Coding Skills', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'communication':
        return { name: 'Communication', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'logic':
        return { name: 'Logic & Reasoning', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'math':
        return { name: 'Mathematics', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' };
      default:
        return { name: cat, color: 'var(--primary)', bg: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  return (
    <div className="courses-page fade-in-up delay-1" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* ---------------- WELCOME STATE ---------------- */}
      {testState === 'welcome' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Card */}
          <div className="courses-header glass-panel fade-in-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--secondary)', padding: '0.75rem', borderRadius: '12px' }}>
                <Brain size={32} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h1 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: 0 }}>Domain Discovery Test</h1>
                <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>Find your ideal engineering course track in just 10 minutes.</p>
              </div>
            </div>
          </div>

          {/* Info Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookMarked size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Test Structure</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                This is a very basic evaluation containing **20 simple multiple-choice questions** tailored for entry-level B.Tech college students:
              </p>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>Mathematics (5 Qs)</strong>: Core school math, percentage, algebra, averages.</li>
                <li><strong>Logic & Reasoning (5 Qs)</strong>: Series patterns, direction sense, simple logic.</li>
                <li><strong>Coding Fundamentals (5 Qs)</strong>: Loop basic, array, variables.</li>
                <li><strong>Communication Skills (5 Qs)</strong>: Teamwork, active listening, written rules.</li>
              </ul>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={22} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Path Matching Rules</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                Our course suggestion rules are simple and helpful:
              </p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ background: '#a855f7', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>AI/ML</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    If you score <strong>&ge; 60% (3/5)</strong> in Mathematics <strong>AND</strong> <strong>&ge; 60% (3/5)</strong> in Logic & Reasoning, we recommend the <strong>AI & Machine Learning</strong> track.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ background: '#3b82f6', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>SOFTWARE</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    Otherwise, by default, we recommend the <strong>Backend Engineering</strong> track to build programming fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Past Result Summary (If Available) */}
          {latestResult && (
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(138, 43, 226, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={20} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ margin: 0 }}>Your Latest Test Result</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Attempts: {isAdmin ? `${attempts} (Admin - Unlimited)` : `${attempts} / 3`}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Taken on: {new Date(latestResult.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>RECOMMENDED PATHWAY:</div>
                  <div className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '0.2rem 0' }}>
                    {latestResult.recommendedCourse}
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                    {latestResult.recommendedKey === 'aiml' 
                      ? 'Qualified for AI/ML based on strong Math and Logic scores.'
                      : 'Backend Engineering recommended to strengthen logic and code fundamentals.'
                    }
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', minWidth: '260px' }}>
                  {Object.entries(latestResult.scores || {}).map(([cat, val]) => {
                    const meta = getCategoryMeta(cat);
                    return (
                      <div key={cat} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{meta.name.split(' ')[0]}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: meta.color }}>{val}/5</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                {isMaxAttemptsExhausted && (
                  <span style={{ color: '#f43f5e', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertCircle size={16} /> Max attempt limit (3/3) reached. You cannot retake this test.
                  </span>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {latestResult.recommendedKey && onPageChange && (
                    <button 
                      onClick={() => onPageChange('courses')} 
                      className="btn btn-primary"
                      style={{ borderRadius: '8px', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      Go to Recommended Courses <ArrowRight size={14} style={{ marginLeft: '0.5rem' }} />
                    </button>
                  )}
                  <button 
                    onClick={handleRetake} 
                    disabled={isMaxAttemptsExhausted}
                    className="btn btn-outline"
                    style={{ 
                      borderRadius: '8px', 
                      padding: '0.6rem 1.5rem', 
                      fontSize: '0.9rem',
                      opacity: isMaxAttemptsExhausted ? 0.5 : 1,
                      cursor: isMaxAttemptsExhausted ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <RotateCcw size={14} style={{ marginRight: '0.5rem' }} /> Retake Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger - Only show if test has NEVER been taken */}
          {!latestResult && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button 
                onClick={() => {
                  setUserAnswers(Array(QUESTIONS.length).fill(null));
                  setCurrentIdx(0);
                  setTestState('quiz');
                }} 
                className="btn btn-primary" 
                style={{ padding: '1rem 3rem', fontSize: '1.15rem', borderRadius: '14px', gap: '0.75rem', boxShadow: 'var(--shadow-glow)' }}
              >
                Start Domain Discovery Test <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ---------------- QUIZ STATE ---------------- */}
      {testState === 'quiz' && (
        <div className="glass-panel" style={{ padding: 'clamp(1.2rem, 4vw, 2.5rem)', minHeight: '450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Progress & Categories Header */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ 
                fontSize: '0.9rem', 
                background: getCategoryMeta(activeQuestion.category).bg, 
                color: getCategoryMeta(activeQuestion.category).color, 
                padding: '0.3rem 0.8rem', 
                borderRadius: '20px', 
                fontWeight: 'bold', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {activeQuestion.categoryLabel}
              </span>
              <span className="text-muted" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                Question <strong>{currentIdx + 1}</strong> of <strong>{QUESTIONS.length}</strong>
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden', display: 'flex', gap: '2px' }}>
              {QUESTIONS.map((q, idx) => {
                let segmentColor = 'var(--border)';
                if (idx === currentIdx) {
                  segmentColor = 'var(--primary)';
                } else if (userAnswers[idx] !== null) {
                  segmentColor = getCategoryMeta(q.category).color;
                }
                return (
                  <div 
                    key={q.id} 
                    style={{ 
                      flex: 1, 
                      background: segmentColor, 
                      transition: 'background 0.3s ease',
                      height: '100%' 
                    }} 
                  />
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div style={{ marginTop: '0.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)', color: 'var(--text-main)', lineHeight: 1.4, fontWeight: 600 }}>
              {activeQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeQuestion.options.map((option, optionIdx) => {
              const isSelected = userAnswers[currentIdx] === optionIdx;
              return (
                <div 
                  key={optionIdx}
                  onClick={() => handleSelectOption(optionIdx)}
                  style={{
                    background: isSelected ? 'rgba(138, 43, 226, 0.1)' : 'var(--bg-dark)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    padding: '1.1rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    boxShadow: isSelected ? '0 0 15px var(--primary-glow)' : 'none',
                    transform: isSelected ? 'translateY(-1px)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.background = 'var(--bg-dark)';
                    }
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid var(--primary)' : '2px solid var(--text-muted)',
                    background: isSelected ? 'var(--text-main)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }} />
                  <span style={{ fontSize: '1.05rem', color: isSelected ? 'white' : 'var(--text-muted)', fontWeight: isSelected ? 600 : 400 }}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="btn btn-outline"
              style={{
                borderRadius: '8px',
                padding: '0.6rem 1.5rem',
                fontSize: '0.95rem',
                opacity: currentIdx === 0 ? 0.4 : 1,
                cursor: currentIdx === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Back
            </button>

            {currentIdx < QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={userAnswers[currentIdx] === null}
                className="btn btn-primary"
                style={{
                  borderRadius: '8px',
                  padding: '0.6rem 1.8rem',
                  fontSize: '0.95rem',
                  opacity: userAnswers[currentIdx] === null ? 0.5 : 1,
                  cursor: userAnswers[currentIdx] === null ? 'not-allowed' : 'pointer'
                }}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={userAnswers[currentIdx] === null}
                className="btn btn-primary"
                style={{
                  borderRadius: '8px',
                  padding: '0.6rem 2rem',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, var(--accent), var(--primary))',
                  boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
                  opacity: userAnswers[currentIdx] === null ? 0.5 : 1,
                  cursor: userAnswers[currentIdx] === null ? 'not-allowed' : 'pointer'
                }}
              >
                Finish Assessment
              </button>
            )}
          </div>

        </div>
      )}

      {/* ---------------- RESULTS STATE ---------------- */}
      {testState === 'results' && latestResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Verdict Banner Card */}
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-primary)', opacity: 0.05, pointerEvents: 'none' }}></div>
            
            <Trophy size={48} style={{ color: 'var(--primary)', marginBottom: '1rem', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }} />
            
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <span>Your Recommended Pathway</span>
              <span>&bull;</span>
              <span>Attempts: {isAdmin ? `${attempts} (Admin)` : `${attempts} / 3`}</span>
            </div>
            
            <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', margin: '0.5rem 0 1rem 0', fontWeight: 'bold' }}>
              {latestResult.recommendedCourse} Course Track
            </h1>

            <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto 1.5rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {latestResult.recommendedKey === 'aiml' ? (
                <span>
                  Excellent! You scored <strong>{latestResult.scores.math}/5 ({(latestResult.scores.math * 20)}%)</strong> in Math and <strong>{latestResult.scores.logic}/5 ({(latestResult.scores.logic * 20)}%)</strong> in Logic & Reasoning. This qualifies you for the <strong>AI & Machine Learning</strong> program, highlighting strong analytical aptitude.
                </span>
              ) : (
                <span>
                  Welcome to your coding journey! Based on your scores, we recommend starting with our <strong>Backend Engineering</strong> course. This course is designed to build your foundational programming, syntax logic, and collaborative skills from the ground up, setting a strong base.
                </span>
              )}
            </p>

            {/* Sync Alert */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: syncStatus.success ? '#10b981' : '#f59e0b' }}>
              {syncStatus.loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Syncing results to your CareerKinetic profile...</span>
                </>
              ) : syncStatus.success ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Synced with your student profile.</span>
                </>
              ) : syncStatus.error ? (
                <>
                  <AlertCircle size={14} style={{ color: '#f43f5e' }} />
                  <span style={{ color: '#f43f5e' }}>{syncStatus.error}</span>
                  <button onClick={() => syncResultsToCloud(latestResult)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: 'inherit' }}>Retry Sync</button>
                </>
              ) : null}
            </div>
          </div>

          {/* Category Scores Breakdown */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LineChart size={20} style={{ color: 'var(--primary)' }} />
              Category Score Breakdown
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(latestResult.scores).map(([categoryKey, score]) => {
                const meta = getCategoryMeta(categoryKey);
                const percent = (score / 5) * 100;
                
                // Eligibility Highlight
                let passFlag = null;
                if (categoryKey === 'math' || categoryKey === 'logic') {
                  const passed = score >= 3;
                  passFlag = (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                      color: passed ? '#10b981' : 'var(--text-muted)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      {passed ? 'AI/ML Eligible (≥60%)' : 'Below AI/ML Bar (<60%)'}
                    </span>
                  );
                }

                return (
                  <div key={categoryKey} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{meta.name}</span>
                      <span style={{ fontWeight: 'bold', color: meta.color, fontSize: '1.1rem' }}>{score}/5</span>
                    </div>
                    
                    {/* Custom progress bar */}
                    <div style={{ height: '6px', background: 'var(--secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: meta.color }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Score: {percent}%</span>
                      {passFlag}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Links & Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            {isMaxAttemptsExhausted && (
              <span style={{ color: '#f43f5e', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertCircle size={16} /> Max attempt limit (3/3) reached. You cannot retake this test.
              </span>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {onPageChange && (
                <button 
                  onClick={() => onPageChange('courses')} 
                  className="btn btn-primary"
                  style={{ padding: '0.875rem 2.5rem', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center', boxShadow: 'var(--shadow-glow)' }}
                >
                  Enroll in Recommended Course <ArrowRight size={18} />
                </button>
              )}
              
              <button 
                onClick={handleRetake} 
                disabled={isMaxAttemptsExhausted}
                className="btn btn-outline"
                style={{ 
                  padding: '0.875rem 2rem', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'center',
                  opacity: isMaxAttemptsExhausted ? 0.5 : 1,
                  cursor: isMaxAttemptsExhausted ? 'not-allowed' : 'pointer'
                }}
              >
                <RotateCcw size={16} /> Retake Assessment
              </button>
            </div>
          </div>

          {/* Question Review Accordion */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <button 
              onClick={() => setShowReview(!showReview)}
              style={{ 
                width: '100%', 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '0.5rem 0',
                outline: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Review Questions & Explanations</h3>
              </div>
              {showReview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showReview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                {QUESTIONS.map((q, idx) => {
                  const userAnswerIdx = userAnswers[idx];
                  const isCorrect = userAnswerIdx === q.correctIndex;
                  const meta = getCategoryMeta(q.category);

                  return (
                    <div key={q.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', background: meta.bg, color: meta.color, padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>
                          Question {idx + 1} &bull; {meta.name}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                          {isCorrect ? (
                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                              <CheckCircle2 size={16} /> Correct
                            </span>
                          ) : (
                            <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                              <XCircle size={16} /> Incorrect
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', margin: '0 0 1rem 0', fontWeight: 600, color: 'var(--text-light)' }}>
                        {q.question}
                      </h4>

                      {/* Display options */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                        {q.options.map((opt, optIdx) => {
                          let optStyle = {
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.15)',
                            color: 'var(--text-muted)'
                          };

                          if (optIdx === q.correctIndex) {
                            optStyle.border = '1px solid #10b981';
                            optStyle.background = 'rgba(16, 185, 129, 0.08)';
                            optStyle.color = '#10b981';
                          } else if (optIdx === userAnswerIdx) {
                            optStyle.border = '1px solid #f43f5e';
                            optStyle.background = 'rgba(244, 63, 94, 0.08)';
                            optStyle.color = '#f43f5e';
                          }

                          return (
                            <div key={optIdx} style={optStyle}>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: `3px solid ${meta.color}`, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>Explanation:</span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default TakeTestPage;
