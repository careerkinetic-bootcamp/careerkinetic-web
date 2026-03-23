import { useState } from 'react';
import Navbar from './components/Navbar';
import AuthSplitLayout from './components/AuthSplitLayout';
import CoursesPage from './components/CoursesPage';
import RoadmapsPage from './components/RoadmapsPage';
import TakeTestPage from './components/TakeTestPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import MentorshipPage from './components/MentorshipPage';
import OpportunitiesPage from './components/OpportunitiesPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="app-container">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="content-wrapper">
          {currentPage === 'home' && <AuthSplitLayout defaultIsLogin={false} onPageChange={setCurrentPage} />}
          {currentPage === 'login' && <AuthSplitLayout defaultIsLogin={true} onPageChange={setCurrentPage} />}
          {currentPage === 'courses' && <CoursesPage />}
          {currentPage === 'roadmaps' && <RoadmapsPage />}
          {currentPage === 'test' && <TakeTestPage />}
          {currentPage === 'mentorship' && <MentorshipPage />}
          {currentPage === 'opportunities' && <OpportunitiesPage />}
          {currentPage === 'about' && <AboutUsPage />}
          {currentPage === 'contact' && <ContactUsPage />}
        </main>
      </div>
    </>
  );
}

export default App;
