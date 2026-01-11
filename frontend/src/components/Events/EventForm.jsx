import { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = ({ event, selectedDate, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: selectedDate || new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        notify_before: 10
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                event_date: event.event_date || selectedDate,
                start_time: event.start_time?.slice(0, 5) || '09:00',
                end_time: event.end_time?.slice(0, 5) || '10:00',
                notify_before: event.notify_before || 10
            });
        } else if (selectedDate) {
            setFormData(prev => ({ ...prev, event_date: selectedDate }));
        }
    }, [event, selectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        if (formData.start_time >= formData.end_time) {
            setError('End time must be after start time');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit({
                ...formData,
                notify_before: parseInt(formData.notify_before)
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save event');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="event-form-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{event ? 'Edit Event' : 'New Event'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-group">
                        <label htmlFor="title">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Add title"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="event_date">Date</label>
                        <input
                            type="date"
                            id="event_date"
                            name="event_date"
                            value={formData.event_date}
                            onChange={handleChange}
                        />
                        <span className="date-display">{formatDateDisplay(formData.event_date)}</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_time">Start Time</label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="end_time">End Time</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Add a description"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notify_before">Notify Before</label>
                        <select
                            id="notify_before"
                            name="notify_before"
                            value={formData.notify_before}
                            onChange={handleChange}
                        >
                            <option value="5">5 minutes</option>
                            <option value="10">10 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
