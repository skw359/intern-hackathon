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
  const [workoutDescription, setWorkoutDescription] = useState('')
  const [dateWorkoutDescription, setDateWorkoutDescription] = useState('')
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editWorkoutDescription, setEditWorkoutDescription] = useState('')

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
    setWorkoutDescription('')
    setSelectedDate(null)
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event)
    setEditWorkoutDescription(clickInfo.event.title)
    setShowEventModal(true)
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
    setIsEditing(false)
    setEditWorkoutDescription('')
  }

  const handleCloseDateModal = () => {
    setShowDateModal(false)
    setSelectedDate(null)
    setDateWorkoutDescription('')
  }

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    setShowDateModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      setError(null)
      await createWorkout({ 
        description: workoutDescription,
        date: selectedDate || new Date().toISOString()
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
        description: dateWorkoutDescription,
        date: selectedDate
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
        description: editWorkoutDescription,
        date: selectedEvent.startStr
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

  const calendarEvents = [
    ...workouts.map(workout => ({
      title: workout.description || workout.title,
      date: workout.date.split('T')[0],
      _id: workout._id
    }))
  ]

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
                  Disclaimer: Please include all crucial details about your workout
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
                  <label htmlFor="editWorkoutDescription">Edit workout description:</label>
                  <textarea
                    id="editWorkoutDescription"
                    value={editWorkoutDescription}
                    onChange={(e) => setEditWorkoutDescription(e.target.value)}
                    required
                    className="workout-textarea"
                  />
                </div>
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
                <label htmlFor="dateWorkoutDescription">Describe your workout for this date:</label>
                <textarea
                  id="dateWorkoutDescription"
                  value={dateWorkoutDescription}
                  onChange={(e) => setDateWorkoutDescription(e.target.value)}
                  required
                  className="workout-textarea"
                  placeholder="Enter workout details"
                />
              </div>
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