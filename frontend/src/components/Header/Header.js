import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ onProfileClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="header">
      <h1 className="header-logo">YouWork</h1>
      <div className="header-actions">
        <button className="profile-button" onClick={onProfileClick}>
          Profile
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}