import React from 'react';
import './Modals.css';

export default function EventModal({ show, onClose, event, workout, onDelete, onEdit }) {
  if (!show || !event || !workout) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Workout Details</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <p><strong>Date:</strong> {event.startStr}</p>
          <p><strong>Title:</strong> {workout.title}</p>
          <div className="exercises-list">
            <h4>Exercises:</h4>
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="exercise-details">
                <h5>{exercise.name}</h5>
                <p><strong>Description:</strong> {exercise.description}</p>
                <p><strong>Sets:</strong> {exercise.sets}</p>
                <p><strong>Reps:</strong> {exercise.reps}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <div className="button-group">
            <button className="cancel-button" onClick={onClose}>Close</button>
            <button className="edit-button" onClick={() => onEdit(workout)}>Edit</button>
            {event.extendedProps._id && (
              <button className="delete-button" onClick={onDelete}>Delete</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}