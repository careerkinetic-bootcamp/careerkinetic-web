import React, { useState } from 'react';
import { Search, Brain, Terminal, Sparkles, ArrowRight, Compass, Shield, Layers } from 'lucide-react';
import InteractiveRoadmapView from './InteractiveRoadmapView';
import './CoursesPage.css';

const ROADMAP_LIST = [
  {
    id: 'aiml',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Master out-of-core data architecture, neural networks, Transformer mechanisms, agentic multi-agent systems, 5 signature blueprints, and 30 HLD whiteboard defenses.',
    level: 'Advanced',
    icon: Brain,
    gradient: 'linear-gradient(135deg, oklch(0.7 0.22 295 / 0.2), oklch(0.72 0.22 330 / 0.2))',
    badge: '5 Blueprints • 30 HLD Cases',
    stats: '1.5 hrs/day • 5 days/week'
  },
  {
    id: 'swe',
    title: 'Software Engineering (SWE) Course',
    description: 'Production resilience, software observability, CS fundamentals, FastAPI backend, LocalStack cloud mocking, 4 core architectural projects, and 30 enterprise HLD case studies.',
    level: 'Comprehensive',
    icon: Terminal,
    gradient: 'linear-gradient(135deg, oklch(0.58 0.22 295 / 0.2), oklch(0.41 0.15 240 / 0.2))',
    badge: '4 Reference Systems • 30 HLDs',
    stats: '8 Months • 4 days/week'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Web Engineering',
    description: 'Modern frontend with React & TypeScript, state architecture, SSR rendering, database scaling, API security, and high-concurrency cloud infrastructure.',
    level: 'Intermediate',
    icon: Compass,
    gradient: 'linear-gradient(135deg, oklch(0.72 0.22 330 / 0.2), oklch(0.65 0.22 27 / 0.2))',
    badge: 'React 19 • Cloud Native',
    stats: '6 Months • Practical'
  },
  {
    id: 'cloud',
    title: 'Cloud & Distributed Systems',
    description: 'Kubernetes orchestration, Terraform infrastructure as code, gRPC microservice meshes, distributed caching, and zero-downtime CI/CD deployment pipelines.',
    level: 'Advanced',
    icon: Layers,
    gradient: 'linear-gradient(135deg, oklch(0.6 0.18 200 / 0.2), oklch(0.7 0.22 295 / 0.2))',
    badge: 'DevOps & SRE',
    stats: '4 Months • Systems'
  }
];

const RoadmapsPage = () => {
  const [selectedTrack, setSelectedTrack] = useState(null); // 'aiml', 'swe', or null for list view
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // If a specific track is selected or active, render the Interactive Roadmap View
  if (selectedTrack) {
    return (
      <InteractiveRoadmapView
        initialTrack={selectedTrack}
        onBack={() => setSelectedTrack(null)}
      />
    );
  }

  const filteredRoadmaps = ROADMAP_LIST.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = levelFilter === 'all' || item.level.toLowerCase() === levelFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="courses-page fade-in-up delay-1">
      {/* Search Header */}
      <div className="courses-header glass-panel fade-in-up delay-2">
        <div>
          <h1 className="text-gradient">Curriculum Roadmaps</h1>
          <p className="text-muted" style={{ margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
            Explore industry-calibrated curricula with interactive progression tracking, blueprints, and oral defense frameworks.
          </p>
        </div>
        <div className="search-bar">
          <input
            type="text"
            className="form-control"
            placeholder="Search a roadmap (e.g., AI/ML, SWE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary search-btn" style={{ padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Featured Interactive Mode Quick-Launch Banner */}
      <div
        className="glass-panel fade-in-up delay-2"
        style={{
          padding: '1.5rem 2rem',
          borderRadius: 'var(--radius-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.12), rgba(65, 105, 225, 0.08))',
          border: '1px solid rgba(138, 43, 226, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--foreground)' }}>
              Interactive Curriculum Mastery Tracker
            </h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.88rem' }}>
              Check off syllabus modules, explore 5 AI Blueprints, and inspect 30 High-Level Design (HLD) case studies.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedTrack('aiml')}
            className="btn btn-primary"
            style={{ borderRadius: '9999px', fontSize: '0.9rem', padding: '0.65rem 1.4rem' }}
          >
            Open AI & ML Track →
          </button>
          <button
            onClick={() => setSelectedTrack('swe')}
            className="btn btn-outline"
            style={{ borderRadius: '9999px', fontSize: '0.9rem', padding: '0.65rem 1.4rem' }}
          >
            Open SWE Track →
          </button>
        </div>
      </div>

      {/* Controls: Sort and Filter */}
      <div className="controls-section fade-in-up delay-3">
        <div className="control-group">
          <label className="input-label">Sort</label>
          <select className="form-control sort-select">
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="Popular">Most Popular</option>
          </select>
        </div>

        <div className="control-group filter-group">
          <label className="input-label">Filter by Level</label>
          <div className="filter-dropdowns">
            <select
              className="form-control"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="courses-grid fade-in-up delay-4">
        {filteredRoadmaps.map((map, index) => {
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
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    color: 'var(--foreground)',
                    fontWeight: 600
                  }}
                >
                  {map.stats}
                </span>
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
                  onClick={() => setSelectedTrack(map.id === 'swe' ? 'swe' : 'aiml')}
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
