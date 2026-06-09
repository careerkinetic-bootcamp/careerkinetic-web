import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = ({ onPageChange }) => {
  const { user, token, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    background: 'CS',
    address: '',
    githubUrl: '',
    linkedinUrl: '',
    leetcodeUrl: '',
    interests: '',
    hobbies: '',
    achievements: '',
    profilePic: ''
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    if (user && user.profile_data) {
      const data = user.profile_data;
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        gender: data.gender || '',
        background: data.background || 'CS',
        address: data.address || '',
        githubUrl: data.githubUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        leetcodeUrl: data.leetcodeUrl || data.linkedinUrl2 || data.secretCode || '',
        interests: Array.isArray(data.interests) ? data.interests.join(', ') : '',
        hobbies: Array.isArray(data.hobbies) ? data.hobbies.join(', ') : '',
        achievements: Array.isArray(data.achievements) ? data.achievements.join(', ') : '',
        profilePic: data.profilePic || user?.picture || ''
      });
      setIsEmailVerified(data.isEmailVerified || false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'https://93a7h43145.execute-api.us-east-1.amazonaws.com';
      const API_URL = `${BASE_URL.replace(/\/$/, '')}/api/auth/profile`;
      
      // Transform strings back to arrays as per the backend schema
      const payload = {
        ...formData,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        hobbies: formData.hobbies.split(',').map(i => i.trim()).filter(i => i !== ''),
        achievements: formData.achievements.split(',').map(i => i.trim()).filter(i => i !== ''),
        isEmailVerified // Explicitly include the verified status if required
      };

      await axios.put(API_URL, { profile_data: payload }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await refreshUser();

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '900px', margin: '2rem auto', padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Profile Settings</h1>
        <button onClick={() => onPageChange('home')} className="btn-text" style={{ fontSize: '1rem' }}>← Back to Home</button>
      </div>

      {message.text && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '12px', 
          marginBottom: '2rem', 
          background: message.type === 'success' ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 71, 87, 0.15)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--error)'}`,
          color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={formData.profilePic || `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=8a2be2&color=fff`} 
              alt="Profile" 
              style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 0 20px var(--primary-glow)' }} 
            />
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>Profile Photo</div>
            <button type="button" className="btn-text" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--primary)' }}>Update Photo</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column */}
          <div className="profile-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></span>
              General Information
            </h3>
            
            <div className="input-group">
              <label className="input-label">Full Name:</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" placeholder="Enter your full name" />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Email:
                {isEmailVerified && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }} title="Verified Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>}
              </label>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <input value={user?.email || ''} readOnly className="form-control" style={{ opacity: 0.7, cursor: 'not-allowed' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Phone:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="Enter phone number" />
            </div>

            <div className="input-group">
              <label className="input-label">Gender:</label>
              <input name="gender" value={formData.gender} onChange={handleChange} className="form-control" placeholder="e.g. Male, Female, Other" />
            </div>

            <div className="input-group">
              <label className="input-label">Background:</label>
              <select name="background" value={formData.background} onChange={handleChange} className="form-control">
                <option value="CS">Computer Science (CS)</option>
                <option value="Math">Mathematics</option>
                <option value="AI/ML">Artificial Intelligence (AI/ML)</option>
                <option value="Data Science">Data Science</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Address:</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="form-control" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Enter your address" />
            </div>
          </div>

          {/* Right Column */}
          <div className="profile-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.2rem' }}>Social & Additional Details</h3>
            
            <div className="input-group">
              <label className="input-label">Github URL:</label>
              <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="form-control" placeholder="https://github.com/username" />
            </div>

            <div className="input-group">
              <label className="input-label">LinkedIn URL:</label>
              <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="form-control" placeholder="https://linkedin.com/in/username" />
            </div>

            <div className="input-group">
              <label className="input-label">LeetCode URL:</label>
              <input name="leetcodeUrl" value={formData.leetcodeUrl} onChange={handleChange} className="form-control" placeholder="https://leetcode.com/username" />
            </div>

            <div className="input-group">
              <label className="input-label">Interests:</label>
              <input name="interests" value={formData.interests} onChange={handleChange} className="form-control" placeholder="e.g. Coding, Design, Music" />
            </div>

            <div className="input-group">
              <label className="input-label">Hobbies:</label>
              <input name="hobbies" value={formData.hobbies} onChange={handleChange} className="form-control" placeholder="e.g. Reading, Traveling, Gaming" />
            </div>

            <div className="input-group">
              <label className="input-label">Achievements:</label>
              <textarea name="achievements" value={formData.achievements} onChange={handleChange} className="form-control" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="List your key achievements" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2.5rem' }}>
          <button type="button" onClick={() => onPageChange('home')} className="btn btn-outline" style={{ minWidth: '140px' }} disabled={isLoading}>Cancel</button>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '140px' }} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
