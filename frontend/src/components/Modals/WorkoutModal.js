import React, { useState, useEffect } from 'react';
import './Modals.css';

export default function WorkoutModal({ 
  show, 
  onClose, 
  workoutDescription, 
  setWorkoutDescription, 
  onSubmit, 
  error,
  isSubmitting 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      // Reset states when opening
      setIsVisible(false);
      setShouldRender(true);
      
      // Force a reflow and start animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else if (shouldRender) {
      // Only start closing if we were actually rendered
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
      
      return () => clearTimeout(timer);
    }
  }, [show, shouldRender]);

  // Don't render anything if shouldRender is false
  if (!shouldRender) return null;

  return (
    <div 
      className="modal-overlay"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={onClose}
    >
      <div 
        className="modal"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Create Workout</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="workoutDescription">What kind of workout would you like? Include details like duration, focus areas, and any specific preferences.</label>
            <textarea
              id="workoutDescription"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              required
              className="workout-textarea"
              placeholder="Example: A 30-minute full body workout focusing on strength training"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-actions">
            <div className="disclaimer">
              
            </div>
            <div className="button-group">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Workout'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}