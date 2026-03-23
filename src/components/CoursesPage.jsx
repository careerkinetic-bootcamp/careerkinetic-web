import React from 'react';
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
          <button className="btn btn-primary search-btn">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="11" cy="11" r="8"></circle>
               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
             </svg>
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
        <button className="btn btn-text prev-next">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
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
        <button className="btn btn-text prev-next">
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default CoursesPage;
