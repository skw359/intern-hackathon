import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useNavigate } from 'react-router-dom'

import { getWorkouts, createWorkout, deleteWorkout, updateWorkout, updateUserProfile } from '../services/api'
import "./home.css"

export default function Home() {
  const navigate = useNavigate()
  const [name, setName] = useState(localStorage.getItem('name') || 'User')
  const [showModal, setShowModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [workoutDescription, setWorkoutDescription] = useState('')
  const [workoutTitle, setWorkoutTitle] = useState('')
  const [exercises, setExercises] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [profileData, setProfileData] = useState({
    weight: localStorage.getItem('weight') || '',
    age: localStorage.getItem('age') || '',
    gender: localStorage.getItem('gender') || '',
    experience: localStorage.getItem('experience') || ''
  })

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
    localStorage.clear()
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
    const workout = workouts.find(w => w.date === clickInfo.event.startStr)
    setSelectedEvent(clickInfo.event)
    setSelectedWorkout(workout)
    setShowEventModal(true)
  }

  const handleCloseEventModal = () => {
    setShowEventModal(false)
    setSelectedEvent(null)
    setSelectedWorkout(null)
  }

  const handleCloseDateModal = () => {
    setShowDateModal(false)
    setSelectedDate(null)
    setWorkoutTitle('')
    setExercises([])
  }

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    setShowDateModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      const workout = {
        title: 'Quick Workout',
        date: selectedDate || new Date().toISOString().split('T')[0],
        exercises: [{
          name: 'Exercise',
          description: workoutDescription,
          sets: 1,
          reps: 1
        }]
      }
      await createWorkout(workout)
      await loadWorkouts()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to create workout:', error)
      setError('Failed to create workout. Please try again.')
    }
  }

  const handleDateSubmit = async (e) => {
    e.preventDefault()
    if (exercises.length === 0) {
      setError('Please add at least one exercise')
      return
    }

    try {
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

  const handleAddExercise = () => {
    setExercises([...exercises, {
      name: '',
      description: '',
      sets: 1,
      reps: 1
    }])
  }

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises]
    newExercises[index] = {
      ...newExercises[index],
      [field]: field === 'sets' || field === 'reps' ? parseInt(value) || 0 : value
    }
    setExercises(newExercises)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await updateUserProfile(profileData)
      // Save profile data to localStorage
      Object.entries(profileData).forEach(([key, value]) => {
        localStorage.setItem(key, value)
      })
      setShowProfileModal(false)
    } catch (error) {
      setError('Failed to update profile. Please try again.')
    }
  }

  const calendarEvents = workouts.map(workout => ({
    title: workout.title || 'Workout',
    date: workout.date.split('T')[0],
    _id: workout._id
  }))

  return (
    <>
      <header className="header">
        <h1 className="header-logo">YouWork</h1>
        <div className="header-actions">
          <button className="profile-button" onClick={() => setShowProfileModal(true)}>
            Profile
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
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
                  Please include all crucial details about your workout
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

      {showEventModal && selectedEvent && selectedWorkout && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Workout Details</h3>
              <button className="close-button" onClick={handleCloseEventModal}>&times;</button>
            </div>
            <div className="modal-content">
              <p><strong>Date:</strong> {selectedEvent.startStr}</p>
              <p><strong>Title:</strong> {selectedWorkout.title}</p>
              <div className="exercises-list">
                <h4>Exercises:</h4>
                {selectedWorkout.exercises.map((exercise, index) => (
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
                <button className="cancel-button" onClick={handleCloseEventModal}>Close</button>
                {selectedEvent.extendedProps._id && (
                  <button className="delete-button" onClick={handleDeleteWorkout}>Delete</button>
                )}
              </div>
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
                <label htmlFor="workoutTitle">Workout Title</label>
                <input
                  type="text"
                  id="workoutTitle"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  required
                  className="workout-input"
                  placeholder="Enter workout title"
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
                        onClick={() => handleRemoveExercise(index)}
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
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                          required
                          className="workout-input"
                          placeholder="Enter exercise name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={exercise.description}
                          onChange={(e) => handleExerciseChange(index, 'description', e.target.value)}
                          required
                          className="workout-textarea"
                          placeholder="Enter exercise description"
                        />
                      </div>
                      <div className="exercise-numbers">
                        <div className="form-group">
                          <label>Sets</label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                            required
                            className="workout-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Reps</label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                            required
                            className="workout-input"
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

              <div className="form-actions">
                <div className="button-group">
                  <button type="button" className="cancel-button" onClick={handleCloseDateModal}>Cancel</button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={exercises.length === 0}
                  >
                    Add Workout
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="close-button" onClick={() => setShowProfileModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="weight">Weight (in kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                  required
                  min="20"
                  max="300"
                  className="workout-input"
                  placeholder="Enter your weight"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                  required
                  min="13"
                  max="120"
                  className="workout-input"
                  placeholder="Enter your age"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={profileData.gender}
                  onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  required
                  className="workout-input"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Fitness Experience Level</label>
                <select
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  required
                  className="workout-input"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="form-actions">
                <div className="button-group">
                  <button type="button" className="cancel-button" onClick={() => setShowProfileModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Save Changes
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