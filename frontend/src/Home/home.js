import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import "./home.css"

export default function Home() {
  return (
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
  )
}