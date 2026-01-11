import { useState } from 'react';
import './Calendar.css';

const WeekView = ({ events = [], onDateClick, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getWeekDates = (date) => {
        const current = new Date(date);
        const day = current.getDay();
        const diff = current.getDate() - day;
        const weekStart = new Date(current.setDate(diff));

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const weekDates = getWeekDates(currentDate);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const getEventsForDate = (date) => {
        const dateStr = formatDate(date);
        return events.filter(event => event.event_date === dateStr);
    };

    const formatHour = (hour) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    };

    const getEventPosition = (event) => {
        const [hours, minutes] = event.start_time.split(':').map(Number);
        const [endHours, endMinutes] = event.end_time.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const durationMinutes = (endHours * 60 + endMinutes) - startMinutes;

        return {
            top: `${(startMinutes / 60) * 60}px`,
            height: `${Math.max((durationMinutes / 60) * 60, 30)}px`
        };
    };

    const handleDateClick = (date) => {
        onDateClick?.(formatDate(date));
    };

    const getMonthRange = () => {
        const start = weekDates[0];
        const end = weekDates[6];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        if (start.getMonth() === end.getMonth()) {
            return `${months[start.getMonth()]} ${start.getFullYear()}`;
        }
        return `${months[start.getMonth()]} - ${months[end.getMonth()]} ${end.getFullYear()}`;
    };

    return (
        <div className="week-view">
            <div className="calendar-header">
                <button className="nav-btn" onClick={() => navigateWeek(-1)}>
                    ‹
                </button>
                <h2 className="month-title">{getMonthRange()}</h2>
                <button className="nav-btn" onClick={() => navigateWeek(1)}>
                    ›
                </button>
            </div>

            <div className="week-grid">
                <div className="time-column">
                    <div className="day-header-cell"></div>
                    {hours.map(hour => (
                        <div key={hour} className="hour-label">
                            {formatHour(hour)}
                        </div>
                    ))}
                </div>

                {weekDates.map((date, idx) => (
                    <div key={idx} className={`day-column ${isToday(date) ? 'today' : ''}`}>
                        <div
                            className="day-header-cell"
                            onClick={() => handleDateClick(date)}
                        >
                            <span className="day-name">{dayNames[idx].slice(0, 3)}</span>
                            <span className={`date-number ${isToday(date) ? 'today-number' : ''}`}>
                                {date.getDate()}
                            </span>
                        </div>
                        <div className="day-events-container">
                            {hours.map(hour => (
                                <div key={hour} className="hour-slot"></div>
                            ))}
                            {getEventsForDate(date).map((event, eventIdx) => (
                                <div
                                    key={eventIdx}
                                    className="week-event"
                                    style={getEventPosition(event)}
                                    title={`${event.title}\n${event.start_time} - ${event.end_time}`}
                                >
                                    <span className="event-time">{event.start_time.slice(0, 5)}</span>
                                    <span className="event-title">{event.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;
