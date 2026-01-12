import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../hooks/useEvents';
import MonthView from './Calendar/MonthView';
import WeekView from './Calendar/WeekView';
import DayView from './Calendar/DayView';
import EventForm from './Events/EventForm';
import EventList from './Events/EventList';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const {
        events,
        todayEvents,
        upcomingEvents,
        isLoading,
        fetchAllEvents,
        fetchTodayEvents,
        fetchUpcomingEvents,
        createEvent,
        updateEvent,
        deleteEvent
    } = useEvents();

    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchAllEvents();
        fetchTodayEvents();
        fetchUpcomingEvents();
    }, [fetchAllEvents, fetchTodayEvents, fetchUpcomingEvents]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowEventForm(true);
        setEditingEvent(null);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setSelectedDate(event.event_date);
        setShowEventForm(true);
    };

    const handleDeleteEvent = async (eventId) => {
        console.log('=== handleDeleteEvent called ===');
        console.log('Event ID to delete:', eventId);
        console.log('Event ID type:', typeof eventId);

        if (!eventId) {
            console.error('No event ID provided for deletion');
            alert('Error: No event ID');
            return;
        }

        // Temporarily removing confirmation for testing
        try {
            console.log('Calling deleteEvent...');
            await deleteEvent(eventId);
            console.log('deleteEvent completed successfully');
            // Force refresh
            await fetchAllEvents();
            await fetchTodayEvents();
            await fetchUpcomingEvents();
            console.log('All events refreshed');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete event: ' + (err.message || 'Unknown error'));
        }
    };

    const handleSubmitEvent = async (eventData) => {
        if (editingEvent) {
            await updateEvent(editingEvent.id, eventData);
        } else {
            await createEvent(eventData);
        }
        await fetchAllEvents();
    };

    const handleEventDrop = async (eventId, newDate) => {
        try {
            await updateEvent(eventId, { event_date: newDate });
            await fetchAllEvents();
        } catch (err) {
            alert('Failed to move event');
        }
    };

    const handleEventClick = (event) => {
        setEditingEvent(event);
        setSelectedDate(event.event_date);
        setShowEventForm(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatToday = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <span className="logo-icon">📅</span>
                        <span className="logo-text">CalendarPro</span>
                    </div>
                </div>

                <button
                    className="btn btn-primary create-btn"
                    onClick={() => {
                        setSelectedDate(new Date().toISOString().split('T')[0]);
                        setEditingEvent(null);
                        setShowEventForm(true);
                    }}
                >
                    <span>+</span> Create Event
                </button>

                <div className="sidebar-section">
                    <h3>Today's Events</h3>
                    <EventList
                        events={todayEvents}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                        emptyMessage="No events today"
                    />
                </div>

                <div className="sidebar-section">
                    <h3>Upcoming</h3>
                    <EventList
                        events={upcomingEvents.slice(0, 5)}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                        emptyMessage="No upcoming events"
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>{formatToday()}</h1>
                    </div>
                    <div className="header-right">
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${view === 'month' ? 'active' : ''}`}
                                onClick={() => setView('month')}
                            >
                                Month
                            </button>
                            <button
                                className={`toggle-btn ${view === 'week' ? 'active' : ''}`}
                                onClick={() => setView('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`toggle-btn ${view === 'day' ? 'active' : ''}`}
                                onClick={() => setView('day')}
                            >
                                Day
                            </button>
                        </div>
                        <button
                            className="btn btn-ghost dark-mode-btn"
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <div className="user-menu">
                            <span className="user-email">{user?.email}</span>
                            <button className="btn btn-secondary" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Calendar View */}
                <div className="calendar-container">
                    {isLoading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading calendar...</p>
                        </div>
                    ) : (
                        <>
                            {view === 'month' && (
                                <MonthView
                                    events={events}
                                    onDateClick={handleDateClick}
                                    selectedDate={selectedDate}
                                    onEventDrop={handleEventDrop}
                                    onEventClick={handleEventClick}
                                />
                            )}
                            {view === 'week' && (
                                <WeekView
                                    events={events}
                                    onDateClick={handleDateClick}
                                    selectedDate={selectedDate}
                                />
                            )}
                            {view === 'day' && (
                                <DayView
                                    events={events}
                                    selectedDate={selectedDate}
                                    onDateClick={handleDateClick}
                                />
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Event Form Modal */}
            {showEventForm && (
                <EventForm
                    event={editingEvent}
                    selectedDate={selectedDate}
                    onSubmit={handleSubmitEvent}
                    onClose={() => {
                        setShowEventForm(false);
                        setEditingEvent(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
