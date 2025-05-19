import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login/login'
import Home from './Home/home';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
