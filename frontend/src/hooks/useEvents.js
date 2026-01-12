import { useState, useEffect, useCallback } from 'react';
import { eventsAPI } from '../utils/api';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await eventsAPI.getAll();
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchTodayEvents = useCallback(async () => {
        try {
            const data = await eventsAPI.getToday();
            setTodayEvents(data);
        } catch (err) {
            console.error('Failed to fetch today events:', err);
        }
    }, []);

    const fetchUpcomingEvents = useCallback(async () => {
        try {
            const data = await eventsAPI.getUpcoming();
            setUpcomingEvents(data);
        } catch (err) {
            console.error('Failed to fetch upcoming events:', err);
        }
    }, []);

    const fetchEventsByMonth = useCallback(async (year, month) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await eventsAPI.getByMonth(year, month);
            setEvents(data);
            return data;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchEventsByDate = useCallback(async (date) => {
        try {
            const data = await eventsAPI.getByDate(date);
            return data;
        } catch (err) {
            console.error('Failed to fetch events by date:', err);
            return [];
        }
    }, []);

    const createEvent = useCallback(async (eventData) => {
        try {
            const newEvent = await eventsAPI.create(eventData);
            setEvents(prev => [...prev, newEvent]);
            await fetchTodayEvents();
            await fetchUpcomingEvents();
            return newEvent;
        } catch (err) {
            throw err;
        }
    }, [fetchTodayEvents, fetchUpcomingEvents]);

    const updateEvent = useCallback(async (id, eventData) => {
        try {
            const updatedEvent = await eventsAPI.update(id, eventData);
            setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
            await fetchTodayEvents();
            await fetchUpcomingEvents();
            return updatedEvent;
        } catch (err) {
            throw err;
        }
    }, [fetchTodayEvents, fetchUpcomingEvents]);

    const deleteEvent = useCallback(async (id) => {
        console.log('useEvents.deleteEvent called with id:', id);
        try {
            await eventsAPI.delete(id);
            console.log('API delete successful, updating local state');
            setEvents(prev => prev.filter(e => e.id !== id));
            await fetchTodayEvents();
            await fetchUpcomingEvents();
        } catch (err) {
            console.error('useEvents.deleteEvent error:', err);
            throw err;
        }
    }, [fetchTodayEvents, fetchUpcomingEvents]);

    const refreshEvents = useCallback(async () => {
        await Promise.all([
            fetchAllEvents(),
            fetchTodayEvents(),
            fetchUpcomingEvents()
        ]);
    }, [fetchAllEvents, fetchTodayEvents, fetchUpcomingEvents]);

    return {
        events,
        todayEvents,
        upcomingEvents,
        isLoading,
        error,
        fetchAllEvents,
        fetchTodayEvents,
        fetchUpcomingEvents,
        fetchEventsByMonth,
        fetchEventsByDate,
        createEvent,
        updateEvent,
        deleteEvent,
        refreshEvents
    };
};

export default useEvents;
