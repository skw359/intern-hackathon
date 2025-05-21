import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './WorkoutCalendar.css';

export default function WorkoutCalendar({ events, onEventClick, onDateClick }) {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        selectable={true}
      />
    </div>
  );
}