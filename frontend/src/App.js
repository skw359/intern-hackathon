import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login/login'
import Register from './Register/register'
import Survey from './Survey/survey'
import Home from './Home/home'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

function App() {
  const isAuthenticated = localStorage.getItem('token')
  const hasCompletedSurvey = localStorage.getItem('hasCompletedSurvey')

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? (
            hasCompletedSurvey ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/survey" replace />
            )
          ) : (
            <Login />
          )} 
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/survey"
          element={
            <ProtectedRoute>
              <Survey />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App