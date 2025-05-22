import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      endpoint: error.config?.url
    });
    throw error;
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
  }
};

// after registration, call api.post('/auth/login', ...) to log the user in using the credentials they just used to register

// Once logged in, store the token, userId, and name in localStorage so that the subsequent requests can use them

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    const loginResponse = await api.post('/auth/login', { email, password });
    const { token, userId, name: userName } = loginResponse.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', userName);
    return loginResponse.data;
  } catch (error) {
    throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
  }
};

export const getWorkouts = async () => {
  try {
    const response = await api.get('/workouts');
    return response.data.map(workout => ({
      _id: workout._id,
      userId: workout.userId,
      title: workout.title || 'Workout',
      date: workout.date,
      exercises: workout.exercises || []
    }));
  } catch (error) {
    throw new Error(`Failed to fetch workouts: ${error.response?.data?.message || error.message}`);
  }
};

export const createWorkout = async (workoutData) => {
  try {
    const response = await api.post('/makeWorkout', workoutData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create workout: ${error.response?.data?.message || error.message}`);
  }
};

export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const response = await api.put(`/workouts/${workoutId}`, workoutData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update workout: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete workout: ${error.response?.data?.message || error.message}`);
  }
};

// services/api.js
export const generateAndSaveWorkout = async (description, date) => {
  const res = await api.post('/generateWorkout', { description, date });
  return res.data;  // the newly created Workout object
};

export default api;
