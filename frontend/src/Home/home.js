import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { createWorkout } from '../services/api'
import "./home.css"

export default function Home() {
  const [name] = useState('John')
  const [showModal, setShowModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [workoutDescription, setWorkoutDescription] = useState('')
  const [dateWorkoutDescription, setDateWorkoutDescription] = useState('')
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Token:', token)
  }, [])

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
    setShowEventModal(true)
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
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
    try {
      setError(null)
      await createWorkout({ 
        description: workoutDescription,
        date: selectedDate || new Date().toISOString()
      })
      handleCloseModal()
    } catch (error) {
      console.error('Failed to create workout:', error)
      setError('Failed to create workout. Please try again.')
    }
  }

  const handleDateSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await createWorkout({
        description: dateWorkoutDescription,
        date: selectedDate
      })
      handleCloseDateModal()
    } catch (error) {
      console.error('Failed to create workout:', error)
      setError('Failed to create workout. Please try again.')
    }
  }

  return (
    <>
      <header className="header">
        <h1 className="header-logo">YouWork</h1>
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
          events={[
            { title: 'Launch', date: '2025-05-25' },
            ...workouts.map(workout => ({
              title: workout.title || workout.description,
              date: workout.date
            }))
          ]}
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
                  <button type="submit" className="submit-button">Submit</button>
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
            <div className="modal-content">
              <p><strong>Date:</strong> {selectedEvent.startStr}</p>
              <p><strong>Workout:</strong> {selectedEvent.title}</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCloseEventModal}>Close</button>
            </div>
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
                  <button type="submit" className="submit-button">Add Workout</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}