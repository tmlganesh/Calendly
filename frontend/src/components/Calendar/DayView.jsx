import { useState } from 'react';
import './Calendar.css';

const DayView = ({ events = [], selectedDate, onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(
        selectedDate ? new Date(selectedDate) : new Date()
    );

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const navigateDay = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        setCurrentDate(newDate);
        const dateStr = formatDate(newDate);
        onDateClick?.(dateStr);
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isToday = () => {
        const today = new Date();
        return currentDate.toDateString() === today.toDateString();
    };

    const formatHour = (hour) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    };

    const getEventsForDay = () => {
        const dateStr = formatDate(currentDate);
        return events.filter(event => event.event_date === dateStr);
    };

    const getEventPosition = (event) => {
        const [hours, minutes] = event.start_time.split(':').map(Number);
        const [endHours, endMinutes] = event.end_time.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const durationMinutes = (endHours * 60 + endMinutes) - startMinutes;

        return {
            top: `${(startMinutes / 60) * 60}px`,
            height: `${Math.max((durationMinutes / 60) * 60, 40)}px`
        };
    };

    const dayEvents = getEventsForDay();

    return (
        <div className="day-view">
            <div className="calendar-header">
                <button className="nav-btn" onClick={() => navigateDay(-1)}>
                    ‹
                </button>
                <h2 className="month-title">
                    {isToday() && <span className="today-badge">Today</span>}
                    {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
                </h2>
                <button className="nav-btn" onClick={() => navigateDay(1)}>
                    ›
                </button>
            </div>

            <div className="day-schedule">
                <div className="time-labels">
                    {hours.map(hour => (
                        <div key={hour} className="hour-label">
                            {formatHour(hour)}
                        </div>
                    ))}
                </div>

                <div className="schedule-content">
                    {hours.map(hour => (
                        <div key={hour} className="hour-slot"></div>
                    ))}

                    {dayEvents.map((event, idx) => (
                        <div
                            key={idx}
                            className="day-event"
                            style={getEventPosition(event)}
                        >
                            <div className="event-content">
                                <span className="event-title">{event.title}</span>
                                <span className="event-time">
                                    {event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}
                                </span>
                                {event.description && (
                                    <span className="event-description">{event.description}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DayView;
