import React, { useState } from 'react';
import './SurveyPopup.css';

const SurveyPopup = ({ onClose }) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('male');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = { age, weight, experience, gender };

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error('Failed to submit survey');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  return (
    <div className="survey-popup">
      <div className="survey-popup-content">
        <h2>Survey</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
          <label>
            Weight:
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </label>
          <label>
            Experience:
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          </label>
          <label>
            Gender:
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <button type="submit">Submit</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SurveyPopup;