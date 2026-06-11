import React, { useState } from 'react';
import { Settings, PlusCircle, BookOpen, Compass, Users } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('course'); // 'course', 'roadmap', 'mentor'
  const [successMsg, setSuccessMsg] = useState('');

  // Course Form States
  const [courseTitle, setCourseTitle] = useState('');
  const [courseLink, setCourseLink] = useState('');

  // Roadmap States
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapDesc, setRoadmapDesc] = useState('');

  // Mentor States
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorExpertise, setMentorExpertise] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally this would POST to specific admin endpoints
    setSuccessMsg(`Successfully staged your new ${activeTab} for backend insertion!`);
    setTimeout(() => setSuccessMsg(''), 5000);
    
    // reset current view inputs
    if(activeTab === 'course') { setCourseTitle(''); setCourseLink(''); }
    if(activeTab === 'roadmap') { setRoadmapTitle(''); setRoadmapDesc(''); }
    if(activeTab === 'mentor') { setMentorName(''); setMentorEmail(''); setMentorExpertise(''); }
  };

  return (
    <div className="fade-in-up" style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Settings size={28} style={{ color: 'var(--primary)' }} />
          <h1 className="text-gradient" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: 0 }}>Admin Control Center</h1>
        </div>
        <p className="text-muted">Manage core platform content natively. Only accessible to verified system administrators.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Sidebar Nav */}
        <div style={{ flex: '1', minWidth: '240px' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
             <h3 style={{ color: 'var(--card-title-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={18} style={{ color: 'var(--primary)' }} />
                Management Tools
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button onClick={() => { setActiveTab('course'); setSuccessMsg(''); }} className={`btn ${activeTab === 'course' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} />
                  Add Course
                </button>
                <button onClick={() => { setActiveTab('roadmap'); setSuccessMsg(''); }} className={`btn ${activeTab === 'roadmap' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Compass size={16} />
                  Add Roadmap
                </button>
                <button onClick={() => { setActiveTab('mentor'); setSuccessMsg(''); }} className={`btn ${activeTab === 'mentor' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} />
                  Add Mentor
                </button>
             </div>
          </div>
        </div>

        {/* Main Form Display */}
        <div style={{ flex: '2', minWidth: '280px' }}>
           <div className="glass-panel fade-in-up" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '16px' }}>
              <h2 style={{ color: 'var(--card-title-color)', marginBottom: '1.5rem', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}>
                 {activeTab === 'course' && 'Register New Course'}
                 {activeTab === 'roadmap' && 'Design Global Roadmap'}
                 {activeTab === 'mentor' && 'Register Verified Mentor'}
              </h2>
              
              {successMsg && (
                <div className="fade-in-up" style={{ padding: '1rem', background: 'rgba(60, 255, 120, 0.1)', border: '1px solid rgba(60, 255, 120, 0.3)', borderRadius: '8px', color: '#c5ffc5', marginBottom: '1.5rem' }}>
                  <strong>Success!</strong> {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* COURSE TAB */}
                {activeTab === 'course' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Course Title:</label>
                      <input type="text" className="form-control" placeholder="E.g., Master React 18" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginTop: '1.5rem' }}>
                      <label className="input-label">External Link/URL:</label>
                      <input type="url" className="form-control" placeholder="https://..." value={courseLink} onChange={(e) => setCourseLink(e.target.value)} required />
                    </div>
                  </>
                )}

                {/* ROADMAP TAB */}
                {activeTab === 'roadmap' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Roadmap Name:</label>
                      <input type="text" className="form-control" placeholder="E.g., Fullstack Python Developer" value={roadmapTitle} onChange={(e) => setRoadmapTitle(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginTop: '1.5rem' }}>
                      <label className="input-label">Core Description:</label>
                      <textarea className="form-control" placeholder="Outline the modules..." value={roadmapDesc} onChange={(e) => setRoadmapDesc(e.target.value)} rows="5" required style={{ resize: 'vertical' }}></textarea>
                    </div>
                  </>
                )}

                {/* MENTOR TAB */}
                {activeTab === 'mentor' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Mentor Full Name:</label>
                      <input type="text" className="form-control" placeholder="Jane Doe" value={mentorName} onChange={(e) => setMentorName(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginTop: '1.5rem' }}>
                      <label className="input-label">Mentor Email:</label>
                      <input type="email" className="form-control" placeholder="jane.doe@example.com" value={mentorEmail} onChange={(e) => setMentorEmail(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginTop: '1.5rem' }}>
                      <label className="input-label">Area of Expertise:</label>
                      <input type="text" className="form-control" placeholder="E.g., Backend Architecture, FastAPI" value={mentorExpertise} onChange={(e) => setMentorExpertise(e.target.value)} required />
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Deploy to Database</button>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
