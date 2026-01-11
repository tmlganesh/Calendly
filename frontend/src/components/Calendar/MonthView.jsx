import { useState, useEffect } from 'react';
import './Calendar.css';

const MonthView = ({ events = [], onDateClick, selectedDate, onEventDrop, onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [draggedEvent, setDraggedEvent] = useState(null);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        return { daysInMonth, startingDay, year, month };
    };

    const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentDate);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const getEventsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.event_date === dateStr);
    };

    const isToday = (day) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return selectedDate === dateStr;
    };

    const handleDateClick = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDateClick?.(dateStr);
    };

    // Drag and drop handlers
    const handleDragStart = (e, event) => {
        e.stopPropagation();
        setDraggedEvent(event);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', event.id);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
        setDraggedEvent(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, day) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (draggedEvent && onEventDrop) {
            const newDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (newDate !== draggedEvent.event_date) {
                onEventDrop(draggedEvent.id, newDate);
            }
        }
        setDraggedEvent(null);
    };

    const handleEventClick = (e, event) => {
        e.stopPropagation();
        onEventClick?.(event);
    };

    const renderDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}`}
                    onClick={() => handleDateClick(day)}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day)}
                >
                    <span className="day-number">{day}</span>
                    {hasEvents && (
                        <div className="day-events">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                                <div
                                    key={event.id || idx}
                                    className="event-dot"
                                    title={event.title}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, event)}
                                    onDragEnd={handleDragEnd}
                                    onClick={(e) => handleEventClick(e, event)}
                                >
                                    <span className="event-preview">{event.title}</span>
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <span className="more-events">+{dayEvents.length - 3} more</span>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="month-view">
            <div className="calendar-header">
                <button className="nav-btn" onClick={() => navigateMonth(-1)}>
                    ‹
                </button>
                <h2 className="month-title">
                    {monthNames[month]} {year}
                </h2>
                <button className="nav-btn" onClick={() => navigateMonth(1)}>
                    ›
                </button>
            </div>

            <div className="calendar-grid">
                {dayNames.map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {renderDays()}
            </div>
        </div>
    );
};

export default MonthView;
