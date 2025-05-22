import React from 'react';
import './Modals.css';

export default function DateModal({ 
  show, 
  onClose, 
  date, 
  workoutTitle, 
  setWorkoutTitle, 
  exercises, 
  onExerciseAdd, 
  onExerciseRemove, 
  onExerciseChange, 
  onSubmit, 
  error,
  isSubmitting 
}) {
  if (!show || !date) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Add Workout for {date}</h3>
          <button className="close-button" onClick={onClose} disabled={isSubmitting}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="workoutTitle">Workout Title</label>
            <input
              type="text"
              id="workoutTitle"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              required
              className="workout-input"
              placeholder="Enter workout title"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="exercises-container">
            <h4>Exercises</h4>
            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-item">
                <div className="exercise-header">
                  <h4>Exercise {index + 1}</h4>
                  <button
                    type="button"
                    className="remove-exercise-button"
                    onClick={() => onExerciseRemove(index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
                <div className="exercise-fields">
                  <div className="form-group">
                    <label>Exercise Name</label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => onExerciseChange(index, 'name', e.target.value)}
                      required
                      className="workout-input"
                      placeholder="Enter exercise name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={exercise.description}
                      onChange={(e) => onExerciseChange(index, 'description', e.target.value)}
                      required
                      className="workout-textarea"
                      placeholder="Enter exercise description"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="exercise-numbers">
                    <div className="form-group">
                      <label>Sets</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => onExerciseChange(index, 'sets', e.target.value)}
                        required
                        className="workout-input"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="form-group">
                      <label>Reps</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => onExerciseChange(index, 'reps', e.target.value)}
                        required
                        className="workout-input"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="add-exercise-button"
              onClick={onExerciseAdd}
              disabled={isSubmitting}
            >
              Add Exercise
            </button>
          </div>

          <div className="form-actions">
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
                disabled={exercises.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Adding Workout...' : 'Add Workout'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
