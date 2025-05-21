import React from 'react';
import './Modals.css';

export default function ProfileModal({ show, onClose, profileData, setProfileData, onSubmit, error }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Edit Profile</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="weight">Weight (in kg)</label>
            <input
              type="number"
              id="weight"
              value={profileData.weight}
              onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
              required
              min="20"
              max="300"
              className="workout-input"
              placeholder="Enter your weight"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              value={profileData.age}
              onChange={(e) => setProfileData({...profileData, age: e.target.value})}
              required
              min="13"
              max="120"
              className="workout-input"
              placeholder="Enter your age"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={profileData.gender}
              onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
              required
              className="workout-input"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Fitness Experience Level</label>
            <select
              id="experience"
              value={profileData.experience}
              onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
              required
              className="workout-input"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-actions">
            <div className="button-group">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}