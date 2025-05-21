import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useNavigate } from 'react-router-dom'

import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from '../services/api'
import "./home.css"

export default function Home() {
  const navigate = useNavigate()
  const [name] = useState(localStorage.getItem('name') || 'User')
  const [showModal, setShowModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [workoutTitle, setWorkoutTitle] = useState('')
  const [exercises, setExercises] = useState([{ name: '', description: '', sets: 1, reps: 1 }])
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = async () => {
    try {
      setError(null)
      const data = await getWorkouts()
      setWorkouts(data)
    } catch (error) {
      console.error('Failed to load workouts:', error)
      setError('Failed to load workouts. Please check if the server is running and try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('name')
    navigate('/')
  }

  const handleAddPlan = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setWorkoutTitle('')
    setExercises([{ name: '', description: '', sets: 1, reps: 1 }])
    setSelectedDate(null)
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event)
    const workout = workouts.find(w => w._id === clickInfo.event.extendedProps._id)
    if (workout) {
      setWorkoutTitle(workout.title)
      setExercises(workout.exercises || [])
    }
    setShowEventModal(true)
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
    setIsEditing(false)
    setWorkoutTitle('')
    setExercises([{ name: '', description: '', sets: 1, reps: 1 }])
  }

  const handleCloseDateModal = () => {
    setShowDateModal(false)
    setSelectedDate(null)
    setWorkoutTitle('')
    setExercises([{ name: '', description: '', sets: 1, reps: 1 }])
  }

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    setShowDateModal(true)
  }

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', description: '', sets: 1, reps: 1 }])
  }

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      setError(null)
      await createWorkout({ 
        title: workoutTitle,
        date: selectedDate || new Date().toISOString(),
        exercises: exercises
      })
      await loadWorkouts()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to create workout:', error)
      setError('Failed to create workout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      setError(null)
      await createWorkout({
        title: workoutTitle,
        date: selectedDate,
        exercises: exercises
      })
      await loadWorkouts()
      handleCloseDateModal()
    } catch (error) {
      console.error('Failed to create workout:', error)
      setError('Failed to create workout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteWorkout = async () => {
    if (!selectedEvent || !selectedEvent.extendedProps._id) {
      setError('Cannot delete this event')
      return
    }

    try {
      setError(null)
      await deleteWorkout(selectedEvent.extendedProps._id)
      await loadWorkouts()
      handleCloseEventModal()
    } catch (error) {
      console.error('Failed to delete workout:', error)
      setError('Failed to delete workout. Please try again.')
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)
      await updateWorkout(selectedEvent.extendedProps._id, {
        title: workoutTitle,
        date: selectedEvent.startStr,
        exercises: exercises
      })
      await loadWorkouts()
      handleCloseEventModal()
    } catch (error) {
      console.error('Failed to update workout:', error)
      setError('Failed to update workout. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const calendarEvents = workouts.map(workout => ({
    title: workout.title,
    date: workout.date.split('T')[0],
    _id: workout._id
  }))

  const renderExerciseFields = (isEditMode = false) => (
    <div className="exercises-container">
      {exercises.map((exercise, index) => (
        <div key={index} className="exercise-item">
          <div className="exercise-header">
            <h4>Exercise {index + 1}</h4>
            {exercises.length > 1 && (
              <button 
                type="button" 
                className="remove-exercise-button"
                onClick={() => handleRemoveExercise(index)}
              >
                Remove
              </button>
            )}
          </div>
          <div className="exercise-fields">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={exercise.description}
                onChange={(e) => handleExerciseChange(index, 'description', e.target.value)}
                required
              />
            </div>
            <div className="exercise-numbers">
              <div className="form-group">
                <label>Sets:</label>
                <input
                  type="number"
                  min="1"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reps:</label>
                <input
                  type="number"
                  min="1"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button 
        type="button" 
        className="add-exercise-button"
        onClick={handleAddExercise}
      >
        Add Exercise
      </button>
    </div>
  )

  return (
    <>
      <header className="header">
        <h1 className="header-logo">YouWork</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="greeting-container">
        <div className="greeting-text">
          <h2 className="greeting">Welcome back, {name}!</h2>
          <p className="greeting-subtitle">Here's your personalized workout schedule</p>
        </div>
        <button className="add-plan-button" onClick={handleAddPlan}>
          Add Plan
        </button>
      </div>
      {error && (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', margin: '1rem' }}>
          {error}
        </div>
      )}
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          selectable={true}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Workout</h3>
              <button className="close-button" onClick={handleCloseModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="workoutTitle">Workout Title:</label>
                <input
                  id="workoutTitle"
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  required
                  className="workout-input"
                  placeholder="Enter workout title"
                />
              </div>
              {renderExerciseFields()}
              <div className="form-actions">
                <div className="disclaimer">
                  Please include all crucial details about your workout
                </div>
                <div className="button-group">
                  <button type="button" className="cancel-button" onClick={handleCloseModal}>Cancel</button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Workout Details</h3>
              <button className="close-button" onClick={handleCloseEventModal}>&times;</button>
            </div>
            {isEditing ? (
              <form className="modal-form" onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label htmlFor="workoutTitle">Workout Title:</label>
                  <input
                    id="workoutTitle"
                    type="text"
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    required
                    className="workout-input"
                  />
                </div>
                {renderExerciseFields(true)}
                <div className="modal-footer">
                  <div className="button-group">
                    <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="modal-content">
                  <p><strong>Date:</strong> {selectedEvent.startStr}</p>
                  <p><strong>Workout:</strong> {selectedEvent.title}</p>
                  {selectedEvent.extendedProps._id && workouts.find(w => w._id === selectedEvent.extendedProps._id)?.exercises && (
                    <div className="exercises-list">
                      <h4>Exercises:</h4>
                      {workouts.find(w => w._id === selectedEvent.extendedProps._id).exercises.map((exercise, index) => (
                        <div key={index} className="exercise-details">
                          <h5>{exercise.name}</h5>
                          <p>{exercise.description}</p>
                          <p>Sets: {exercise.sets} | Reps: {exercise.reps}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <div className="button-group">
                    <button className="cancel-button" onClick={handleCloseEventModal}>Close</button>
                    {selectedEvent.extendedProps._id && (
                      <>
                        <button className="edit-button" onClick={handleEditClick}>Edit</button>
                        <button className="delete-button" onClick={handleDeleteWorkout}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showDateModal && selectedDate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add Workout for {selectedDate}</h3>
              <button className="close-button" onClick={handleCloseDateModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleDateSubmit}>
              <div className="form-group">
                <label htmlFor="workoutTitle">Workout Title:</label>
                <input
                  id="workoutTitle"
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  required
                  className="workout-input"
                  placeholder="Enter workout title"
                />
              </div>
              {renderExerciseFields()}
              <div className="form-actions">
                <div className="button-group">
                  <button type="button" className="cancel-button" onClick={handleCloseDateModal}>Cancel</button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Add Workout'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}