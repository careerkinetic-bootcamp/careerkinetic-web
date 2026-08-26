import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Terminal,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Shield,
  Sparkles,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { AIML_CURRICULUM } from '../data/aimlRoadmap';
import { SWE_CURRICULUM } from '../data/sweRoadmap';
import './InteractiveRoadmapView.css';

const InteractiveRoadmapView = ({ initialTrack = 'aiml', onBack }) => {
  const [activeTrackId, setActiveTrackId] = useState(initialTrack);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [expandedParts, setExpandedParts] = useState({});
  const [completedModules, setCompletedModules] = useState({});

  // Active track data
  const currentTrack = activeTrackId === 'aiml' ? AIML_CURRICULUM : SWE_CURRICULUM;

  // Initialize expanded parts on track change
  useEffect(() => {
    const defaultExpanded = {};
    currentTrack.parts.forEach((part, index) => {
      defaultExpanded[part.id] = index === 0 || index === 1; // Open first 2 parts by default
    });
    setExpandedParts(defaultExpanded);
  }, [activeTrackId, currentTrack.parts]);

  // Load completed modules from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`careerkinetic_roadmap_progress_${activeTrackId}`);
      if (saved) {
        setCompletedModules(JSON.parse(saved));
      } else {
        setCompletedModules({});
      }
    } catch (e) {
      console.error('Failed to load roadmap progress:', e);
    }
  }, [activeTrackId]);

  // Toggle module completion status
  const toggleModuleCompletion = (moduleId) => {
    setCompletedModules((prev) => {
      const updated = { ...prev, [moduleId]: !prev[moduleId] };
      try {
        localStorage.setItem(`careerkinetic_roadmap_progress_${activeTrackId}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save roadmap progress:', e);
      }
      return updated;
    });
  };

  // Reset progress for this track
  const handleResetProgress = () => {
    if (window.confirm(`Are you sure you want to reset your progress for ${currentTrack.title}?`)) {
      setCompletedModules({});
      localStorage.removeItem(`careerkinetic_roadmap_progress_${activeTrackId}`);
    }
  };

  // Toggle part accordion expansion
  const togglePart = (partId) => {
    setExpandedParts((prev) => ({
      ...prev,
      [partId]: !prev[partId]
    }));
  };

  // Expand all / Collapse all parts
  const toggleAllParts = (expand) => {
    const updated = {};
    currentTrack.parts.forEach((part) => {
      updated[part.id] = expand;
    });
    setExpandedParts(updated);
  };

  // Calculate total progress
  const allModules = useMemo(() => {
    return currentTrack.parts.flatMap((p) => p.modules);
  }, [currentTrack.parts]);

  const completedCount = useMemo(() => {
    return allModules.filter((m) => !!completedModules[m.id]).length;
  }, [allModules, completedModules]);

  const progressPercentage = allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0;

  // Filter modules based on search and status
  const filteredParts = useMemo(() => {
    return currentTrack.parts
      .map((part) => {
        const matchingModules = part.modules.filter((mod) => {
          const matchesQuery =
            searchQuery.trim() === '' ||
            mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

          const isCompleted = !!completedModules[mod.id];
          const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'completed' && isCompleted) ||
            (activeFilter === 'pending' && !isCompleted);

          return matchesQuery && matchesFilter;
        });

        return {
          ...part,
          filteredModules: matchingModules
        };
      })
      .filter((part) => part.filteredModules.length > 0 || searchQuery.trim() === '');
  }, [currentTrack.parts, searchQuery, activeFilter, completedModules]);

  const TrackIcon = currentTrack.icon;

  return (
    <div className="interactive-roadmap-container fade-in-up">
      {/* Top Navigation & Hero Card */}
      <div className="glass-panel roadmap-hero">
        <div className="roadmap-hero-top">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="btn btn-text"
                style={{ padding: 0, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}
              >
                ← Back to All Roadmaps
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="track-pill">
                <TrackIcon size={16} />
                {currentTrack.badge}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{currentTrack.schedule}</span>
            </div>
            <h1 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '0.4rem 0' }}>
              {currentTrack.title}
            </h1>
            <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '800px', lineHeight: 1.6 }}>
              {currentTrack.subtitle}
            </p>
          </div>

          {/* Track Switcher */}
          <div className="track-switcher">
            <button
              onClick={() => setActiveTrackId('aiml')}
              className={`track-btn ${activeTrackId === 'aiml' ? 'active' : ''}`}
            >
              <Brain size={18} />
              AI & Machine Learning
            </button>
            <button
              onClick={() => setActiveTrackId('swe')}
              className={`track-btn ${activeTrackId === 'swe' ? 'active' : ''}`}
            >
              <Terminal size={18} />
              Software Engineering (SWE)
            </button>
          </div>
        </div>

        {/* Live Progress Card */}
        <div className="roadmap-progress-card" style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border)' }}>
          <div className="progress-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCheck size={20} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--foreground)' }}>Your Curriculum Mastery</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                {completedCount} of {allModules.length} syllabus modules completed
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {progressPercentage}%
              </span>
              {completedCount > 0 && (
                <button
                  onClick={handleResetProgress}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  title="Reset completed checkmarks"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Methodological Framework & Student Contract */}
      <div className="fade-in-up delay-1">
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--foreground)' }}>
          <Shield size={20} style={{ color: 'var(--primary)' }} />
          Methodological Framework & Student Contract
        </h2>
        <div className="contract-banner">
          {currentTrack.contract.map((rule, idx) => {
            const RuleIcon = rule.icon;
            return (
              <div key={idx} className="contract-card">
                <div className="contract-card-header">
                  <RuleIcon size={18} />
                  <span>{rule.title}</span>
                </div>
                <p>{rule.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls: Search, Filter, Expand/Collapse */}
      <div className="roadmap-controls fade-in-up delay-2">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Search topics, tools, or concepts (e.g. GraphRAG, PyTorch, FastAPI, Docker)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-pills">
            <button
              onClick={() => setActiveFilter('all')}
              className={`filter-pill-btn ${activeFilter === 'all' ? 'active' : ''}`}
            >
              All Topics ({allModules.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`filter-pill-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            >
              In Progress ({allModules.length - completedCount})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`filter-pill-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            >
              Mastered ({completedCount})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => toggleAllParts(true)}
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', borderRadius: '8px' }}
            >
              Expand All
            </button>
            <button
              onClick={() => toggleAllParts(false)}
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', borderRadius: '8px' }}
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Parts & Interactive Modules Timeline */}
      <div className="roadmap-parts-timeline fade-in-up delay-3">
        {filteredParts.map((part) => {
          const isExpanded = expandedParts[part.id] ?? true;
          const partCompletedCount = part.modules.filter((m) => !!completedModules[m.id]).length;
          const partTotalCount = part.modules.length;

          return (
            <div key={part.id} className="part-section">
              {/* Part Header Accordion */}
              <div className="part-header" onClick={() => togglePart(part.id)}>
                <div className="part-title-area">
                  <div className="part-number-badge">{part.number.replace('Part ', '')}</div>
                  <div>
                    <h2>{part.number}: {part.title}</h2>
                    <div className="part-subtitle">{part.subtitle}</div>
                  </div>
                </div>

                <div className="part-stats">
                  <span className="part-badge-count">
                    {partCompletedCount} / {partTotalCount} Done
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={22} style={{ color: 'var(--primary)' }} />
                  ) : (
                    <ChevronDown size={22} style={{ color: 'var(--muted-foreground)' }} />
                  )}
                </div>
              </div>

              {/* Modules List Container */}
              {isExpanded && (
                <div className="modules-list">
                  {part.filteredModules.map((mod) => {
                    const isChecked = !!completedModules[mod.id];

                    return (
                      <div
                        key={mod.id}
                        className={`module-item-card ${isChecked ? 'completed' : ''}`}
                      >
                        <div className="module-top-row">
                          <label className="checkbox-wrapper" onClick={() => toggleModuleCompletion(mod.id)}>
                            <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                              {isChecked && <CheckCircle2 size={16} color="#fff" />}
                            </div>
                            <div>
                              <h3 className={`module-title ${isChecked ? 'strike' : ''}`}>
                                {mod.name}
                              </h3>
                            </div>
                          </label>

                          {mod.visualTool && (
                            <span className="module-tag highlight" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Sparkles size={12} />
                              {mod.visualTool}
                            </span>
                          )}
                        </div>

                        <p className="module-desc">{mod.desc}</p>

                        <div className="module-tags">
                          {mod.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="module-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Signature Production Blueprints / Architectural Reference Systems */}
      <div className="fade-in-up delay-4" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Cpu size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--foreground)' }}>
              {activeTrackId === 'aiml' ? '5 Signature Production Blueprints' : '4 Core Workspace Architectural Projects'}
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
              {activeTrackId === 'aiml'
                ? 'Massive production-scale pipelines developed with out-of-core memory streaming, mixed-precision, and containerized agent swarms.'
                : 'Enterprise-grade reference applications designed from wireframes to cloud scaling and microservice meshes.'}
            </p>
          </div>
        </div>

        <div className="blueprints-grid">
          {currentTrack.blueprints.map((bp, idx) => (
            <div key={idx} className="blueprint-card">
              <div className="blueprint-header">
                <span className="blueprint-badge">{bp.number} • {bp.track}</span>
              </div>
              <h3>{bp.title}</h3>
              <p>{bp.desc}</p>
              
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {bp.tech.map((t, tIdx) => (
                  <span key={tIdx} className="module-tag" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="blueprint-footer">
                <div className="blueprint-visual-note">
                  <Sparkles size={14} />
                  <span>{bp.visualFoundation}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Production Grade</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Level Design (HLD) 30 Global Case Studies Section */}
      <div className="fade-in-up delay-4" style={{ marginTop: '2.5rem' }}>
        <div className="hld-showcase-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--foreground)' }}>
                High-Level Design (HLD) Global Case Studies (30 Scenarios)
              </h2>
              <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0 }}>
                Oral whiteboard defense scenarios covering distributed topology, sharding, caching, failover, and fault tolerance.
              </p>
            </div>
          </div>

          <div className="hld-tags-grid">
            {currentTrack.hldCases.map((caseStudy, cIdx) => (
              <div key={cIdx} className="hld-tag">
                {caseStudy}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmapView;
