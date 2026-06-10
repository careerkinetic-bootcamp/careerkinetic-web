import React from 'react';
import { Search } from 'lucide-react';
import './CoursesPage.css'; // Reusing the identical CSS layout from the Courses page

const RoadmapsPage = () => {
  // Generate dummy roadmaps to showcase the layout
  const dummyRoadmaps = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    title: `Career Roadmap ${i + 1}`,
    description: "Follow this step-by-step guided path to master the necessary skills for your career."
  }));

  return (
    <div className="courses-page fade-in-up delay-1">
      {/* Search Header */}
      <div className="courses-header glass-panel fade-in-up delay-2">
        <h1 className="text-gradient" style={{ textDecoration: 'underline' }}>Roadmaps</h1>
        <div className="search-bar">
          <input type="text" className="form-control" placeholder="search a roadmap..." />
          <button className="btn btn-primary search-btn" style={{ padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Search size={20} />
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
          </select>
        </div>
        
        <div className="control-group filter-group">
          <label className="input-label">Filter</label>
          <div className="filter-dropdowns">
            <select className="form-control">
              <option value="" disabled selected>Select filter</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="courses-grid fade-in-up delay-4">
        {dummyRoadmaps.map((map, index) => (
          <div 
            key={map.id} 
            className="course-card glass-panel"
            style={{ animationDelay: `${0.4 + (index * 0.05)}s` }}
          >
            <div className="course-thumbnail"></div>
            <div className="course-info">
              <h3>{map.title}</h3>
              <p className="text-muted">{map.description}</p>
              <button className="btn btn-outline btn-sm">View Roadmap</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapsPage;
