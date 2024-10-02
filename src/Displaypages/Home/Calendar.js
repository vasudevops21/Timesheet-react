import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day"></div>);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div key={i} className={`calendar-day ${i === 24 ? 'calendar-day-highlight' : ''}`}>
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="card">
      <div className="calendar-header">
        <h3>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
        <div className="calendar-nav">
          <button className="calendar-nav-button" onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
          <button className="calendar-nav-button" onClick={handleNextMonth}><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day calendar-day-header">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;