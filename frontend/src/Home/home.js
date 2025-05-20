import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import "./home.css"

export default function Home() {
  const [name] = useState('John') // This would typically come from your authentication state

  return (
    <>
      <header className="header">
        <h1 className="header-logo">YouWork</h1>
      </header>
      <div className="greeting-container">
        <h2 className="greeting">Welcome back, {name}!</h2>
        <p className="greeting-subtitle">Here's your personalized workout schedule</p>
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
    </>
  )
}