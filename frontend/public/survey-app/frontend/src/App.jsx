import React, { useState, useEffect } from 'react';
import SurveyPopup from './components/SurveyPopup';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (this could be replaced with actual authentication logic)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Check if the survey has been completed
      const surveyCompleted = localStorage.getItem('surveyCompleted');
      if (!surveyCompleted) {
        setShowSurvey(true);
      }
    }
  }, []);

  const handleSurveyClose = () => {
    setShowSurvey(false);
    localStorage.setItem('surveyCompleted', 'true'); // Mark survey as completed
  };

  return (
    <div>
      <h1>Welcome to the Survey App</h1>
      {isLoggedIn && showSurvey && <SurveyPopup onClose={handleSurveyClose} />}
      {/* Other components can be rendered here based on the app's state */}
    </div>
  );
};

export default App;