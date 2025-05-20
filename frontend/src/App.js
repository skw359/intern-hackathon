import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login/login'
import Register from './Register/register'
import Home from './Home/home';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;