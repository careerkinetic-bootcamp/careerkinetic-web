import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './CoursesPage.css';

const CoursesPage = () => {
  // Generate dummy courses
  const dummyCourses = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: `Course Module ${i + 1}`,
    description: "Learn the fundamentals and advanced concepts in this comprehensive interactive module."
  }));

  return (
    <div className="courses-page fade-in-up delay-1">
      {/* Search Header */}
      <div className="courses-header glass-panel fade-in-up delay-2">
        <h1 className="text-gradient">Courses</h1>
        <div className="search-bar">
          <input type="text" className="form-control" placeholder="Search a course..." />
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
            <option value="Popular">Popular</option>
          </select>
        </div>
        
        <div className="control-group filter-group">
          <label className="input-label">Filter</label>
          <div className="filter-dropdowns">
            <select className="form-control">
              <option value="" disabled selected>Language</option>
              <option value="python">Python</option>
              <option value="js">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
            <select className="form-control">
              <option value="" disabled selected>Domain</option>
              <option value="cs">Computer Science</option>
              <option value="aiml">AI/ML</option>
              <option value="math">Mathematics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="courses-grid fade-in-up delay-4">
        {dummyCourses.map((course, index) => (
          <div 
            key={course.id} 
            className="course-card glass-panel"
            style={{ animationDelay: `${0.4 + (index * 0.05)}s` }}
          >
            <div className="course-thumbnail"></div>
            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="text-muted">{course.description}</p>
              <button className="btn btn-outline btn-sm">Start Learning</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination fade-in-up delay-4">
        <button className="btn btn-text prev-next" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronLeft size={16} />
          Prev
        </button>
        <div className="page-numbers">
          <button className="page-item active">1</button>
          <button className="page-item">2</button>
          <button className="page-item">3</button>
          <button className="page-item">4</button>
          <button className="page-item">5</button>
          <span className="page-dots">...</span>
        </div>
        <button className="btn btn-text prev-next" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CoursesPage;
