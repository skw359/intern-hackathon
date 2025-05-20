import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login/login'
import Register from './Register/register'
import Home from './Home/home';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;