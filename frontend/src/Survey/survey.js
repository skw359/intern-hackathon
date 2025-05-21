import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/api';
import './survey.css';

export default function Survey() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    gender: '',
    experience: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      localStorage.setItem('hasCompletedSurvey', 'true');
      navigate('/home');
    } catch (err) {
      setError('Failed to save profile information. Please try again.');
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('hasCompletedSurvey');
    navigate('/');
  };

  return (
    <div className="survey-container">
      <form className="survey-form" onSubmit={handleSubmit}>
        <h2 className="survey-title">Tell us about yourself</h2>
        {error && <div className="error-message">{error}</div>}
        }
        
        <div className="form-group">
          <label htmlFor="weight">Weight (in kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            min="20"
            max="300"
            placeholder="Enter your weight"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="13"
            max="120"
            placeholder="Enter your age"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
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
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="button-group">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Continue to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}