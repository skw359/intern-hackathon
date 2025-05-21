import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSurvey } from '../services/api';
import './survey.css';

export default function Survey() {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await submitSurvey({
        age: parseInt(age),
        weight: parseInt(weight),
        experience
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to submit survey');
    }
  };

  return (
    <div className="survey-container">
      <h1 className="survey-logo">YouWork</h1>
      <form className="survey-form" onSubmit={handleSubmit}>
        <h2 className="survey-title">Tell us about yourself</h2>
        {error && <div className="error-message">{error}</div>}
        }
        
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="13"
            max="120"
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (in pounds)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            min="50"
            max="1000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Fitness Experience Level</label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Complete Survey
        </button>
      </form>
    </div>
  );
}