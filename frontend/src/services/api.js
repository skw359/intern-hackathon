import axios from 'axios';

const api = axios.create({
  baseURL: 'https://b5lmq7hc-3001.use.devtunnels.ms/api',
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

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(`Registration failed: ${error.response?.data?.message || error.message}`);
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.post('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
  }
};

export const getWorkouts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/workouts', {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return response.data.map(workout => ({
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
    const token = localStorage.getItem('token');
    const response = await api.post('/makeWorkout', workoutData, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create workout: ${error.response?.data?.message || error.message}`);
  }
};

export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/workouts/${workoutId}`, workoutData, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update workout: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/workouts/${workoutId}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete workout: ${error.response?.data?.message || error.message}`);
  }
};

export default api;