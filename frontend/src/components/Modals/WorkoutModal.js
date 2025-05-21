import React from 'react';
import './Modals.css';

export default function WorkoutModal({ show, onClose, workoutDescription, setWorkoutDescription, onSubmit, error }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Add New Workout</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="workoutDescription">Describe your desired workout!</label>
            <textarea
              id="workoutDescription"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              required
              className="workout-textarea"
              placeholder="describe here"
            />
          </div>
          <div className="form-actions">
            <div className="disclaimer">
              Please include all crucial details about your workout
            </div>
            <div className="button-group">
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="submit-button">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}