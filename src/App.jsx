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
import { useTheme } from './context/ThemeContext';
import './App.css';

function App() {
  const { isLoggedIn, isAdmin, isAuthReady, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [currentTrack, setCurrentTrack] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const handlePageChange = (page, track = null) => {
    setCurrentPage(page);
    setCurrentTrack(track);
  };

  if (!isAuthReady) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h1 className="text-gradient">Verifying Session...</h1></div>;
  }

  return (
    <div className="min-h-screen relative bg-background">
      <div className="absolute inset-0 -z-10 bg-gradient-hero pointer-events-none" />
      
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLogout={logout} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {currentPage === 'home' && <DashboardPage onPageChange={handlePageChange} />}
        {currentPage === 'login' && <AuthSplitLayout defaultIsLogin={true} onPageChange={handlePageChange} />}
        {currentPage === 'courses' && <CoursesPage />}
        {currentPage === 'roadmaps' && <RoadmapsPage initialTrack={currentTrack} onPageChange={handlePageChange} />}
        {currentPage === 'test' && <TakeTestPage onPageChange={handlePageChange} />}
        {currentPage === 'mentorship' && <MentorshipPage onPageChange={handlePageChange} />}
        {currentPage === 'opportunities' && (isLoggedIn ? <OpportunitiesPage /> : <DashboardPage onPageChange={handlePageChange} />)}
        {currentPage === 'about' && <AboutUsPage />}
        {currentPage === 'admin' && (isAdmin ? <AdminDashboard /> : <DashboardPage onPageChange={handlePageChange} />)}
        {currentPage === 'profile' && <ProfilePage onPageChange={handlePageChange} />}
        {currentPage === 'faqs' && <FaqPage />}
      </main>
    </div>
  );
}

export default App;
