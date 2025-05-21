import React, { useState, useEffect } from 'react';
import { getWorkouts, createWorkout, deleteWorkout, updateWorkout, updateUserProfile, generateAndSaveWorkout } from '../services/api';
import Header from '../components/Header/Header';
import WorkoutCalendar from '../components/WorkoutCalendar/WorkoutCalendar';
import ProfileModal from '../components/Modals/ProfileModal';
import WorkoutModal from '../components/Modals/WorkoutModal';
import EventModal from '../components/Modals/EventModal';
import DateModal from '../components/Modals/DateModal';
import "./home.css";

export default function Home() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(localStorage.getItem('name') || 'User');
  const [showModal, setShowModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    weight: localStorage.getItem('weight') || '',
    age: localStorage.getItem('age') || '',
    gender: localStorage.getItem('gender') || '',
    experience: localStorage.getItem('experience') || ''
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setError(null);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load workouts:', error);
      setError('Failed to load workouts. Please check if the server is running and try again.');
    }
  };

  const handleAddPlan = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setWorkoutDescription('');
    setSelectedDate(null);
  };

  const handleEventClick = (clickInfo) => {
    const workout = workouts.find(w => w._id === clickInfo.event.extendedProps._id);

    setSelectedEvent(clickInfo.event);
    setSelectedWorkout(workout);
    setShowEventModal(true);
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedWorkout(null);
    setIsEditing(false);
  };

  const handleCloseDateModal = () => {
    setShowDateModal(false);
    setSelectedDate(null);
    setWorkoutTitle('');
    setExercises([]);
    setIsEditing(false);
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowDateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const workout = {
        title: 'Quick Workout',
        date: selectedDate || new Date().toISOString().split('T')[0],
        exercises: [{
          name: 'Exercise',
          description: workoutDescription,
          sets: 1,
          reps: 1
        }]
      };
      await createWorkout(workout);
      await loadWorkouts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to create workout:', error);
      setError('Failed to create workout. Please try again.');
    }
  };

  const handleDateSubmit = async (e) => {
    e.preventDefault();
    if (exercises.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    try {
      setError(null);
      const workoutData = {
        title: workoutTitle,
        date: selectedDate,
        exercises: exercises
      };

      if (isEditing && selectedWorkout?._id) {
        await updateWorkout(selectedWorkout._id, workoutData);
      } else {
        await createWorkout(workoutData);
      }
      
      await loadWorkouts();
      handleCloseDateModal();
    } catch (error) {
      console.error('Failed to save workout:', error);
      setError('Failed to save workout. Please try again.');
    }
  };

  const handleDeleteWorkout = async () => {
    if (!selectedEvent || !selectedEvent.extendedProps._id) {
      setError('Cannot delete this event');
      return;
    }

    try {
      setError(null);
      await deleteWorkout(selectedEvent.extendedProps._id);
      await loadWorkouts();
      handleCloseEventModal();
    } catch (error) {
      console.error('Failed to delete workout:', error);
      setError('Failed to delete workout. Please try again.');
    }
  };

  const handleEditWorkout = (workout) => {
    setWorkoutTitle(workout.title);
    setExercises(workout.exercises);
    setSelectedDate(workout.date);
    setIsEditing(true);
    setShowEventModal(false);
    setShowDateModal(true);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, {
      name: '',
      description: '',
      sets: 1,
      reps: 1
    }]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: field === 'sets' || field === 'reps' ? parseInt(value) || 0 : value
    };
    setExercises(newExercises);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await updateUserProfile(profileData);
      Object.entries(profileData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      setShowProfileModal(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const calendarEvents = workouts.map(workout => ({
    title: workout.title || 'Workout',
    date: workout.date.split('T')[0],
    extendedProps: {
      _id: workout._id,
      exercises: workout.exercises
    }
  }));

  const handleGenerateAndSave = async (e) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    // fall back to today if no date selected
    const dateStr = selectedDate || todayStr;

    // call the new backend route that runs Gemini + creates the workout
    const created = await generateAndSaveWorkout(workoutDescription, dateStr);

    // push it into state so calendar refreshes
    setWorkouts(ws => [...ws, created]);
    handleCloseModal();
  } catch (err) {
    console.error('Generate+Save error:', err);
    setError('Failed to generate workout plan. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      <Header onProfileClick={() => setShowProfileModal(true)} />
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
        <div className="error-message">
          {error}
        </div>
      )}
      <WorkoutCalendar
        events={calendarEvents}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
      />

      <WorkoutModal
        show={showModal}
        onClose={handleCloseModal}
        workoutDescription={workoutDescription}
        setWorkoutDescription={setWorkoutDescription}
        onSubmit={handleGenerateAndSave}
        error={error}
      />

      <EventModal
        show={showEventModal}
        onClose={handleCloseEventModal}
        event={selectedEvent}
        workout={selectedWorkout}
        onDelete={handleDeleteWorkout}
        onEdit={handleEditWorkout}
      />

      <DateModal
        show={showDateModal}
        onClose={handleCloseDateModal}
        date={selectedDate}
        workoutTitle={workoutTitle}
        setWorkoutTitle={setWorkoutTitle}
        exercises={exercises}
        onExerciseAdd={handleAddExercise}
        onExerciseRemove={handleRemoveExercise}
        onExerciseChange={handleExerciseChange}
        onSubmit={handleDateSubmit}
        error={error}
      />

      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileData={profileData}
        setProfileData={setProfileData}
        onSubmit={handleProfileSubmit}
        error={error}
      />
    </>
  );
}
