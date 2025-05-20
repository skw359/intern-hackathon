import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import "./home.css"

export default function Home() {
  const [name] = useState('John') // This would typically come from your authentication state
  const [showModal, setShowModal] = useState(false)
  const [workoutDescription, setWorkoutDescription] = useState('')

  const handleAddPlan = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setWorkoutDescription('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('New workout:', { description: workoutDescription })
    handleCloseModal()
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
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: 'Meeting', date: '2025-05-21' },
            { title: 'Launch', date: '2025-05-25' },
          ]}
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
                />
              </div>
              <div className="button-group">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="submit-button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}