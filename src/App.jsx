import { useState } from 'react';
import Navbar from './components/Navbar';
import AuthSplitLayout from './components/AuthSplitLayout';
import CoursesPage from './components/CoursesPage';
import RoadmapsPage from './components/RoadmapsPage';
import TakeTestPage from './components/TakeTestPage';
import AboutUsPage from './components/AboutUsPage';
import FaqPage from './components/FaqPage';
import MentorshipPage from './components/MentorshipPage';
import OpportunitiesPage from './components/OpportunitiesPage';
import DashboardPage from './components/DashboardPage';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { isLoggedIn, isAdmin, isAuthReady, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (!isAuthReady) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h1 className="text-gradient">Verifying Session...</h1></div>;
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="app-container">
        {/* Pass down isLoggedIn status to Navbar to handle tab visibility */}
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={logout} />
        <main className="content-wrapper">
          {currentPage === 'home' && <DashboardPage />}
          {currentPage === 'login' && <AuthSplitLayout defaultIsLogin={true} onPageChange={setCurrentPage} />}
          {currentPage === 'courses' && <CoursesPage />}
          {currentPage === 'roadmaps' && <RoadmapsPage />}
          {currentPage === 'test' && <TakeTestPage />}
          {currentPage === 'mentorship' && (isLoggedIn ? <MentorshipPage /> : <DashboardPage />)}
          {currentPage === 'opportunities' && (isLoggedIn ? <OpportunitiesPage /> : <DashboardPage />)}
          {currentPage === 'about' && <AboutUsPage />}
          {currentPage === 'admin' && (isAdmin ? <AdminDashboard /> : <DashboardPage />)}
          {currentPage === 'profile' && <ProfilePage onPageChange={setCurrentPage} />}
          {currentPage === 'faqs' && <FaqPage />}
        </main>
      </div>
    </>
  );
}

export default App;
